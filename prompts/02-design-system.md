# 02 · Design system

Status: done

## Goal
Every screen builds from one set of tokens (fonts, colors, spacing, radius, shadows, type styles) and a component kit that covers all 15 sections of the Roam design sheet. A dev-only `/design-system` route renders each section so it can be compared side by side with the sheet.

## Decisions
- Source: the design sheet `26-10-16 — Airbnb Mobile App/prompt-imgs/design.png` (1536×1024). Screen mockups (`home.png`, `property-details.png`, `auth.png`) were used only to estimate sizes. **Attach `design.png` again when building in a new session.**
- Scope: all 15 sheet sections, as tokens plus components (the user asked for this). This deliberately overrides the skill's "extract only when used twice" rule.
- Tokens live in `global.css` `@theme` / `@utility` (NativeWind v5 idiom, per the expo-design-system skill's Tailwind note). There's no `tailwind.config.js` and no second theme system.
- JS-only values (icon `color`, `Switch` track colors, `placeholderTextColor`, `ActivityIndicator`) come from `src/theme/colors.ts`, which mirrors the CSS hex values exactly. It's the only TS token file. Verification checks that every hex in it also appears in `global.css`.
- Units: `--spacing: 4px` and every size in px, so `p-4` = 16 on native and web alike (no rem drift).
- Font: Plus Jakarta Sans (Regular 400, Medium 500, SemiBold 600, Bold 700), from the provided `fonts.zip`. The sheet's label "Geometric Sans" is generic, and this is the font that was shipped. PostScript names equal file names (`PlusJakartaSans-Bold` …), so a single `fontFamily` string works on iOS, Android, and web.
- Font loading: `useFonts` in `src/app/_layout.tsx`, with the splash screen held until fonts load. The project runs in Expo Go and on web, and this machine has no Xcode for a dev build. Switch to the `expo-font` config plugin when the app moves to a dev build.
- Weights are set only through `fontFamily` (one file per weight). Never combine a custom family with `font-bold`/`fontWeight`, or Android falls back to the system font.
- Light mode only: `app.json` `userInterfaceStyle: "light"`. Token names are semantic, so a dark palette can be added later without touching components.
- Icons: `lucide-react-native` + `react-native-svg` (new dependencies, approved), installed with `npx expo install`. Default size 24, strokeWidth 2, color ink. Filled states (active tab, selected category chip, star) use the `fill` prop.
- Glass tab bar: `GlassView` from `expo-glass-effect` (installed) when `isLiquidGlassAvailable()`. Otherwise a View with `bg-glass`, a white hairline border, and `shadow-float`. No `expo-blur`. It's presentational for now; wiring it into an expo-router `Tabs` layout happens with the tab screens.
- Toggle wraps RN `Switch` with token colors only (no custom drawing). The segmented control is custom (a dark active pill) because the native segmented control can't match the design.
- The RN `Alert` name is taken, so the alert component is `StatusBanner`.
- Button label weight is SemiBold. The sheet text says "Medium 17–18", but the rendered "Book this stay" is visibly heavier than the Medium caption beside it. ⚠ estimate, so confirm on review.
- Wordmark "roam": the sheet uses a heavier custom geometric face than Plus Jakarta. No logo asset was provided, so `Wordmark` renders Plus Jakarta Bold with tight tracking as a **marked placeholder** until an SVG/PNG logo is supplied.
- The Google "G" in the secondary button is a brand image, and there's no asset. The preview shows a marked placeholder (a grey circle with "G"). The listing photo is a remote placeholder image.
- Amenity pill "Hot Tub" uses a calendar icon on the sheet, which looks like a generation artifact. Use `Bath` (the hot tub icon from `property-details.png`).

### Tokens

Palette values are from the sheet's swatch labels. Values marked *est* were sampled from the image (pixel median, JPEG-compressed) and are proposed new tokens, because the palette doesn't list them.

| Token (`--color-*`) | Value | Use |
|---|---|---|
| `primary` | `#FFC629` | primary actions, active states, toggle on |
| `primary-subtle` | `#FEF5DD` *est* | "Guest favorite" badge |
| `lavender` | `#C9B4FF` | secondary actions, selected filter chip |
| `lavender-strong` | `#A48AFE` *est* | focused field border, caret |
| `lavender-subtle` | `#EEEDFE` *est* | policy card, focused field bg (sampled `#F2F3FF`, merged) |
| `lavender-muted` | `#E4E1FF` *est* | policy icon tile |
| `indigo` | `#4B2EE8` *est* | policy icons + chevrons |
| `ink` | `#0B0B1A` | headings, primary text, active segment, on-primary text |
| `ink-secondary` | `#6B7280` | body / secondary text |
| `ink-tertiary` | `#9CA3AF` *est* | placeholders, location pin, review count, "/ night" |
| `surface` | `#FFFFFF` | cards, sheets, modals, secondary button |
| `surface-muted` | `#F4F4F7` | app background, fields, default chips, icon buttons, amenity pills, segment track |
| `border` | `#E5E7EB` | dividers, borders, toggle off |
| `glass` | `rgba(255,255,255,0.7)` | tab bar, glass surfaces |
| `rating` | `#FCB500` *est* | star in listing card |
| `success` | `#15834B` *est* | success icon |
| `success-subtle` | `#E4F4EC` *est* | success banner, "New" badge (sampled `#E0F1EA` / `#E8F7F0`, merged) |
| `success-ink` | `#1B6B44` *est* | success text, "New" text |
| `danger` | `#E03A46` *est* | error icon, error text, dismiss |
| `danger-subtle` | `#FEE4EC` *est* | error banner, "20% off" badge (sampled `#FEDFE8` / `#FEE9F0`, merged) |
| `info-subtle` | `#E9EFFE` *est* | "Superhost" badge |
| `info-ink` | `#2747C8` *est* | "Superhost" text |

Spacing: `--spacing: 4px` (4-point grid). Screen edge padding is `px-5` (20). Card padding is `p-3` (12) for the listing card and `p-4` (16) for the policy card. Stack gaps are `gap-2` / `gap-3` / `gap-4`.

Radius (`--radius-*`, overriding Tailwind's defaults): `sm 8`, `md 12` (banners), `lg 16` (fields, list group, listing image), `xl 20` (cards), `2xl 28` (large image cards), `full` (buttons, chips, badges, tab bar, segmented, stepper). Native views get `borderCurve: "continuous"` (style prop) on every non-capsule radius.

Shadows (`--shadow-*`, as `boxShadow`): `card: 0 1px 2px rgba(11,11,26,0.04)`, `raised: 0 4px 12px rgba(11,11,26,0.08)` (image overlay buttons), `float: 0 8px 24px rgba(11,11,26,0.10)` (tab bar).

Font families (`--font-*`): `jakarta` (Regular), `jakarta-medium`, `jakarta-semibold`, `jakarta-bold`, giving `font-jakarta…` utilities.

Type styles (`@utility type-*`: family, size, line-height in px, tracking):

| Utility | Family | Size / line | Tracking | Sheet role |
|---|---|---|---|---|
| `type-display` | Bold | 56 / 56 | -1.5px *est* | Display (56–64, lh 1.0) |
| `type-heading` | Bold | 28 / 34 | -0.5px *est* | Heading (28–32, lh 1.2) |
| `type-title` | Bold | 18 / 22 | -0.2px | card titles (listing, policy, price) *est* |
| `type-body` | Regular | 16 / 24 | 0 | Body (16, lh 1.5) |
| `type-body-medium` | Medium | 16 / 24 | 0 | field text, chip labels |
| `type-caption` | Medium | 14 / 20 | 0 | Caption (14) |
| `type-button` | SemiBold | 17 / 22 | 0 | Button (17–18) |
| `type-label` | Medium | 12 / 16 | 0 | tab bar labels *est* |

### Components (all in `src/components/ui/`, one file each, kebab-case file names)

Contract for every component: `variant` / `size` / state props only, content through `children` or data props, a `className`/`style` override merged last, a `Pressable` with pressed feedback (opacity 0.85) on anything tappable, disabled at opacity 0.4, and `accessibilityRole` / `accessibilityState` / `accessibilityLabel` (required on icon-only controls). Sizes below are in points and estimated from the sheet and mockups (scale ≈ 1.75 px/pt on the mockups).

1. **Brand** — `wordmark.tsx`: "roam" in `font-jakarta-bold`, sizes `sm 32` / `md 56` / `lg 96` (lg spans ~70% of a phone-width card, like the sheet), tracking ≈ -4% of size, ink. A marked placeholder until a logo asset exists.
2. **Palette** — tokens only (see table).
3. **Typography** — `text.tsx`: `<Text variant="display|heading|title|body|body-medium|caption|button|label" tone="ink|secondary|tertiary|…">`. Default `body` + `ink`. Screens never set font size/family directly.
4. **Buttons** — `button.tsx`: `variant="primary"` (bg primary, ink label, optional trailing icon, e.g. `ArrowRight` right-aligned with the label centered) and `variant="secondary"` (bg surface, 1px border, optional leading icon/image). `size="md"` is 56 tall (px-6), and `size="sm"` is 40 tall (px-5, the small "Book this stay" in the typography section). `loading` shows an `ActivityIndicator`. Capsule radius. `icon-button.tsx`: circle, `size sm 36 | md 48 | lg 56` (lg default, as on the sheet), `variant="muted"` (bg surface-muted) or `"surface"` (white + `shadow-raised`, for use over photos), icon 24.
5. **Input fields** — `text-field.tsx`: 56 tall, radius lg, bg surface-muted with a 1px `border` border, leading icon (24, ink) + 12 gap + `type-body-medium` text, placeholder `ink-tertiary`. Focused: 1.5px `lavender-strong` border, bg `lavender-subtle`, caret `lavender-strong`. `trailing` slot for an action (search field: `SlidersHorizontal` icon button). `secureTextEntry` adds an `Eye`/`EyeOff` toggle (labelled "Show password" / "Hide password").
6. **Filter chips** — `chip.tsx`: `selected` + `tone="lavender"` (filter chips: 48 tall, px-6, `type-body-medium`, selected label SemiBold, selected bg lavender) or `tone="primary"` (category chips: 40 tall, px-4, leading icon 20 + `type-caption`, selected bg primary with a filled icon). Unselected bg surface-muted. `accessibilityState.selected`.
7. **Listing card** — `listing-card.tsx`: horizontal white card (radius xl, p-3, `shadow-card`, gap 16). Square image 128×128 (radius lg, `expo-image`) with a 36 `surface` heart icon button top-right (filled when `saved`). Right column: title `type-title` (2 lines), location row (`MapPin` 16 tertiary + caption tertiary), rating row (`Star` 16 filled `rating` + "4.9" caption ink + "(342)" caption tertiary), amenity pills (`tag.tsx`: 32 tall, px-3, bg surface-muted, icon 16 + caption), price "$280" `type-title` + " / night" body tertiary. Props: `title, location, rating, reviewCount, amenities[{icon,label}], pricePerNight, imageUrl, saved, onToggleSave, onPress`.
8. **Policy card** — `policy-card.tsx`: bg lavender-subtle, radius xl, p-4, row: 48 icon tile (lavender-muted, radius md, indigo icon 24) · title (SemiBold 16 ink) + description (body 14 secondary, 2 lines) · `ChevronRight` indigo 24. Props: `icon, title, description, onPress`.
9. **Profile row** — `list-group.tsx` + `list-row.tsx`: white group (radius lg, 1px border, overflow hidden), rows 56 tall, px-4, icon 24 ink + label `type-body-medium` (15) + `ChevronRight` 20 ink, hairline `border` dividers between rows (not after the last). Grouped list, not a card per row.
10. **Glass tab bar** — `glass-tab-bar.tsx`: capsule 72 tall, horizontal margin 16, glass surface (see Decisions), 4 equal items (icon 24 + `type-label`). The active item sits on a 64 `primary` circle with a filled icon. Props: `items[{key,label,icon}], activeKey, onSelect`, `accessibilityRole="tab"` + `selected`. Bottom safe-area inset applied by the caller.
11. **Iconography** — `icon.tsx`: one registry mapping semantic names to Lucide icons (`home→House, search→Search, heart→Heart, calendar→Calendar, user→UserRound, settings→Settings, pin→MapPin, filters→SlidersHorizontal, share→Share, bookmark→Bookmark, arrowRight→ArrowRight, chevronRight→ChevronRight, lock→Lock, eye→Eye, eyeOff→EyeOff, list→List, map→Map, minus→Minus, plus→Plus, close→X, success→CircleCheck, error→CircleAlert, star→Star, card→CreditCard, trips→Luggage, policyChat→Ghost, document→FileText, cabins→TreePine, beach→Waves, city→Building2, villas→TreePalm, hotTub→Bath, pets→PawPrint, sparkles→Sparkles`) and `<Icon name size color filled />`. Screens use only this registry. In the preview, icons sit in 48 muted circles.
12. **Segmented control** — `segmented-control.tsx`: track 52 tall, bg surface-muted, radius full, p-1. Segment = flex-1 capsule, icon 20 + `type-body-medium`. The active segment has bg ink and white text/icon. `accessibilityRole="tab"`. Props: `options[{value,label,icon}], value, onChange`.
13. **Toggles / Steppers** — `toggle.tsx`: RN `Switch`, `trackColor {false: border, true: primary}`, `thumbColor` white, `ios_backgroundColor` border. `stepper.tsx`: white capsule (1px border, 48 tall, px-2), 40 minus/plus hit areas (labelled "Decrease"/"Increase", disabled at `min`/`max`), value `type-title` centered at min-width 32. Props: `value, onChange, min=0, max`.
14. **Status / alerts** — `status-banner.tsx`: `tone="success" | "error"`, radius md, px-4, 48 min-height, row: filled circle icon 24 (`CircleCheck`/`CircleAlert`, fill success/danger, white glyph) · message `type-body-medium` in success-ink / danger · optional dismiss `X` (labelled "Dismiss"). `accessibilityRole="alert"`.
15. **Tags / badges** — `badge.tsx`: capsule 32 tall, px-4, `type-caption`, optional leading icon 18. Tones: `highlight` (primary-subtle bg, ink text, star icon filled primary), `success` (success-subtle, success-ink), `sale` (danger-subtle, ink), `info` (info-subtle, info-ink).

## Out of scope
- Real screens (home, search, property details, auth, profile) and tab navigation wiring.
- Dark palette, motion tokens (no animated components yet; add with the first animation), and a field `label` variant (the auth screen adds it).
- Logo/wordmark asset and Google logo asset (placeholders until provided).
- `expo-font` config plugin / dev build.

## Steps
### 1. Fonts, icons, light mode
- Copy the 4 `PlusJakartaSans-*.ttf` files + `OFL.txt` from the design folder's `fonts.zip` into `assets/fonts/`.
- `npx expo install lucide-react-native react-native-svg`.
- `app.json`: `userInterfaceStyle: "light"`.
- `src/app/_layout.tsx`: keep `import "../../global.css"` first. Call `SplashScreen.preventAutoHideAsync()`, `useFonts({ "PlusJakartaSans-Regular": require(...), …Medium, …SemiBold, …Bold })`, return `null` until loaded (or on error), then hide the splash screen. Add `<StatusBar style="dark" />`.
- Done when `npx tsc --noEmit` passes and the app boots on web with the font loaded.

### 2. Tokens
- `global.css`: after the existing imports, add an `@theme` block with `--spacing: 4px`, every `--color-*`, `--radius-*`, `--shadow-*`, and `--font-*` from the Decisions tables, and one `@utility type-*` per type style (font-family, font-size, line-height, letter-spacing in px).
- `src/theme/colors.ts`: `export const colors = { primary: "#FFC629", … } as const` with the same names and values (camelCase keys), plus a comment that it mirrors `global.css` for non-className props only. `src/theme/index.ts` re-exports it.
- Done when the Tailwind CLI output (`npx @tailwindcss/cli@4.1.12 -i global.css -o <scratch>/out.css`) contains `.bg-primary`, `.rounded-xl`, `.shadow-float`, `.font-jakarta-bold`, `.type-display`.

### 3. Foundations components
- `text.tsx`, `icon.tsx`, `wordmark.tsx` per sections 1, 3, 11. Done when tsc passes.

### 4. Controls
- `button.tsx`, `icon-button.tsx`, `text-field.tsx`, `chip.tsx`, `segmented-control.tsx`, `toggle.tsx`, `stepper.tsx` per sections 4, 5, 6, 12, 13.

### 5. Content and feedback
- `tag.tsx`, `listing-card.tsx`, `policy-card.tsx`, `list-group.tsx`, `list-row.tsx`, `status-banner.tsx`, `badge.tsx`, `glass-tab-bar.tsx` per sections 7–10, 14, 15. Read https://docs.expo.dev/versions/v57.0.0/sdk/glass-effect/ before writing the tab bar.

### 6. Preview route
- `src/app/design-system.tsx`: `if (!__DEV__) return <Redirect href="/" />`. A `ScrollView` on `bg-surface-muted` with the 15 sections in sheet order, each titled "01. Brand" … "15. Tags / Badges" and filled with the sheet's exact sample copy (e.g. "Cabins in California", "Joanna Smith", "Modern Cabin with Hot Tub", "$280 / night", "Account created successfully"). Interactive samples hold local state (chip selection, segmented value, toggle, stepper, focused field, dismissible banners).
- `src/app/index.tsx`: in `__DEV__`, add a link to `/design-system` (the starter text stays until the home screen lands).

## Verification
- `npx tsc --noEmit` and `npx expo lint` pass. `npx expo-doctor` shows nothing new beyond the known patch drift from plan 01.
- Token mirror: every hex in `src/theme/colors.ts` appears in `global.css` (scripted grep).
- Drift grep: no `#hex`, `fontSize`, or `fontFamily` literals in `src/components/` or `src/app/` outside `src/theme/` and `global.css`.
- Visual: `npx expo start --web`, open `http://localhost:8081/design-system` in headless Chrome, screenshot it, and compare each section to `design.png` (colors, sizes, radii, icons, copy, font). List every difference, fix it, and repeat (up to 5 rounds). Report which values were estimated.
- Interaction (web): tap chips, segments, toggle, stepper (min disables minus), focus a field (lavender border), toggle the password eye, dismiss a banner.
- iOS simulator: ❌ on this machine (no Xcode, `simctl` missing). The user checks in Expo Go (see Test it yourself).

## AGENTS.md updates
- Expo section: add a **Design system** rule. Tokens live in `global.css` `@theme` (colors, `--spacing: 4px`, radius, shadows, `font-jakarta*`) with `type-*` utilities for text. `src/theme/colors.ts` mirrors the colors for non-className props only. UI primitives live in `src/components/ui/`, screens use `<Text variant>` and `<Icon name>` and never raw font sizes, families, hex, or Lucide imports. Fonts are Plus Jakarta Sans loaded with `useFonts` in the root layout (switch to the config plugin with a dev build). Light mode only for now. Preview at `/design-system` (dev only).
- Building from designs: the design sheet is the token source. Placeholders pending: wordmark logo, Google logo.

## Result
Built as planned: tokens in `global.css`, a color mirror in `src/theme/colors.ts`, 18 components in `src/components/ui/`, and the dev-only `/design-system` preview covering all 15 sheet sections. tsc, lint, the token-mirror check, and the drift grep pass. expo-doctor shows only the existing patch drift (`expo`, `expo-router`, `@expo/ui`). The web render (headless Chrome at 390 and 600 wide) was compared with the sheet over 2 rounds. Round 1 found a nested-Pressable bug: the listing card's heart is now a sibling overlay, because nested buttons broke the static web DOM. It also found that RN Web's Switch ignored `thumbColor` (fixed with `activeThumbColor`). Known remaining differences: the filled `House` icon (active tab and the "All Stays" chip) is a solid shape with no door cutout. Profile rows skip the sheet's very faint icon tiles. The wordmark and Google logo are placeholders. On web the tab bar uses the translucent fallback, not Liquid Glass. Not verified: the iOS simulator (no Xcode on this machine) and scripted interaction checks (headless capture only).
