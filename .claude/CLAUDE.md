# Roam

Expo React Native rental app. Guests describe a stay in one sentence ("quiet pet friendly cabin with a hot tub under $300 a night") and get ranked stays back. They can also ask booking and policy questions about a stay, answered with exact text from Roam's own content.

This file is the project's memory: it holds every decision that is still true. Plans in `prompts/` are history.

## Commands

~~~bash
npx expo install <package>  # ALWAYS use instead of npm install: resolves SDK-compatible versions
npx expo start              # dev server (press i for the iOS simulator)
npx expo lint               # lint
npx tsc --noEmit            # type check
npx expo-doctor             # diagnose dependency and config issues
npx expo install --fix      # fix incompatible package versions
npx eas-cli@latest <cmd>    # EAS builds, submits, and updates (use instead of bare `eas`)
~~~

## Expo

- Expo ships breaking changes every SDK release, so don't trust memory. Before touching an Expo, EAS, or React Native API, check the `expo` major version in `package.json` and read `https://docs.expo.dev/versions/v<major>.0.0/`. For anything else, start from https://docs.expo.dev/llms.txt and follow its links.
- Routes live in `src/app/`: every file is a screen and `_layout.tsx` files define navigators. API routes are `src/app/api/*+api.ts`. Keep components, hooks, and utils outside `src/app/`.
- `/` is onboarding (plan 04). Auth screens (`/sign-up`, `/verify-email`, `/sign-in`) live in `src/app/(auth)/`. `AppNavigator` (`src/components/app-navigator/`) guards `index` + `(auth)` (signed out) and `(tabs)` (signed in) with `Stack.Protected` driven by the Clerk-backed `useSession()`, so signing in or out redirects and clears history; success paths never navigate themselves. The splash stays up until fonts and Clerk's restored session are both ready, so reloads land on onboarding or home without a flash. `/verify-email` serves sign-up and new-device sign-in and reads which from Clerk's state (`pendingCodeFlow`). `(tabs)` is `NativeTabs` (`components/app-tabs`): Home, Search (`/search?q=`), Trips and Profile (both marked placeholders, Sign out on Profile). Native tabs don't draw the design's yellow pill on iOS: ink tint there, `indicatorColor` primary on Android. `disableTransparentOnScrollEdge` stays on, because iOS 18 and earlier draw the bar transparent on screens whose scroll view it can't detect (nested `FlatList`, static views). On web the tab bar floats at the top, so screens add `web:` top padding. Reanimated components don't take `className`: put styles on them and classes on a child View.
- `ios/` and `android/` are generated. Never create or edit them by hand; configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, switch to a development build (`npx expo run:ios`).
- Styling is NativeWind v5 RC (`className`, Tailwind CSS v4), per https://www.nativewind.dev/v5/getting-started/installation. Keep `nativewind@5.0.0-rc.0` and `react-native-css@3.1.0-rc.0` pinned as an exact pair, and keep the `lightningcss: 1.30.1` npm override. Theme config lives in `global.css` (`@theme`), not `tailwind.config.js`. Import `global.css` only in `src/app/_layout.tsx`. PostCSS config must be `.mjs` or `.js`, never `.cjs`. There's no NativeWind Babel preset in v5.
- Design system (plan 02): tokens live in `global.css` `@theme`: colors, `--spacing: 4px` (so `p-4` = 16 everywhere), radius, `shadow-*`, `font-jakarta*`, and `type-*` text utilities. `src/theme/colors.ts` mirrors the colors for props that can't take a className (icon color, Switch, placeholder); change both together. Primitives live in `src/components/ui/<name>/` (folder per component). `GlassPill` (light/dark) is the control or label to put over photos. Screens use `<Text variant>` and `<Icon name>`, never raw font sizes, families, hex values, or direct `lucide-react-native` imports. Set weight only through `font-jakarta-*` families (never `font-bold`). Add `corner-squircle` to non-capsule radii. Auth titles use `type-headline`, onboarding uses `type-hero`. iOS trims a short line box from the top, so a `type-*` line-height must be at least the font size (Jakarta needs ~0.98× for cap height plus descent) or the first line's capitals get clipped. Web never shows this. `TextField` takes `label` (two-line auth field) and `error`. Text inputs use `type-input` (no line-height) and no fixed height, because iOS pushes a single-line input's text below center when a line-height is set. Never nest a Pressable inside another Pressable (it breaks on web), so make overlay buttons siblings instead. The React Compiler lint treats any object holding a ref as a ref, so orchestrator hooks return refs that the component destructures out (`const { refs, ...vm } = useX()`). Feature components shared by several screens live in `src/components/<feature>/<name>/` (e.g. `components/auth/`). `PressableScale` is the press-feedback primitive (0.97, 120ms). Motion follows the `expo-animation` skill with curves and durations from `src/constants/motion.ts`: no tab-switch animation, no `entering` on virtualized rows, reduced motion keeps fades and drops movement (`lib/motion.ts`). Preview everything at `/design-system` (dev only).
- Fonts: Plus Jakarta Sans (4 static weights in `assets/fonts/`), loaded with `useFonts` in the root layout so Expo Go and web work. Move to the `expo-font` config plugin once there's a dev build. Icons: `lucide-react-native`. The app is light mode only (`userInterfaceStyle: "light"`).

