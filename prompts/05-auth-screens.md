# 05 · Auth screens (mocked)

Status: done

## Goal
Guests can create an account, verify their email with a code, or sign in, using screens that match `assets/prompt-imgs/auth.png`. Each path ends on a placeholder home screen. Auth is mocked behind a small module shaped like Clerk's flow, so Clerk can replace it later without changing the screens.

## Decisions
- **Screens:** `/sign-up` (the design), `/verify-email`, and `/sign-in`. Only Create account is designed. The other two reuse its header, type, fields, buttons, and spacing exactly. Each comes from a matching `src/screens/<name>/` folder.
- **After auth:** a new **marked placeholder** `/home` (`src/app/home.tsx` → `src/screens/home/`). It shows "Signed in as <name or email>" and a secondary "Sign out" button.
- **Mock session + guards:** `src/lib/auth/mock-session.ts` is an in-memory store (`{ user: { name?, email } | null }`, plus `signIn`/`signOut` setters and subscribe). `src/hooks/use-session.ts` reads it with `useSyncExternalStore` and returns `{ isSignedIn, user, signOut }`. The root layout wraps `index` + `(auth)` in `Stack.Protected guard={!isSignedIn}` and `home` in `Stack.Protected guard={isSignedIn}`. Signing in or out redirects automatically and clears the other side's history, so Back can't return to the forms. This is the same shape Clerk's `useAuth().isSignedIn` will plug into. It also gives onboarding the "signed-in users skip it" redirect for free. The session resets on reload; persistence comes with Clerk.
- **Mock auth API:** `src/lib/auth/mock-auth.ts` exports async `signUp({ name, email, password })`, `verifyEmailCode({ email, code })`, `resendEmailCode({ email })`, `signIn({ email, password })`, and `signInWithOAuth(provider: "google" | "apple")`. Each waits ~800 ms and returns `{ ok: true } | { ok: false, error: string }`. Behavior:
  - `signUp`: succeeds and remembers the pending name/email (in the module) for verification.
  - `verifyEmailCode`: `424242` (Clerk's test code) succeeds and signs the user in. Anything else returns "That code isn't right. Check your email and try again."
  - `signIn`: succeeds for any input that passes validation, using the email as the user.
  - `signInWithOAuth`: succeeds as "Google guest" / "Apple guest" (`guest@example.com`).
- **Navigation:** sign-up → `router.push("/verify-email")` (the email is read from the mock's pending sign-up, not URL params, so it never appears in a route). Sign-up ↔ sign-in footer links use `router.replace`, so the stack never grows and Back always returns to onboarding. Verify success, sign-in success, and social success just call the mock, and the guard switch to `/home` does the rest. Verify's Back returns to sign-up with its fields intact. If `/verify-email` opens with no pending sign-up (deep link or reload), it redirects to `/sign-up`. Onboarding's three buttons keep going to `/sign-up`.
- **Validation (code, `src/lib/auth/validation.ts`):** name required (trimmed); email must match a simple `x@y.z` pattern (trimmed, lowercased before use); password at least 8 characters. Errors show under each field after the first submit attempt, then update live as the guest types. Submit is never disabled on sign-up/sign-in (tapping it reveals errors). Verify's button is disabled until 6 digits are entered.
- **Loading and errors:** the active button shows its spinner (`loading`) and the other buttons on the screen are disabled while a request runs. A failed request shows the existing `StatusBanner` (error tone) above the primary button.
- **Keyboard:** each screen is a `ScrollView` with `keyboardShouldPersistTaps="handled"` and `automaticallyAdjustKeyboardInsets` (iOS). Fields chain with `returnKeyType="next"` → focus next. The last field uses `"go"` and submits. Correct `textContentType`/`autoComplete` per field (`name`, `email`, `newPassword` on sign-up, `password` on sign-in, `oneTimeCode`), `autoCapitalize="none"` on email/password, `keyboardType="email-address"`.
- **Forgot password:** a right-aligned link under sign-in's password field. It shows `Alert.alert("Password reset", "Password reset arrives with Clerk.")`.
- **Apple glyph:** `expo-symbols` `SymbolView name="apple.logo"` on iOS (Apple's own glyph, already a dependency). Material Symbols has no Apple logo, so Android/web render a **marked placeholder** fallback: a 24×24 ink circle with a white "A". The official asset can replace it later.
- **Shared auth components:** `src/components/auth/<name>/` (folder per component, like `ui/`), because three screens use them: `auth-screen` (safe area, ScrollView, header with back + wordmark, padding), `auth-intro` (hero title + lead), `or-divider`, `social-buttons` (Google + Apple, with props `onGoogle`, `onApple`, `loadingProvider`, `disabled`), `auth-switch-link` ("Already have an account? **Sign in**").
- **Existing placeholder:** the current `src/screens/sign-up/` placeholder is replaced, not kept.

### Design spec (390 pt wide; *est* = measured from the mockup at ~0.574 pt/px)
- **Background:** `bg-surface`. Horizontal padding 24.
- **Header:** top = safe-area top + 8. Left: back button, a 48 circle (`IconButton size="md"`, about 43 *est*, so the existing size wins), white with a 1px `border` outline (new `outline` variant), `back` icon in ink. Right: `Wordmark size="sm"`, vertically centered with the button.
- **Intro:** 28 *est* below the header. Title `type-hero`, ink, broken by hand: "Create\nyour account". Then a 12 gap and the body in `type-lead`, `secondary` (*est*; it reads light gray, so this gets checked in the comparison and may become `tertiary`): "Join roam to save your stays, get personalized recommendations and access them across all your devices."
- **Fields:** 24 *est* below the intro, gap 12. A new **labelled** `TextField`: when `label` is set, the field grows to fit two lines, about 60 tall *est* (`py-2.5`), with the label in `type-body-medium` ink and the input below it (placeholder `ink-tertiary`). Leading icon 24 ink, `px-5`, about 20 gap to the text *est*. It keeps the existing radius `lg`, muted bg, 1px border, and focus ring. A new `error` prop sets a `danger` border and shows the message below the field in `type-caption` `danger`.
  - Full name · `user` · "e.g. Adrian Hajdin"
  - Email address · new `mail` icon (`Mail`) · "you@example.com"
  - Password · `lock` · "At least 8 characters" · eye toggle on the right (hidden shows `eyeOff`, as designed)
- **Primary:** 24 *est* below the fields. `Button` "Create account", primary, `trailingIcon="arrowRight"`, `md` (56). The mockup reads about 50 *est*. The design sheet wins, as in plan 04.
- **Divider:** 16 *est* below. Two 1px `border` lines with "or" between them in `type-caption` `tertiary`, 16 gap on each side of the word.
- **Social:** 16 *est* below, gap 12. Two `Button`s, secondary, `md`: "Continue with Google" with `<GoogleLogo />`, then "Continue with Apple" with the Apple glyph. The mockup shows a wider logo-to-text gap than `gap-3`, so check it in the comparison.
- **Footer:** 24 *est* below, centered: "Already have an account?" in `type-caption` `secondary`, then a space and "Sign in" in `type-caption` ink, `font-jakarta-semibold`, underlined. It's a `Pressable` (`accessibilityRole="link"`). Bottom padding = max(safe-area bottom, 16).

### Undesigned screens (same building blocks)
- **Verify email:** title "Check\nyour email". Lead "We sent a 6-digit code to **<email>**. Enter it below to finish creating your account." (email in `font-jakarta-semibold` ink). Then six code boxes: each a 48×56 `surface-muted` box with radius `lg`, a 1px border, and the digit in `type-title`, centered, `justify-between` across the row. The box that will take the next digit gets the focus ring while the input is focused. One transparent `TextInput` covers the row (`maxLength={6}`, `keyboardType="number-pad"`, `textContentType="oneTimeCode"`, `autoComplete="one-time-code"`, digits only). It autofocuses, and tapping a box focuses it. A wrong code shows an error border on all boxes plus the banner. Then `Button` "Verify email" (primary, arrow, disabled until 6 digits). Below it, centered: "Didn't get a code? **Resend**". During the 30 s cooldown after a send, it reads "Resend in 0:29" in `tertiary`. A successful resend clears the code.
- **Sign in:** title "Welcome\nback". Lead "Sign in to see your saved stays, trips and recommendations." Fields: Email address and Password ("Your password"). Under them, right-aligned, "Forgot password?" in `type-caption` ink semibold. Then `Button` "Sign in" (primary, arrow), the divider, the two social buttons, and the footer "New to roam? **Create account**".
- **Home placeholder:** a safe-area view with `Wordmark size="sm"`, `Text variant="heading"` "You're in", `Text tone="secondary"` "Signed in as <name or email>. The home screen arrives in a later plan.", and `Button` "Sign out" (secondary).

### Proposed new tokens / primitives
- No new colors, type, or spacing tokens.
- `IconButton`: new `outline` variant: `bg-surface border border-border`.
- `TextField`: optional `label` (two-line layout), optional `error` (danger border + message), and a `ref` prop forwarded to the `TextInput` (React 19 ref-as-prop) for field chaining.
- `Icon`: add `mail: Mail`.
- `src/components/ui/apple-logo/`: `AppleLogo` (SymbolView on iOS, marked placeholder fallback elsewhere).
- Design-system preview: add a labelled field, an error field, the outline icon button, and the Apple logo next to the Google one.

## Out of scope
- Clerk, real OAuth, sessions that survive a reload, and password reset.
- The real home screen and tab bar.
- Analytics events for auth (they come with PostHog).
- The official "roam" logo and the Apple logo asset for Android/web (still placeholders).

## Steps
### 1. Primitives
Add `mail` to `Icon`, the `outline` variant to `IconButton`, and `label` / `error` / `ref` to `TextField` (update `use-text-field.ts` only if state is needed; the error is plain props). Create `ui/apple-logo` (read https://docs.expo.dev/versions/v57.0.0/sdk/symbols/ first: `name={{ ios: "apple.logo" }}`, `fallback`). Add preview samples to `/design-system` (input-fields, buttons, brand sections). Done when tsc and lint pass and the existing fields look unchanged.

### 2. Mock auth, session, and guards
Create `src/lib/auth/mock-session.ts`, `src/lib/auth/mock-auth.ts`, `src/lib/auth/validation.ts`, and `src/hooks/use-session.ts` as described in Decisions. In `src/app/_layout.tsx`, read `useSession()` and wrap the screens in `Stack.Protected` (signed out: `index`, `(auth)`; signed in: `home`; `design-system` stays outside both). Create `src/app/home.tsx` and `src/screens/home/` (`index.tsx`, `use-home.ts`). Register `(auth)` screens `sign-up`, `verify-email`, `sign-in` in `src/app/(auth)/_layout.tsx`. Done when signing in through a temporary call shows `/home`, and Sign out returns to onboarding.

### 3. Shared auth components
Build `src/components/auth/` (`auth-screen`, `auth-intro`, `or-divider`, `social-buttons`, `auth-switch-link`, each in its own folder with `index.ts`). `auth-screen` takes `children` and an `onBack`. It holds the ScrollView, insets, and header, and its state-free props come from the screen's hook.

### 4. Sign-up screen
Replace `src/screens/sign-up/`: `use-sign-up.ts` (field values, `submitted` flag, errors from `validation.ts`, field refs, `loading` and `oauthLoading`, banner error, `submit` → `signUp` → `push("/verify-email")`, `continueWith(provider)`, `goToSignIn` → `replace("/sign-in")`, `goBack`), and `index.tsx` with `components/sign-up-form.tsx` for the three fields. Done when invalid submits show field errors and a valid one opens `/verify-email`.

### 5. Verify-email screen
`src/app/(auth)/verify-email.tsx` → `src/screens/verify-email/`: `use-verify-email.ts` (code digits only, `focused`, input ref, `verify` → `verifyEmailCode`, resend with a 30 s countdown via `setInterval` cleared on unmount, redirect to `/sign-up` if there's no pending sign-up), `components/code-boxes.tsx` (the row + overlay input) and `components/code-box.tsx`, and `index.tsx`. Done when 424242 lands on `/home`, a wrong code shows the error, and resend counts down.

### 6. Sign-in screen
`src/app/(auth)/sign-in.tsx` → `src/screens/sign-in/`: `use-sign-in.ts` (mirrors sign-up with email + password, forgot-password alert, `goToSignUp` → `replace("/sign-up")`), `components/sign-in-form.tsx`, and `index.tsx`. Done when a valid sign-in lands on `/home` and errors show like on sign-up.

### 7. Compare with the design
Run on web at 390×844 (no Xcode here) and take a headless Chrome screenshot of `/sign-up`. Compare it with `auth.png`, list the differences, fix them, and repeat (up to 3 rounds). Then screenshot `/sign-in`, `/verify-email` (empty, filled, error), and `/home` to check they're consistent with sign-up.

## Verification
- `npx tsc --noEmit` and `npx expo lint` pass.
- `/sign-up` screenshot at 390 wide matches the design spec, with nothing clipped. Also check 360 wide (the title still breaks as designed and no button text wraps).
- Sign-up: empty submit shows three errors. Typing fixes them live. "a@b" is rejected. A 7-character password is rejected. The eye toggle works. Next/go on the keyboard chains fields and submits.
- Verify: the button is disabled under 6 digits. Letters are ignored. 111111 shows the error. 424242 lands on `/home`. Resend counts down from 0:30 and then becomes tappable. Back returns to sign-up with the fields still filled. Opening `/verify-email` directly redirects to `/sign-up`.
- Sign-in: same validation. A valid submit lands on `/home`. Forgot password shows the alert.
- Social: Google and Apple each show their own spinner, disable the other buttons, then land on `/home`.
- Guards: on `/home`, browser Back doesn't return to the forms. Sign out returns to onboarding. While signed in, opening `/sign-up` or `/` redirects to `/home`.
- End to end: onboarding → Get started → sign-up → "Sign in" link → sign-in → "Create account" link → sign-up (Back now goes straight to onboarding) → fill and submit → verify with 424242 → home → Sign out → onboarding.
- Not covered: the iOS simulator, the SF Symbol Apple glyph, iOS keyboard insets, and one-time-code autofill (no Xcode on this machine).

## AGENTS.md updates
- Expo section: replace the "`/sign-up` is still a marked placeholder" sentence. Auth screens are `/sign-up`, `/verify-email`, `/sign-in` in `(auth)`. The root layout guards `index` + `(auth)` (signed out) and `home` (signed in) with `Stack.Protected` driven by `useSession()`. Auth is mocked in `src/lib/auth/` (`424242` verifies) until Clerk replaces the mock behind `useSession`. `/home` is a placeholder.
- Design system: `TextField` `label`/`error`, the `IconButton` `outline` variant, `AppleLogo`. Feature components shared by several screens live in `src/components/<feature>/<name>/`.
- Building from designs: the Apple logo on Android/web is a placeholder.

## Result
Built as planned: `/sign-up`, `/verify-email`, `/sign-in`, and a placeholder `/home`, with mocked auth in `src/lib/auth/`, `useSession()`, and `Stack.Protected` guards in the root layout. tsc and lint pass. Every flow in Verification was driven on web at 390×844 through Chrome DevTools Protocol (real mouse and key events), and all passed. The one exception is the Forgot password alert, because `Alert.alert` is a no-op on react-native-web. Sign-up was compared with `auth.png` by measuring text boxes on both images (0.5735 pt/px).

Changes from the plan, all found while comparing:
- Titles use a new **`type-headline`** (Jakarta Bold 38 / 40, -1.2; 36 clipped the top of "C" on iOS, see Follow-up fixes), not `type-hero`. The design's "your account" measures 221 pt wide, and `type-hero` gave 264.
- The intro paragraph is `max-w-75` (300), which reproduces the design's 3-line wrap after "get".
- The labelled `TextField` is `px-4 py-2 gap-6` with the label in `type-caption` (14), so it's 60 tall with the icon at 16 and the text at +24, as measured. The input text stays `type-input` (16). The design reads ~13, but web Safari zooms into inputs under 16 and the field token is 16.
- Social buttons line their logos and labels up in one column (`Button align="start"`, logo slot `ml-10 mr-5`, labels start at x≈146 vs 147 in the design), with `titleVariant="caption"`, since the design's labels are ~14 Medium. A loading button always centers its spinner.
- The code input has no `maxLength` (it cut pasted text before the non-digit strip) and gets `outline-none` (web drew a focus ring around the row).
- React Compiler lint flags any object holding a ref, so hooks return refs that components destructure out (`const { refs, ...vm } = useX()`).

Known differences: the back button is 48 (design ~43) and buttons are 56 (design ~50/45), as decided. The headline and wordmark face is still the Jakarta placeholder, and the Apple glyph on web/Android is a placeholder. The footer sits at the bottom of the screen (`mt-auto`), not at a fixed gap under the Apple button. Not verified: the iOS simulator, the SF Symbol Apple glyph, keyboard insets, and one-time-code autofill (no Xcode).

### Follow-up fixes (user review)
- The top of "C" in "Create" was clipped on iOS. Jakarta Bold is 1.26em tall (ascent 1.038, descent 0.222). iOS trims a line box shorter than that from the top, and at 38/36 only 27.4 px stayed above the baseline, while the "C" needs ~28.8. `type-headline` is now 38 / **40** (31.6 above the baseline). Title lines sit 4 pt further apart than the design. `type-hero` (44/44) has 34.3 above the baseline against 33.4 needed, so it doesn't clip, but only just.
