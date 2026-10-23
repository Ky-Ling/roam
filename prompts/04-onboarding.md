# 04 · Onboarding

Status: done

## Goal
On launch, guests see a 3-slide onboarding carousel that matches `assets/prompt-imgs/onboarding.png`. "Get started", "Skip", and "Continue with Google" take them into the auth flow, which for now is a placeholder sign-up screen.

## Decisions
- **Carousel:** 3 slides. Slide 1 is the design. Slides 2–3 reuse its layout with new copy and photos (below). Swipe anywhere except on the buttons. Built on a horizontal `FlatList` with `pagingEnabled`, so it needs no new dependency and no gesture-handler root.
- **Moving vs fixed parts:** each page holds its photo, location pill, curved white sheet, and title + body, so the text slides with the photo. The wordmark, Skip, progress bars, and the two buttons sit in a fixed overlay (`pointerEvents="box-none"`). Every page's sheet is the same height, because the text block has a fixed `min-h-38` (2 title lines + 3 body lines), so the fixed bars and buttons always line up with it.
- **Navigation:** Get started, Skip, and Continue with Google all `router.push("/sign-up")`. Google OAuth replaces the Google button's target when Clerk lands.
- **Auth routes:** a new `src/app/(auth)/` group (Stack, no header) with `sign-up.tsx`. That screen is a **marked placeholder**: back button, small wordmark, "Create your account" heading, and one line saying sign-up arrives with Clerk. The real Create account screen (`auth.png`) and Clerk are the next plan.
- **Shown every launch:** onboarding is `/` (index). There's no "seen" flag and no new dependency. The `/design-system` route stays reachable in dev through `roam:///design-system`. The dev link on the old index placeholder goes away along with that placeholder.
- **Photos:** remote Unsplash placeholders (allowed for sample property photos), one per slide, each URL checked with `curl -I` before use, kept in `constants.ts`, and rendered with `expo-image` (`contentFit="cover"`).
- **Google "G":** still a placeholder. The placeholder moves from `src/screens/design-system/components/` to `src/components/ui/google-logo/` because two screens now use it.
- **Status bar:** dark, as the root layout already sets it. The sky behind it is light.

### Slide copy
| # | Pill | Title | Body |
|---|---|---|---|
| 1 | Whistler, BC | Find a stay that fits your story | From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip. |
| 2 | Big Sur, CA | Describe it in one sentence | Quiet, pet friendly, hot tub, under $300 a night. Tell roam what you want and get stays ranked for you. |
| 3 | Tulum, MX | Answers from the source | Ask about check-in, pets or cancellations and see the stay's own policy text, word for word. |

Photos: 1 a lakeside cabin deck at sunset with mountains, 2 a coastal house above the sea, 3 a villa with a pool among palms.

### Design spec (390 pt wide; *est* = measured from the mockup)
- **Background:** the page photo fills the whole screen, behind the sheet too.
- **Header (fixed):** top = safe-area top + 4. `Wordmark size="md"` on the left at 24 from the edge. **Skip** on the right at 24 from the edge: a light glass pill, `h-11` (44) *est*, `px-5`, `type-body-medium` ink.
- **Location pill (per page):** left 24, 12 *est* above the sheet's highest point. A dark glass pill, `h-10` (40) *est*, `px-3.5`, gap 8, `pin` icon 18 white, `type-caption` white.
- **Sheet:** white (`bg-surface`). The top edge is an SVG curve (`react-native-svg`, viewBox 390×56, `preserveAspectRatio="none"`): highest at about x=95, about 28 lower at x=340, then rounded down into the right edge. A ~24 radius rounds the top-left corner. The traced points (x, drop below the peak, *est*) are 8:20, 33:3, 95:0, 157:3, 218:9, 280:17, 341:28, 378:44.
- **Progress bars (fixed):** 30 below the sheet's peak *est*, left 24. Three bars, `w-8 h-1 rounded-full`, gap 8. Active is `lavender-strong`, inactive is `border`. They update while scrolling (index = `round(x / width)`). One accessibility label: "Slide n of 3".
- **Text (per page):** 20 below the bars. Title in the new `type-hero`, ink, 2 lines. 8 gap. Body in the new `type-lead`, `secondary`, ≤3 lines. Horizontal padding 24.
- **Buttons (fixed):** 20 below the text block. `Button` "Get started" (primary, `trailingIcon="arrowRight"`), then a 12 gap, then `Button` "Continue with Google" (secondary, `leading=<GoogleLogo />`). Both are `md` (56), the design sheet's size. The mockup reads about 49 *est*, but the sheet wins. Bottom padding is the safe-area bottom inset.

