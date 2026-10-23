# 06 · Clerk auth behind the existing screens

Status: done

## Goal
Replace the mocked auth from plan 05 with Clerk while keeping every screen as is: onboarding, sign-up, verify-email, sign-in, and home.

What guests can do afterwards:
- Create an account and confirm it with the emailed 6-digit code.
- Sign in with email and password, adding a code on a new device.
- Continue with Google.
- Stay signed in across reloads and app restarts, and sign out.

Signed-out guests always land on onboarding.

## Decisions
- **Build on current `master` (`dfff788`, plan 05 merged).** The first attempt was built on a stale `master` and is in `git stash` "clerk-auth-v1 built on stale master". Use it only as a reference for Clerk calls.
- **Clerk is already set up.**
  - Packages: `@clerk/expo` 4.14.0, `expo-secure-store`, and `expo-auth-session`, all in `package.json`. `app.json` has the `expo-secure-store` plugin. `.env.local` has the keys and `.env.example` lists the names.
  - Dev instance (`app_3L58Xq7ZuU0JUTldw0tzNUnfHnL`): password min 8 (matches `MIN_PASSWORD_LENGTH`), optional first/last name, email code verification, Google enabled.
  - Nothing here needs to change.
- **Keep the seams.**
  - `useSession()` keeps returning `{ isSignedIn, user: { name?, email } | null, signOut }`, now backed by Clerk's `useAuth()` / `useUser()`. It adds `isLoaded`.
  - The screens' hooks call Clerk directly where they called `mock-auth`.
  - Delete `src/lib/auth/mock-auth.ts` and `mock-session.ts`.
- **Clerk API.** Use only the current method-based API from `useSignIn()` / `useSignUp()`:
  - `signUp.password`, `signUp.verifications.sendEmailCode` / `verifyEmailCode`
  - `signIn.password`, `signIn.mfa.sendEmailCode` / `verifyEmailCode`
  - `finalize`, `reset`
  - Never import `@clerk/expo/legacy`. The Clerk MCP's SDK snippets are legacy-shaped, so don't copy them.
- **Validation stays on the device first.** `validation.ts` checks every field on submit and shows every error at once. Only a valid form calls Clerk. Clerk's own errors then show:
  - Field errors (`errors.fields.emailAddress` / `identifier`, `password`, `code`) appear under that field when the field has no local error, e.g. "That email address is taken" or a breached password.
  - Anything else appears in the screen's existing error `StatusBanner`.
- **Routing.** Keep the root `Stack.Protected` guards:
  - Signed out: `index` (onboarding) and `(auth)`.
  - Signed in: `home`.
  - `design-system` stays outside both.

  `ClerkProvider` (with `tokenCache`) wraps them. The guard waits for `isLoaded`, and the splash screen stays up until fonts and Clerk are both ready. Result: a reload shows onboarding when signed out and home when signed in, with no flash of the wrong screen. Success paths don't navigate; the guard flip does it, as in plan 05.
- **Sign-up.** `signUp.password({ emailAddress, password, firstName, lastName })`, where Full name is split in code: first word, then the rest. Then `sendEmailCode()`, then `router.push("/verify-email")`.
  - If `signUp.missingFields` includes `protect_check`, show a support banner. Clerk Protect challenges only web sign-ups, and ClerkJS's own dialog runs it there; native sign-ups aren't challenged.
- **Verify-email** serves both flows, so there are no route params. It reads the mode from Clerk's state:
  - **Sign-in mode:** `signIn.status` is `needs_client_trust` / `needs_second_factor`. Body: "…to confirm it's you."; button "Verify"; Back calls `signIn.reset()`.
  - **Sign-up mode:** `signUp` is waiting on `email_address`. Copy unchanged.
  - **Neither** (deep link or reload): redirect to `/sign-up`, as today.
  - Email shown: `signUp.emailAddress` or `signIn.identifier`.
  - Verify, then `finalize()`. Resend uses the matching `send` call and keeps the 30s cooldown. A wrong code shows Clerk's message.
- **Sign-in.** `signIn.password({ emailAddress, password })`:
  - `complete` → `finalize()`.
  - `needs_client_trust` / `needs_second_factor` with an `email_code` factor → `signIn.mfa.sendEmailCode()`, then `push("/verify-email")`.
  - Anything else → banner "This account needs a sign-in method roam doesn't support yet. Contact support."
  - Forgot password keeps its alert, with copy "Password reset is coming soon."
- **Finalize.** Pass a `navigate` callback that does nothing, since the guard navigates. If `session.currentTask` is set, the screen shows "Your account needs an extra setup step roam doesn't support yet. Contact support."
- **Google.** `useOAuthSignIn` uses the stable `useSSO()` from `@clerk/expo` (`strategy: "oauth_google"`, then `setActive({ session: createdSessionId })`). Cancelling is silent, and an error shows in the banner.
  - Onboarding's "Continue with Google" runs it directly instead of opening `/sign-up`.
- **Apple is hidden.** `SocialButtons` renders Google only until Apple is set up in Clerk. `AppleLogo` stays in `ui/`. `OAuthProvider` becomes `"google"` and moves to `src/lib/auth/types.ts`.
- **Onboarding sign-in link.** Under the two buttons: `AuthSwitchLink` "Already have an account?" / "Sign in" → `router.push("/sign-in")`. It isn't in the mockup, so the footer gap is checked on screen.
- **Home.** `user.name` comes from Clerk's `fullName`, falling back to the primary email. Sign out calls Clerk `signOut()`.
- **Clerk helpers** go in `src/lib/auth/clerk.ts`: `splitFullName`, `clerkErrorMessage` (API errors use `errors[0].longMessage ?? message`, not the formatted `.message`), and `fieldMessage`. Messages go in `src/constants/auth.ts`.