## Who owns what

Each tool has one job. Ask before moving a responsibility to a different tool.

- **Auth:** Clerk is the source of truth. The app keeps its own custom auth screens. Set Clerk up through the Clerk CLI and use the Clerk MCP for current Expo patterns. Screens call the `@clerk/expo` method-based hooks (`signUp.password`, `signUp.verifications.*`, `signIn.password`, `signIn.mfa.*`, `finalize`), never `@clerk/expo/legacy` (the Clerk MCP's SDK snippets are legacy-shaped). Forms run `src/lib/auth/validation.ts` on every field first; Clerk's field errors show under a field only once it passes locally. Google uses stable `useSSO` + `setActive`; Apple stays hidden until it's configured in Clerk. Sessions persist via `tokenCache` (expo-secure-store). Clerk Protect challenges web sign-ups only (ClerkJS shows its own dialog). Dev instance: password min 8, optional first/last name. Test with `+clerk_test` emails and code `424242`.
- **Content:** Sanity project `vjn3nb8q`, dataset `roam-dataset` (public read, so listing content only, never private user data). Studio is a standalone app in `studio/`, hosted at `roam-vjn3nb8q`.
  - Schema (plan 08) lives in `studio/schemaTypes`:
    - `property` holds typed filter fields, `vibes` (fixed list, the only source of atmosphere words), an embedded `location` and `houseRules`, `photos[]` (first is the cover), and refs to `host`, `cancellationPolicy` and stay-specific `policies[]`.
    - `host`.
    - `policy` holds `category`, `summary`, plain-text `body` and `fullRefundDaysBefore`.
  - Deploy from `studio/` with `npx sanity schema deploy` and `npx sanity deploy`, never MCP `deploy_schema`, which refuses when a local Studio exists.
  - `npm run seed` in `studio/` upserts `seed/data` by slug. It's safe to rerun and never deletes. It sets `summary`/`description` only when it creates a stay. Add `-- --dry-run` to preview.
  - `npm run copy` in `studio/` (plan 09) writes `summary`/`description` with Agent Actions Generate from the stay's own fields (`copy/facts.ts`: no price, rating, host or policies), rejects invented claims with code rules (`copy/checks.ts`) and an Agent Actions Prompt (`copy/fact-check.ts`), and writes passing copy to drafts for review. `--slug`, `--dry-run`.
  - The Sanity MCP is for checks, queries and content edits.
  - CORS allows `localhost:3333` (Studio) and `localhost:8081`/`8099` (Expo web, no credentials). Native needs none; a deployed web app needs its origin added.
- **Exact constraints** (price, guests, bedrooms, type, amenities, pets, place, refund window): GROQ filters, with values always passed as params. Home reads Sanity through `src/lib/sanity` (`expo/fetch` to the public apicdn, published perspective, no token, `sanityImageUrl` crops by hotspot). Search still runs on `src/data/stays.ts` and `src/lib/search` until it moves to GROQ: code parses the sentence into constraints, hard ones filter, soft words only rank. The schema's amenity keys are a superset of the app's `Amenity` type, so extend `AMENITY_META` and the icons when wiring.
- **Soft intent** (quiet, cozy, secluded): Dataset Embeddings via `text::semanticSimilarity()` inside `score()`. Embeddings are on for `property` only, projecting `title, summary, description, vibes` and place. Semantic queries use quota, so the app runs them through an API route.
- **Policy knowledge:** a Sanity Context endpoint in Knowledge Base mode. Context endpoints are created in the Dashboard's Context app and read with an organization token (Context Viewer), per https://www.sanity.io/docs/ai/context-migration-guide. One endpoint serves one mode. The Context skill still describes `sanity.agentContext` Studio documents with a project token; that route is deprecated, so don't use it.
- **Typed decisions** (which stay topics and policies answer a question): Jev, called from API routes through the AI SDK's `experimental_evaluate` with the `@ai-sdk/typesafe-ai` provider and `TYPESAFE_AI_API_KEY`. No Vercel AI Gateway. Keep `ai` and `@ai-sdk/typesafe-ai` pinned to exact versions, since the API is experimental.
- **Answer text:** none generated. Answers show the stay's own fields and policy text word for word, with their source. No LLM runs in the app.
- **Analytics:** PostHog, identified through Clerk.

## Rules

- Secret keys (Clerk secret key, TypeSafe key, Sanity organization token, Sanity write token) never reach the app bundle. Use them only in API routes and local scripts such as seeding. Never put them behind `EXPO_PUBLIC_`, which is bundled into the app. Never commit `.env`. Keep variable names, without values, in `.env.example`.
- Sanity Context needs a deployed Studio for the dataset. Redeploy Studio from `studio/` after schema changes.
- Jev is not an agent. It answers typed questions (Choice, Noul, Score) with probabilities. It never writes GROQ, calls tools, or generates text. Code builds queries from its answers.
- Prices, guest counts, and dates are parsed in code. Jev may choose between candidates code found, but never produces the value.
- Embeddings rank, they don't filter, and they only see the document itself (no references). Hard constraints are always GROQ filters, and text that should affect ranking lives on the property document.
- Generated copy never states anything that isn't in the stay's fields, and never mentions price, rating, the host or policies.
- Policy answers show only text from the stay's data and Roam's policies, word for word. If nothing answers the question, say so and point to support.
- API routes verify the Clerk session before doing any work.
- PostHog failures never block the app. Never send what guests type, tokens, or personal data in events.
- Let Sanity generate document IDs. Model relationships as references. Every document type has a unique `slug`, the stable handle for seeds and the app.
- Roam-wide policies (`appliesToAllStays`) are never referenced: queries add them to every stay. Stay totals are computed as nights × `pricePerNight` + `cleaningFee`, never stored.
- Ask before adding a dependency or service, changing the Sanity schema once content exists, or deleting data. Prefer Expo modules over third-party libraries.
- Whenever you need input from the user, ask through your tool's built-in question panel so they pick from options instead of typing. Give two to four clear options with the recommended one first. Fall back to plain text only if no such panel exists.

## Code structure

`npx expo lint` enforces rules 1–4 and 6; rule 5 is checked in review.

No semicolons, including TypeScript type members (`@stylistic/semi` + `member-delimiter-style`; one-line type literals use commas). `npx expo lint --fix` removes them. `expo lint` skips root config files, so run `npx eslint --fix <file>` on those.

1. **Blank line before `return`** whenever a function has statements before it.
2. **Arrow components.** One with only JSX uses an implicit return: `export const Tag = (…) => (<View>…</View>);`. Route files define a `const` and `export default` it.
3. **Page orchestrator.** State, effects, refs, and handlers with logic live in a colocated `use-<name>.ts` hook (no JSX, returns one flat object). The component calls it once (`const vm = useX()`), then renders JSX only. A screen's `index.tsx` calls one orchestrator hook and passes plain props to presentational children. Trivial prop lookups (`tones[tone]`) may stay in the component. `.tsx` files can't import `useState`/`useEffect`/`useRef`/`useReducer`/`useLayoutEffect`.
4. **One component per file.** A private sub-component gets its own file in the folder and isn't exported from its `index.ts`.
5. **Constants by scope.** Used by one file: stays in that file. Used by 2+ files: `constants.ts` in the nearest shared folder (`src/constants/` if app-wide). Utility functions never live in component or hook files: put them in the folder's `utils.ts` or in `src/lib/`.
6. **es-toolkit for utility code.** Import from `@/lib/utils` only (it re-exports es-toolkit, the compat-only `isArray`/`isEmpty`, and `cx`). Use `isNil`/`isNull`/`isUndefined`, `isString`/`isNumber`/`isBoolean`/`isFunction`, `isArray`, `isEmpty`, `compact`, etc., never `== null`, `typeof`, `Array.isArray`, `.length === 0`, or `filter(Boolean)`. `isEmpty("  ")` is false, so trim first when whitespace counts. Native code is allowed only when es-toolkit has no equivalent, with a comment saying why.

Layout (kebab-case files, `PascalCase` components, `useCamelCase` hooks):
- `src/components/ui/<name>/`: `<name>.tsx`, `index.ts`, plus `use-<name>.ts`, `constants.ts`, and `types.ts` when needed.
- `src/screens/<name>/`: `index.tsx` (orchestrator), `use-<name>.ts`, `constants.ts`, `components/<part>.tsx` + `components/index.ts`. Route files in `src/app/` only import a screen and handle routing.
- `src/hooks/use-<name>.ts`: app-wide hooks.
- Keep components under ~200 lines and hooks under ~300; split beyond that.

## How we build features

For a new feature or a change across several files. Small fixes and questions skip this.

1. **Understand.** Read the code involved. Open an earlier plan only if this feature builds directly on it (pick by file name). Read the current docs pages for the APIs you'll use, and load a matching skill if one exists (e.g. the Expo, Clerk, Sanity, Sanity Context, or TypeSafe skills). Don't write version-specific APIs from memory.
2. **Ask.** If a real decision is unclear (scope, visible behavior, data shape), ask in the question panel, batching questions into one round and following up only if the answers raise new ones. Pick defaults for the rest and list them. If a decision in this file looks wrong, raise it instead of changing it.
3. **Plan.** Copy `prompts/TEMPLATE.md` to `prompts/NN-feature-name.md` (next number) and fill it in. The plan must be self-contained, so a fresh session can build it from this file plus the plan alone.
4. **IMPORTANT: stop and wait.** Write no app code until the user approves the plan. Ask for approval in the question panel (approve, or request changes). If they request changes, update the plan and ask again. On approval, set `Status: approved`.
5. **Build** step by step, checking each one. If a step turns out wrong, stop and explain instead of redesigning.
6. **Close out.**
   - Run the plan's Verification and give the report described under Reporting.
   - Add a short `## Result` to the plan and set `Status: done`.
   - Update this file: put each lasting decision in the section it belongs to. Replace or remove rules that are no longer true instead of appending. Keep this file under 150 lines.

## Building from designs

Designs are attached in the chat. Screens must match them exactly: layout, spacing, sizes, colors, type, radii, icons, and copy.

- Icons, fonts, and brand images come from `assets/` or the chosen icon library, never recreated from a screenshot. Sample property photos may be remote placeholder images. If an asset is missing, use a marked placeholder and list it.
- Map every color, font, spacing value, and radius to a design-system token. List values with no token in the plan as proposed new tokens instead of hardcoding them. When creating the design system itself, derive the tokens from the designs. The design sheet's tokens are in `prompts/02-design-system.md`. Placeholder still pending: the "roam" logo (`wordmark.tsx`). The Google "G" is the official mark in `assets/images/google-g.svg`, rendered by `ui/google-logo`. `ui/apple-logo` uses the SF Symbol `apple.logo` on iOS and a marked placeholder on Android/web. Headline type (`type-hero`) uses Jakarta Bold in place of the designs' heavier display face.
- UI plans describe the design (elements, states, tokens, assets) well enough to build without the image. If building in a new session, ask for the design to be attached again.
- After building, open the screen in the iOS simulator (deep link with `xcrun simctl openurl booted <url>` when it isn't the first screen; the scheme is in `app.json`), take a screenshot (`xcrun simctl io booted screenshot <path>`), and compare it with the design. List every difference, fix, and repeat. Report which values were estimated from an image.

## Reporting

End every piece of work that changes code (features and fixes, not answers to questions) with this report. Use these headings in this order, and leave out any section that would be empty.

- **Done:** one line on the outcome, then the files changed and what changed in each.
- **Verified:** each check with ✅ or ❌ and its evidence (command output, screenshot). List what wasn't checked as ❌ with the reason. Never mark something ✅ without running it.
- **You need to:** numbered actions only the user can take, such as keys, dashboard settings, manual steps in Sanity, or assets to provide.
- **Test it yourself:** numbered steps to reproduce the result from a fresh start, ending with `Expected:` and what the user should see.
- **Notes:** defaults picked, trade-offs, and anything left for later.

## Checks

- Lint and type check pass before any task is called done.
- Screens that load data handle loading, error, and empty states.
- AI features are tried against realistic inputs, and failures are explained by cause: missing data, the decision Jev made, the query, or the code.