### Proposed new tokens
- `type-hero`: Jakarta Bold 36 / 38, letter-spacing -1 *est*. The mockup's headline face is heavier, like the wordmark, so it's the same placeholder caveat. → `<Text variant="hero">`.
- `type-lead`: Jakarta Regular 16 / 22 *est*, for intro paragraphs. The auth mockup uses the same rhythm. → `<Text variant="lead">`.
- `--color-scrim: rgba(11, 11, 26, 0.45)` *est*, for dark glass on photos. Mirrored as `colors.scrim` (also the GlassView `tintColor`).

### New shared components
- `ui/glass-pill/glass-pill.tsx`: `{ label, icon?, tone: "light" | "dark", onPress?, className? }`. It renders a `Pressable` (`accessibilityRole="button"`) when `onPress` is set, otherwise a `View`. With Liquid Glass available it uses `GlassView` (`colorScheme` from the tone; dark tone also gets `tintColor={colors.scrim}`). Otherwise light is `bg-glass border border-white` and dark is `bg-scrim border border-white/40`. Text and icon are ink on light and white on dark. Never animate its opacity (that breaks GlassView, per the SDK 57 docs).
- `ui/google-logo/google-logo.tsx`: the moved placeholder, renamed `GoogleLogo`, still marked PLACEHOLDER.
- `Icon`: add `back: ChevronLeft`.

## Out of scope
- The real Create account / Sign in screens, Clerk, and Google OAuth (next plan).
- Remembering that onboarding was seen, and redirecting signed-in users past it.
- Auto-advancing slides, parallax, and slide-change animation beyond the native paging.
- The logo and Google "G" assets (still placeholders).

