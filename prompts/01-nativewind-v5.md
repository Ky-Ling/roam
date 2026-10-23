# 01 · NativeWind v5 setup

Status: done

## Goal
Screens can be styled with Tailwind `className` props on iOS, Android, and web through NativeWind v5 (Tailwind CSS v4), and the starter screen proves it works.

## Decisions
- Version: NativeWind v5 RC0, per https://www.nativewind.dev/v5/getting-started/installation (the `llms-full.txt` the user linked documents v4.2.7 and points to that page for v5). V4 is still the stable release; the user asked for v5.
- Exact pins (the RC requires this pair): `nativewind@5.0.0-rc.0`, `react-native-css@3.1.0-rc.0`. Dev: `tailwindcss@4.1.12`, `@tailwindcss/postcss@4.1.12`, `postcss`, `lightningcss@1.30.1`.
- Stack already matches the RC's tested target (Expo 57, RN 0.86.3, React 19.2.3, Reanimated 4.5.1, Worklets 0.10.1). `react-native-safe-area-context` and `expo-system-ui` are installed, and `userInterfaceStyle` is already `"automatic"`. No SDK changes are needed.
- `npm install --save-exact` for the RC packages, not `npx expo install`, because the docs require the exact pair and Expo has no SDK mapping for them. Run `npx expo install` for the native peers so Expo confirms their versions.
- `global.css` sits at the project root and is imported only in `src/app/_layout.tsx` (both the Expo and NativeWind docs say this). Use the split imports (theme, preflight, unlayered utilities, `nativewind/theme`), never a bare `@import "tailwindcss"`.
- PostCSS config is `postcss.config.mjs`. Expo 57 doesn't discover `.cjs`.
- `lightningcss` is pinned to 1.30.1 through npm `overrides` in `package.json`.
- No `babel.config.js`. V5 needs no Babel preset because the Metro wrapper applies the import rewrite.
- No `tailwind.config.js`. Theme config lives in CSS (`@theme`); design tokens are a later feature.
- Types: `nativewind-env.d.ts` at the root containing `/// <reference types="react-native-css/types" />` (committed). Add `declare module "*.css";` only if tsc complains.
- Smoke test: convert `src/app/index.tsx` from `StyleSheet` to `className`.
- Skip `prettier-plugin-tailwindcss`, because the repo has no Prettier setup.

## Out of scope
- A design system, tokens, or `@theme` customization.
- Dark-mode toggle UI.
- `styled()` wrappers for third-party components.
- Editor setup (Tailwind IntelliSense).

## Steps
### 1. Install packages
- `npm install --save-exact nativewind@5.0.0-rc.0 react-native-css@3.1.0-rc.0`
- `npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context expo-system-ui` (they're already present, so this only confirms versions)
- `npm install --save-dev --save-exact tailwindcss@4.1.12 @tailwindcss/postcss@4.1.12 postcss lightningcss@1.30.1`
- Add `"overrides": { "lightningcss": "1.30.1" }` to `package.json` and re-run `npm install`.
- Done when `npm ls nativewind react-native-css lightningcss` shows the pinned versions with no invalid or peer errors.

### 2. Tailwind, PostCSS, and Metro config
- `postcss.config.mjs`: `export default { plugins: { "@tailwindcss/postcss": {} } };`
- `global.css`:
  ```css
  @import "tailwindcss/theme.css" layer(theme);
  @import "tailwindcss/preflight.css" layer(base);
  @import "tailwindcss/utilities.css";

  @import "nativewind/theme";
  ```
- `metro.config.js`: `getDefaultConfig(__dirname)` wrapped in `withNativewind` from `nativewind/metro`.

### 3. Wire into the app
- `src/app/_layout.tsx`: add `import "../../global.css";` as the first import.
- `nativewind-env.d.ts` at the root with the `react-native-css/types` reference.
- `src/app/index.tsx`: replace `StyleSheet` with `className="flex-1 items-center justify-center bg-white"` on the View and `className="text-xl font-bold text-blue-500"` on the Text.

## Verification
- `npx expo-doctor` passes, or any warning about the RC packages is explained.
- `npx tsc --noEmit` and `npx expo lint` pass, and `className` on View/Text type-checks.
- `npx @tailwindcss/cli@4.1.12 --input ./global.css --output <scratch>/out.css` contains `.text-blue-500`.
- `npx expo start --clear`, then open the iOS simulator and screenshot it: the text is centered, bold, large, and blue on white.
- Web (`w` in the dev server): the same styling renders, and the utilities aren't overridden by RN Web defaults.

## AGENTS.md updates
- Expo section: styling uses NativeWind v5 RC0 (`className`). Keep `nativewind` and `react-native-css` pinned to the exact RC pair and `lightningcss` overridden to 1.30.1. Import `global.css` only in the root layout. PostCSS config must be `.mjs` or `.js`. There is no Babel preset for NativeWind.

## Result
Built as planned. The installed versions match the pins, and `npm ls` shows `lightningcss` overridden to 1.30.1 everywhere. NativeWind added `nativewind-env.d.ts` to `tsconfig.json` `include` itself. Lint, tsc, and the Tailwind CLI check pass. `expo export` builds the iOS and web bundles, and the web render shows the styled starter screen. The iOS simulator check wasn't run because Xcode isn't installed on this machine. expo-doctor reports patch-version drift on `expo`, `expo-router`, and `@expo/ui`, which predates this change and isn't related to it. The starter screen also got `px-6` and `text-center` so its larger text wraps.
