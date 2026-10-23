# 03 · Code structure rules

Status: done

## Goal
Every component file follows one set of structure rules:
- Components only render JSX, and logic lives in hooks (page orchestrator pattern).
- One component per file.
- Constants are placed by scope.
- Utility code comes from es-toolkit instead of hand-written checks.

`npx expo lint` fails when the mechanical rules are broken, and the existing code is migrated to pass.

## Decisions
- **Rule 1, blank line before return.** If a component (or any function) has statements before its `return`, a blank line separates them from the `return`.
- **Rule 2, implicit return when there's no logic.** Components are arrow functions. One with nothing but JSX uses an expression body, `export const Tag = ({ label }: TagProps) => (<View>…</View>);`, with no `{ return … }` block.
- **Rule 3, page orchestrator pattern.**
  - State, effects, refs, event handlers with logic, and derived data live in a `use-<name>.ts` hook beside the component.
  - The component calls it once, `const vm = useTextField(props)`, then a blank line, then returns JSX that reads from `vm`.
  - A screen's `index.tsx` calls one orchestrator hook and passes plain props to presentational children. Children never call data or router hooks themselves.
  - Hooks are `.ts` files with no JSX and return one flat object.
  - Trivial lookups may stay in the component: destructuring, `tones[tone]`, a one-line ternary on props. Anything with `useState`/`useEffect`/`useRef`, or a handler that does more than call a prop, goes in the hook.