## Steps
### 1. Tokens and shared primitives
Add `type-hero`, `type-lead`, and `--color-scrim` to `global.css`, and `scrim` to `src/theme/colors.ts`. Add the `hero` and `lead` variants to `Text`, and `back` to `Icon`. Create `glass-pill` and move the Google placeholder to `ui/google-logo` (update `buttons-section.tsx` and the design-system `components/index.ts` if it's exported there). Add samples to `/design-system`: hero/lead in Typography, and both GlassPill tones in Badges. Done when tsc and lint pass.

### 2. Auth route placeholder
Create `src/app/(auth)/_layout.tsx` (Stack, `headerShown: false`) and `src/app/(auth)/sign-up.tsx`, which imports `SignUpScreen` from `src/screens/sign-up/`. The screen has a safe-area top, `IconButton icon="back"` (muted, `router.back()`, label "Back") on the left, `Wordmark size="sm"` on the right, the heading "Create your account", and a `secondary` body line marked PLACEHOLDER. Put the back handler in `use-sign-up.ts`. In the root layout, register `index` and `(auth)` with `headerShown: false`. Done when `/sign-up` renders and Back works.

### 3. Onboarding screen
`src/screens/onboarding/`:
- `constants.ts`: the `SLIDES` array (`key, location, title, body, image`).
- `use-onboarding.ts`: `width` from `useWindowDimensions`, safe-area insets, `index` state, an `onScroll` handler (`scrollEventThrottle={16}`) that sets the index only when it changes, and a `goToAuth` handler (`router.push("/sign-up")`). It returns one flat object.
- `components/`: `onboarding-slide.tsx` (photo, pill, sheet curve, sheet body with text, and bottom spacers that match the fixed overlay), `sheet-curve.tsx` (the SVG), `progress-bars.tsx`, `onboarding-header.tsx` (wordmark + Skip), `onboarding-actions.tsx` (the two buttons), and `index.ts`.
- `index.tsx`: the full-screen `FlatList` (horizontal, `pagingEnabled`, no indicators, `getItemLayout`) plus the fixed header and the bottom overlay (bars, a `pointerEvents="none"` spacer, actions).
`src/app/index.tsx` renders `OnboardingScreen`. Done when all 3 slides swipe and all 3 buttons open `/sign-up`.

### 4. Compare with the design
Run on web at 390×844 (no Xcode here, so no iOS simulator), take a headless Chrome screenshot, and compare it with `onboarding.png`. List the differences, fix them, and repeat (up to 3 rounds).

## Verification
- `npx tsc --noEmit` and `npx expo lint` pass.
- Every photo URL returns 200 (`curl -I`).
- Web at 390 wide, screenshots of slides 1–3: the layout matches the spec, text isn't clipped, and bars and text line up with the sheet on every slide.
- Web at a narrow width (360) and a wide one (430): the title still wraps to ≤2 lines and the sheet curve stretches cleanly.
- End to end: open `/`, swipe to slide 3 (bars follow), tap Skip, see the sign-up placeholder, tap Back, tap Get started, see sign-up, go back, tap Continue with Google, see sign-up.
- Not covered: the iOS simulator and Liquid Glass rendering (no Xcode on this machine).

## AGENTS.md updates
- Expo / design system: add `type-hero`, `type-lead`, and the `scrim` color to the token list. Add the `GlassPill` primitive (light/dark glass on photos).
- Building from designs: the Google "G" placeholder now lives in `src/components/ui/google-logo/`.
- Routes: auth screens live in the `src/app/(auth)/` group. `/` is onboarding and shows on every launch until auth adds a "seen"/signed-in redirect.

## Result
Built as planned: the 3-slide FlatList carousel at `/`, the `GlassPill` and `GoogleLogo` primitives, the `type-hero` / `type-lead` / `scrim` tokens, and the `(auth)` group with a placeholder `/sign-up`. tsc and lint pass, and all photo URLs return 200. Web (headless Chrome) was compared with the design over 4 rounds at 390, plus 360 and 430. Get started, Skip, and Continue with Google each open `/sign-up`, and Back returns to `/`.

Changes from the plan, all found while comparing:
- `type-hero` is **40 / 42, -1.2 tracking** (not 36 / 38). The mockup's cap height measures ~28 pt, and at 36 the headline looked small.
- Titles break by hand (`\n` in `constants.ts`), because Jakarta is narrower than the mockup's face and otherwise wraps "fits" onto line 1. The text block is `h-40` (160) to fit 2×42 + 3×22.
- Each page's photo fills only the area above the sheet (it runs 56 under the curve), with a per-slide `focus` (`contentPosition`), so the landscape placeholders show their subject.
- Body-to-button gap is 16 (`mt-4`), as measured. The bottom padding is at least 16 where the device reports no inset (web).
- Slide 2–3 pills follow the photos actually used: "Lake Braies, IT" and "Ubud, Bali".

Known differences: the headline and wordmark face (Jakarta placeholder), an outlined pin where the design's is solid, the Google "G" placeholder, and the translucent fallback instead of Liquid Glass on web. Not verified: the iOS simulator, Liquid Glass, and real touch swiping (no Xcode here; slides were captured by setting the scroll offset).

### Follow-up fixes (user review)
- Skip and the wordmark weren't aligned. `GlassPill` had `self-start` in its base classes, which overrode the header's `items-center`, so it's gone and callers set their own alignment. Skip also gets `mt-3.5`, because "roam" has no ascenders and its letters sit 7 below the line box's center. The header top is `max(inset - 8, 8)` so the wordmark sits right under the status bar, as in the design.
- Photos were blurry: 1200 px wide, stretched ~2× on 3× screens. They're now `w=2400&q=85&auto=format`.
- The headline was ~10% small (the design's "Find a stay that" is 295 pt wide, ours was 269). `type-hero` is now **44 / 44, -1.5 tracking**, and the text block is `h-41`. The title has no `numberOfLines`, because its overflow clip cut descenders on web.
- The Google "G" is now Google's official mark (`assets/images/google-g.svg`), rendered with `expo-image` in `GoogleLogo`, no longer a placeholder.