## Out of scope
- Apple sign-in, password reset, MFA enrollment / session tasks UI, and onboarding's Skip behavior (unchanged).
- API-route session checks (there are no API routes yet), PostHog identify, the production instance, and dev builds.

## Steps
### 1. Provider, session seam, guards
- `src/app/_layout.tsx`: `ClerkProvider publishableKey tokenCache` (throw a short error if the key is missing) around `<AppNavigator />`.
- `src/components/app-navigator/app-navigator.tsx` (+ `index.ts`, `use-app-navigator.ts`): fonts and `useSession().isLoaded` gate rendering and hiding the splash. It renders the existing `Stack` with both `Stack.Protected` groups unchanged. `useAppFonts` stops hiding the splash itself and only reports readiness.
- `src/hooks/use-session.ts`: Clerk-backed, same return shape plus `isLoaded`.
- Delete `mock-session.ts`.

Done when tsc passes and a cold load signed out shows onboarding.

### 2. Clerk helpers and Google
- Add `src/lib/auth/clerk.ts`, `src/lib/auth/types.ts`, and `src/constants/auth.ts`.
- `src/hooks/use-oauth-sign-in.ts`: `useSSO` as above.
- `SocialButtons`: Google only.
- Onboarding: Continue with Google calls `continueWith("google")` (with loading on the button), and the new Sign in link pushes `/sign-in`.

### 3. Sign-up and verify-email
- `use-sign-up.ts`: Clerk calls, merged field errors, and the Protect guard.
- `use-verify-email.ts`: mode detection, verify/resend per mode, finalize. `index.tsx` copy per mode.
- Delete `mock-auth.ts`.

### 4. Sign-in and home
- `use-sign-in.ts`: Clerk calls, plus the code path to `/verify-email`.
- `use-home.ts`: reads the Clerk user.

### 5. Docs
- Update `/design-system` if `SocialButtons` is previewed there.
- Update CLAUDE.md (see below).

## Verification
- `npx expo lint` and `npx tsc --noEmit` pass.
- Web (`npx expo start --web`), driven in headless Chrome over CDP at phone width with a Clerk testing token:
  1. Cold load signed out → onboarding at `/`. The Sign in link opens `/sign-in`; Get started opens `/sign-up`.
  2. Empty submits show every field's error at once: sign-up shows name, email, and password; sign-in shows email and password.
  3. Sign in with an existing `+clerk_test` account: a wrong password shows Clerk's message, then `/verify-email` in sign-in mode. A wrong code shows an error; `424242` lands on home with the name.
  4. Reload on home stays signed in. Sign out goes to onboarding. Reload stays on onboarding.
  5. Sign-up reaches Clerk. On web, Clerk Protect's dialog blocks headless Chrome; this is expected and reported.
- Native request path: replay sign-up → verify, and new-device sign-in → code, with the `@clerk/expo` request shape (`_is_native=1`, `x-mobile`), as in the first attempt.
- Screenshot onboarding (new link), sign-up, sign-in, and verify-email (both modes), and compare with the mockups and plan 05's screens.
- Not possible here: an iOS simulator run (no Xcode) and a real Google round trip. Report them as unchecked.

## AGENTS.md updates
- Expo / routes: `useSession()` is Clerk-backed with `isLoaded`. The splash stays until fonts and Clerk are ready. Remove "auth is mocked … until Clerk replaces the mock".
- Who owns what → Auth:
  - Method-based `@clerk/expo` hooks only.
  - Google via stable `useSSO`.
  - Sessions persist via `tokenCache`.
  - `/verify-email` serves sign-up and new-device sign-in.
  - Client validation first, then Clerk's errors.
  - Clerk Protect challenges web sign-ups only.
  - Test with `+clerk_test` emails and `424242`.
  - Dev instance: password min 8, optional names.
- Apple is hidden until it's configured in Clerk.

## Result
Built as planned on `master` `dfff788`. The mock (`mock-auth.ts`, `mock-session.ts`) is gone, and every plan 05 screen is kept. Lint and tsc pass.

Additions beyond the plan's file list:
- `src/components/app-navigator/` holds the guards, because `ClerkProvider` must wrap the component that reads the session.
- `pendingCodeFlow` lives in `src/lib/auth/clerk.ts` and is shared by sign-in and verify-email.
- The onboarding slide's footer spacer grew from `h-31` to `h-40` for the Sign in link.

Verified on web (headless Chrome over CDP, 393pt wide, Clerk testing token):
- Onboarding at `/`; the Sign in link opens `/sign-in`.
- Empty submits show every field's error: name, email, and password on sign-up; email and password on sign-in.
- Wrong password, then `/verify-email` in sign-in mode; a wrong code shows "Incorrect code"; `424242` lands on `/home` as "Joanna Van Smith".
- `/` and `/sign-in` redirect to `/home` while signed in; sign out goes to `/`, and a reload stays on onboarding.
- A taken email shows Clerk's "That email address is taken" under the email field.

Native request path, replayed with the `@clerk/expo` shape: sign-up → code → complete, and new-device sign-in → code → complete, with no Protect check.

Not verified: an iOS/Android run (no Xcode here), the Google round trip, and a full web sign-up, which Clerk Protect's dialog blocks for headless browsers.

The first attempt, built on a stale `master`, is in `git stash` "clerk-auth-v1 built on stale master". It's superseded and safe to drop.