- **Rule 4, one component per file.** A private sub-component gets its own file in the same folder and isn't exported from the folder's `index.ts` (e.g. `stepper/step-button.tsx`).
- **Rule 5, constants by scope.**
  - A constant used only by its own file (a `variants`/`sizes`/`tones` style map, the icon registry, a screen section's sample data) stays in that file, above the component. (User decision.)
  - A constant used by 2+ files moves to `constants.ts` in their nearest shared folder (component folder, `src/screens/<name>/`, or `src/constants/` for app-wide).
  - Utility functions are never defined in a component or hook file. They go in `utils.ts` in the folder that uses them, or `src/lib/` when shared.
- **Rule 6, es-toolkit for utility code** (user decision). Type checks, null/empty checks, and array/object/string/math/function helpers come from es-toolkit, never hand-written.
  - Install `es-toolkit` (latest is 1.52.0) with `npx expo install es-toolkit`. The user asked for it, so this new dependency is approved.
  - One import path: `src/lib/utils.ts` is a barrel that re-exports `es-toolkit` (`export * from "es-toolkit"`), the two helpers that exist only in `es-toolkit/compat` (`isArray`, `isEmpty`), and the project's own helpers (`cx`). App code imports from `@/lib/utils` only. Importing `es-toolkit` or `es-toolkit/*` directly elsewhere is a lint error. A future compat-only helper gets added to the barrel first.
  - Required replacements:

    | Use | Instead of |
    |---|---|
    | `isNil(x)` / `isNotNil(x)` | `x == null`, `x != null`, `x === null \|\| x === undefined` |
    | `isNull(x)` / `isUndefined(x)` | `x === null` / `x === undefined`, `typeof x === "undefined"` |
    | `isString`, `isNumber`, `isBoolean`, `isFunction`, `isPlainObject` | `typeof x === "…"`, prototype checks |
    | `isArray(x)` | `Array.isArray(x)` |
    | `isEmpty(x)` / `!isEmpty(x)` | `x.length === 0`, `x.length > 0`, `x === ""`, `Object.keys(x).length === 0` |
    | `compact(xs)` | `xs.filter(Boolean)` |
    | `clamp`, `sum`, `uniq`, `groupBy`, `pick`, `omit`, `debounce`, … | hand-rolled equivalents |

  - `isNil` covers only null/undefined. `isEmpty` follows lodash rules (`null`, `undefined`, `""`, `[]`, `{}`, empty Map/Set), and `isEmpty("   ")` is false, so use `isEmpty(trim(s))` when whitespace counts as empty.
  - Native code is allowed only when es-toolkit has no equivalent, or TypeScript can't narrow through the predicate. Either way it needs a one-line comment saying why.
  - Optional chaining (`a?.b`, `fn?.()`) and `??` defaults stay native, since they're language features rather than checks.
- **Layout: folder per component** (user decision).
  - `src/components/ui/<name>/` holds `<name>.tsx` + `index.ts` (re-exporting the public component and its prop types).
  - It also holds `use-<name>.ts`, `constants.ts`, and `types.ts` when needed.
  - Import paths don't change: `@/components/ui/button` resolves to the folder's `index.ts`.
- **Screens** live in `src/screens/<name>/`:
  - `index.tsx` (orchestrator) and `use-<name>.ts`.
  - `constants.ts` when shared.
  - `components/<part>.tsx` + `components/index.ts`.
  - Route files in `src/app/` stay thin: they import the screen and export it as default, with only routing concerns (like the dev-only `Redirect`). This fits the existing rule "Keep components, hooks, and utils outside `src/app/`".
- App-wide hooks live in `src/hooks/use-<name>.ts` (first one: `use-app-fonts.ts`).
- Naming: **kebab-case** files (user decision), matching Expo and `src/app/` routes. Hooks are `useCamelCase` in `use-kebab.ts`, and components are `PascalCase` in `kebab.tsx`.
- Size limits: a component file stays under ~200 lines and a hook under ~300. Beyond that, split it. This is a review rule, not linted.
- **Enforcement: CLAUDE.md + ESLint** (user decision). Everything except es-toolkit is already installed: `eslint-plugin-react` 7.37.5 ships with `eslint-config-expo`, and the rest are ESLint core rules. Dry run of rules 1–4 on the current code: 42 violations across all 21 component files (25 function-component-definition, 10 padding-line, 4 no-multi-comp, 3 restricted hook imports). `arrow-body-style` starts firing once components are arrows.

  | Rule | ESLint | Scope |
  |---|---|---|
  | 1 | `padding-line-between-statements: [{ blankLine: "always", prev: "*", next: "return" }]` | all files |
  | 2 | `react/function-component-definition: { namedComponents: "arrow-function", unnamedComponents: "arrow-function" }` + `arrow-body-style: "as-needed"` | all files |
  | 3 (partial) | `no-restricted-imports` of `useState`, `useEffect`, `useLayoutEffect`, `useReducer`, `useRef` from `react` | `src/app/**/*.tsx`, `src/components/**/*.tsx`, `src/screens/**/*.tsx` (hooks are `.ts`, so they're allowed there) |
  | 4 | `react/no-multi-comp: "error"` | all files |
  | 5 | not lintable, so a CLAUDE.md rule + review | — |
  | 6 | `no-restricted-imports` of `es-toolkit` and `es-toolkit/*` | all files except `src/lib/utils.ts` |
  | 6 | `no-restricted-syntax` selectors (each with a message naming the helper): `BinaryExpression` against `null`/`undefined`, `UnaryExpression[operator="typeof"]`, `Array.isArray(…)`, `.length` compared with `0`, `.filter(Boolean)` | all files |

- `expo-router` needs a default export from each route file: `export default DesignSystemRoute;` after the arrow `const`.
- Generic arrow components in `.tsx` use `<T extends string,>` (trailing comma, so TSX doesn't parse it as a tag).
- Behavior and visuals stay identical. This is a pure refactor.

## Out of scope
- New features, visual changes, or new components.
- Renaming components or changing their public props. The one exception is `Stepper`'s `max` default, which changes from `Infinity` to optional; callers are unaffected.
- API routes and Sanity Studio (not built yet; they'll pick up the same lint config).
- Tests (the repo has no test runner yet).

## Steps
### 1. Folder per UI component
- For each of the 18 files in `src/components/ui/` (badge, button, chip, glass-tab-bar, icon, icon-button, list-group, list-row, listing-card, policy-card, segmented-control, status-banner, stepper, tag, text, text-field, toggle, wordmark), move `<name>.tsx` to `src/components/ui/<name>/<name>.tsx`. Add `index.ts` re-exporting the component and its exported types (e.g. `export { Button, type ButtonProps } from "./button";`).
- Fix the relative imports between components (`./icon` → `../icon`, `./text` → `../text`).
- Done when `npx tsc --noEmit` passes with no import changes needed outside `src/components/ui/`.

### 2. es-toolkit and the utils barrel
- `npx expo install es-toolkit`.
- `src/lib/utils.ts`:
  ```ts
  export * from "es-toolkit";
  // Only in the compat build
  export { isArray, isEmpty } from "es-toolkit/compat";
  export { cx } from "./cx";
  ```
- `src/lib/cx.ts`: `classes.filter(Boolean)` → `compact(classes)` (import `compact` from `es-toolkit` here, since this file feeds the barrel). Update every `@/lib/cx` import to `@/lib/utils`.
- `icon/icon.tsx`: `filled === true ? color : filled || "none"` → `isString(filled) ? filled : filled ? color : "none"`.
- `stepper`: `max` becomes optional (no `Infinity` default). `canIncrease` is `isNil(max) || value < max`, and `accessibilityValue.max` passes `max` through, replacing `Number.isFinite(max)`.
- Done when tsc passes, grep finds no `es-toolkit` import outside `src/lib/`, and no hand-rolled checks remain in `src/`.

### 3. Extract hooks and split multi-component files
- `text-field/use-text-field.ts`: `useTextField({ secureTextEntry, onFocus, onBlur })` owns `focused`, `hidden`, `toggleHidden`, `handleFocus`, `handleBlur`, and returns `{ focused, isSecure, hidden, toggleHidden, handleFocus, handleBlur }`. `text-field.tsx` keeps only JSX.
- `stepper/use-stepper.ts`: `useStepper({ value, onChange, min, max })` returns `canDecrease`, `canIncrease`, `decrement`, `increment`, `accessibilityValue`, `handleAccessibilityAction`. `stepper/step-button.tsx` gets `StepButton` (not exported from `stepper/index.ts`).
- `src/hooks/use-app-fonts.ts`: the `useFonts` map, the module-level `SplashScreen.preventAutoHideAsync()`, and the hide effect. Returns `ready` (`loaded || isNotNil(error)`). `src/app/_layout.tsx`: `const ready = useAppFonts();`, blank line, `if (!ready) return null;`, blank line, the JSX.
- Done when tsc passes, and no `.tsx` under `src/` imports `useState`/`useEffect`/`useRef` (grep).

### 4. Design-system screen to the orchestrator pattern
- `src/screens/design-system/use-design-system.ts`: all 9 pieces of state from today's `Gallery` (filter, category, saved, view, tab, instantBook, guests, name, banners) and their setters/handlers (`toggleSaved`, `dismissBanner(tone)`, `showBanners`). Returns one flat `vm`.
- `src/screens/design-system/index.tsx`: `DesignSystemScreen`. `const vm = useDesignSystem();`, blank line, a `ScrollView` rendering 15 section components with props from `vm`.
- `src/screens/design-system/components/`: `section-card.tsx` (today's `Section`), `google-logo-placeholder.tsx`, and one file per section (`brand-section.tsx`, `palette-section.tsx`, `typography-section.tsx`, `buttons-section.tsx`, `input-fields-section.tsx`, `filter-chips-section.tsx`, `listing-card-section.tsx`, `policy-card-section.tsx`, `profile-row-section.tsx`, `tab-bar-section.tsx`, `iconography-section.tsx`, `segmented-control-section.tsx`, `toggles-section.tsx`, `alerts-section.tsx`, `badges-section.tsx`), plus `components/index.ts`. Each is presentational. Sample data used by one section stays in that section's file (rule 5). `tabs` is used by the hook (its key type) and by the tab-bar section, so it moves to `src/screens/design-system/constants.ts`.
- `src/app/design-system.tsx` becomes `const DesignSystemRoute = () => (__DEV__ ? <DesignSystemScreen /> : <Redirect href="/" />); export default DesignSystemRoute;`.
- Done when tsc passes and the route renders the same 15 sections.

### 5. Arrow components and ESLint rules
- Convert every component under `src/` to an arrow `const`. Use expression bodies where there's no logic, and a blank line before `return` where there is.
- Add the rules from the Decisions table to `eslint.config.js`, after `expoConfig`. Scope the hook-import block with `files`, and give `src/lib/utils.ts` an override that allows es-toolkit imports.
- Run `npx expo lint --fix` (it auto-fixes `arrow-body-style`, `padding-line-between-statements`, and `function-component-definition`), then fix the rest by hand.
- Done when `npx expo lint` passes with the new rules.

### 6. CLAUDE.md
- Add a `## Code structure` section after `## Rules` stating rules 1–6 (with the main es-toolkit replacements and the `@/lib/utils` import rule), the folder layouts for `src/components/ui/<name>/`, `src/screens/<name>/`, and `src/hooks/`, the thin-route rule, kebab-case naming, and the ~200/~300 line limits. Note that `npx expo lint` enforces rules 1–4 and 6. Keep it to about 18 lines so the file stays under 150.

## Verification
- `npx tsc --noEmit` and `npx expo lint` pass.
- The rules fire. A temporary `src/components/ui/__probe__.tsx` gets one lint error from each rule. It contains:
  - two components
  - a `function` component
  - a block body with only `return`
  - no blank line before a `return`
  - `import { useState } from "react"`
  - `import { isNil } from "es-toolkit"`
  - `x === null`
  - `typeof x === "string"`
  - `xs.length === 0`

  Delete it afterwards.
- Structure greps:
  - Every `src/components/ui/*/` has an `index.ts`.
  - No `.tsx` under `src/` imports `useState|useEffect|useRef|useReducer|useLayoutEffect`.
  - No `function` declarations in `.tsx` files.
  - `es-toolkit` is imported only in `src/lib/`.
- No visual change. Screenshot `/design-system` on web before step 1 and after step 5 (headless Chrome in a 390px iframe, as in plan 02) and pixel-diff the two with PIL. Expect no differences beyond the blinking cursor or the image fade-in.
- Interaction on web: chips, segments, toggle, stepper (minus disabled at 1, plus never disabled with no `max`), focus ring, password eye, banner dismiss/show still work.

## AGENTS.md updates
- New `## Code structure` section (step 6) with rules 1–6, the layouts, and the lint enforcement.
- Expo section: "Primitives live in `src/components/ui/`" becomes "Primitives live in `src/components/ui/<name>/` (folder per component)".
- Rules section: "Ask before adding a dependency" stays. es-toolkit is now an approved dependency and the required utility library.

## Result
Built as planned.
- **Steps:** 18 UI components now each have a folder with an `index.ts`. es-toolkit 1.52 is installed behind the `@/lib/utils` barrel. Hooks are extracted (`use-text-field`, `use-stepper`, `use-app-fonts`, `use-design-system`), and `StepButton` has its own file. The design-system screen is now an orchestrator with 15 section components plus `section-card` and `google-logo-placeholder`, and its route file is a thin wrapper. Every component is an arrow function, and CLAUDE.md has the new Code structure section.
- **Formatting:** ESLint `--fix` handled most arrow conversions but left misaligned bodies, so `src/` and `eslint.config.js` were formatted once with Prettier (`--print-width 120`, the existing line length). Prettier isn't a project dependency.
- **Deviations:**
  - Generic arrow components work as `<T extends string>` without the trailing comma, because `extends` already disambiguates them for TSX.
  - The `undefined` selector needed `[right.type='Identifier']`. Without it, esquery stringifies a missing `right.name` to `"undefined"` and flags every `===` comparison.
- **Verification:**
  - Lint, tsc, the structure greps, and a probe file (one error per rule, then deleted) pass.
  - The before/after web screenshots pixel-diff identical except for the loading spinner's rotation.
  - Driving headless Chrome over CDP confirmed that chip and category selection, the segmented control, tab bar, heart save, stepper (minus disabled at 1, then enabled at 2), password eye, toggle, focus ring on and off, and banner dismiss/show all still work.
- **Found, not fixed:** React Native Web doesn't emit `aria-selected` for `accessibilityState.selected` on these controls, which affects web screen readers. It predates this refactor.
