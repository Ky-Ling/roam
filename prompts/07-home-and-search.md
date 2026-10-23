# 07 · Home and search with native tabs

Status: done

## Goal
Signed-in guests land on a tabbed app (Home, Search, Trips, Profile) using Expo Router native tabs. Home matches `assets/prompt-imgs/home.png`. Guests type a sentence into Home's search bar, submit, and land on the Search tab (`assets/prompt-imgs/search.png`). Search shows ranked stays from realistic local data, with chips for what the sentence was understood to mean. Motion is subtle, built per the `expo-animation` skill.

## Decisions
- **Scope.** Home and Search are built from the designs. Trips and Profile are marked placeholders, and Sign out moves from the Home placeholder to Profile. Stay cards are not tappable yet, because property details comes in a later plan.
- **Routes.** Replace `src/app/home.tsx` with a `(tabs)` group:
  - `src/app/(tabs)/_layout.tsx`: `NativeTabs` from `expo-router/unstable-native-tabs`, SDK 57 API (`NativeTabs.Trigger.Icon` / `.Label`).
  - `src/app/(tabs)/home.tsx`, `search.tsx`, `trips.tsx`, `profile.tsx`: each route imports one screen.
  - URLs stay `/home` and `/search`.
  - `AppNavigator` guards `(tabs)` where it guarded `home`. The Stack.Protected redirect behavior is unchanged.
  - No nested stacks yet, since nothing pushes. Plan 08 (details) adds them.
- **Tab bar.** It stays native, so it doesn't copy the design's yellow pill.
  - Triggers, in order:
    - Home: `sf={{ default: "house", selected: "house.fill" }}`, `md="home"`.
    - Search: `sf="magnifyingglass"`, `md="search"`. Don't use `role="search"`, because iOS 26 would turn it into a system search field that duplicates ours.
    - Trips: `sf="calendar"`, `md="calendar_month"`.
    - Profile: `sf={{ default: "person", selected: "person.fill" }}`, `md="person"`.
  - `tintColor={colors.ink}`. On Android, `indicatorColor={colors.primary}` gives the yellow selection pill.
  - Labels use the Jakarta medium family.
  - Tab switches don't animate (skill rule: tabs are peers).
- **Local data.** `src/data/stays.ts` holds about 14 realistic stays across cabins, beach, city, and villas, mostly in California. Each stay has: `id`, `title`, `type` (`cabin | beach | city | villa`), `city`, `region` (e.g. "CA"), `regionName` ("California"), `rating`, `reviewCount`, `pricePerNight`, `maxGuests`, `petsAllowed`, `amenities` (keys like `hotTub | pool | fireplace | oceanView | wifi`), `vibes` (soft words like quiet, cozy, secluded, lively, romantic), and `imageUrl` (remote Unsplash photo, an allowed placeholder per CLAUDE.md). It includes the four stays in search.png, with the same titles, places, ratings, counts, and prices. Data is static and read synchronously. This file is a stand-in for Sanity: the types match what the schema will need, and swapping it out later changes the data source only.
- **Query parsing (code, not AI).** `src/lib/search/parse-query.ts` turns a sentence into `{ type?, maxPrice?, amenities[], pets, place?, vibes[] }`.
  - Price: `under/below/less than/max/< $N`, plus `$N a night` without a qualifier is treated as a cap.
  - Type: cabin(s), a-frame → cabin; beach, beachfront, ocean → beach; city, apartment, loft, downtown → city; villa(s) → villa.
  - Amenities: hot tub/jacuzzi, pool, fireplace, ocean view, wifi.
  - Pets: pet/dog/cat friendly, pets.
  - Place: matched against the data's city, region, and regionName, case-insensitive.
  - Vibes: the known soft words.
- **Ranking.** `src/lib/search/search-stays.ts` applies hard filters (type, maxPrice, amenities, pets, place) to drop stays. It then sorts by number of vibe matches, then rating. An empty query returns all stays sorted by rating. This mirrors the future GROQ filters plus embedding `score()`.
- **Search chips.** Search shows one chip per parsed constraint, e.g. "Cabins", "Under $300", "Pet Friendly", "Hot Tub", "Quiet". All start selected (lavender). Tapping a chip turns that constraint off or on and re-ranks. When the query changes, chips are rebuilt from it.
- **Sort.** "Sort by Best match ⌄" opens a native action sheet (`ActionSheetIOS` on iOS, a simple `Alert` with options elsewhere) with Best match, Price: low to high, and Top rated.
- **Home behavior.**
  - Greeting: "Hey, {first name} 👋", using Clerk's `firstName`, falling back to the email's local part. `useSession` gains `firstName` and `imageUrl`.
  - Avatar: Clerk `imageUrl` in a 96 circle on `bg-primary-subtle`. If there's no image, the circle shows the initial.
  - Gray search button: opens the Search tab with no query.
  - Lavender bar: a `TextInput` with placeholder "quiet pet friendly cabin with hot tub". The return key or the ↗ button submits. An empty submit uses the placeholder sentence. Submitting runs `router.navigate({ pathname: "/search", params: { q } })` and clears the field.
  - Category chips (All Stays, Cabins, Beach, City, Villas) filter the featured cards below, one selected at a time.
  - Featured cards: full-width photo cards for the selected category, sorted by rating.
- **Search behavior.**
  - Back button: `router.navigate("/home")`.
  - Field: shows `q` and can be edited. Submitting re-runs the search by updating the `q` param.
  - Filters icon (sliders): shown to match the design but does nothing yet, labeled "Filters, coming soon". The filters sheet is a later plan.
  - Count: "{n} stays", or "1 stay".
  - Results: a `FlatList` of the existing `ListingCard`. Hearts toggle in local state only.
  - Empty state: "No stays match that" with a "Clear filters" button that turns every chip off. Loading and error states don't apply, because the data is local and synchronous. That is noted in the code.
- **Animation**, gated per the skill. Each item lists frequency → purpose → implementation.
  - Home first mount (once per session), to prevent a jarring change. Header, search bar, chips, then cards use `entering={FadeInDown}`: 260ms, translateY 12, `Easing.bezier(0.23, 1, 0.32, 1)`, staggered 40ms. With reduced motion this becomes a plain FadeIn.
  - Category change (tens per day), for state indication. The chip background is a Reanimated CSS transition: 180ms, `cubicBezier(0.23, 1, 0.32, 1)`. The featured cards are not virtualized, so cards use `entering={FadeIn.duration(200)}`, `exiting={FadeOut.duration(150)}`, and `layout={LinearTransition.duration(220)}`.
  - Press feedback (tens per day). The ↗ submit button, gray search button, and featured cards scale to 0.97 in 120ms through a CSS transition, in a new `ui/pressable-scale` primitive (state-driven, no shared value).
  - Search results (each search), for state indication. Rows use `itemLayoutAnimation={LinearTransition.duration(220)}` when chips change, never `entering` on virtualized rows. The whole list fades in (`FadeIn.duration(200)`) by keying it on the submitted query.
  - Rejected: animating tab switches (100+ per day), parallax on the hero photos (no purpose), and haptics (`expo-haptics` isn't installed, and adding it needs approval; noted for later).
- **Tokens.** Every value maps to an existing token, so no new tokens are needed. The hero card scrim is a bottom `linear-gradient` from transparent to `rgba(11,11,26,0.75)` via RN's `experimental_backgroundImage`, so no new dependency. Its end alpha is a one-off value that stays in that file. The rating pill is white with a filled ink star and `type-title`.
- **Sizes estimated from the image** (390pt-wide phone):
  - Wordmark `md`.
  - Headline `type-hero`, with the greeting at `type-title` in the secondary tone.
  - Gray search button 72×96 with `rounded-2xl`.
  - Lavender bar `h-16 rounded-full` with a `size-12` white ↗ button.
  - Featured card `h-80 rounded-2xl`.
  - Search field `h-14 rounded-full bg-surface-muted` and back button `size-14`.

## Out of scope
- Property details.
- Trips and Profile content.
- Filters sheet.
- Saving hearts beyond the screen.
- Sanity / GROQ / embeddings / Jev.
- PostHog events.
- Haptics.
- Real "roam" logo, which is still the wordmark placeholder.

## Steps
### 1. Data and search logic
Create `src/data/stays.ts` (type `Stay`, plus the `STAYS` array) and `src/lib/search/{types,parse-query,search-stays,index}.ts` as decided above. Follow the code-structure rules: es-toolkit helpers through `@/lib/utils`, and no `typeof`. Done when `npx tsc --noEmit` passes. A scratch `node` run with these inputs gives the expected results:
- "quiet pet friendly cabin with hot tub under $300" returns pet-friendly cabins with hot tubs at $300 or less, quiet ones first.
- "beach house in Malibu" returns the Malibu beach stays.
- "" returns everything.

### 2. Tabs and routing
- Add `src/app/(tabs)/_layout.tsx` with NativeTabs and its four routes.
- Delete `src/app/home.tsx`.
- Point the `AppNavigator` guard at `(tabs)`.
- Add placeholder `src/screens/trips` and `src/screens/profile` (Profile shows the name and email plus Sign out).
- Extend `useSession` with `firstName` and `imageUrl`.

Done when signing in lands on Home with a native tab bar, all four tabs switch, and Sign out on Profile returns to onboarding.

### 3. Home screen
Rebuild `src/screens/home/`:
- `use-home.ts` holds the session, category state, query text, submit, and the featured list.
- `index.tsx` lays out the screen.
- Parts in `components/`: `home-header` (wordmark plus avatar), `home-hero` (greeting, headline, gray search button), `home-search-bar` (lavender input), `category-chips`, and `featured-stay-card`.
- Add the `ui/pressable-scale` primitive.
- Add `entering`/`layout` animations as decided.
- Add chips `CATEGORY` constants in `src/screens/home/constants.ts`.

Done when the screen matches home.png in the simulator.

### 4. Search screen
Build `src/screens/search/`:
- `use-search.ts` reads `q` with `useLocalSearchParams`, parses it, and holds chip toggles, sort, saved IDs, and the derived results.
- Parts: `search-header` (back plus field plus filters), `constraint-chips`, `results-bar` (count plus sort), and `empty-results`.
- Results render through `ListingCard`.

Done when submitting from Home shows matching results like search.png, and chips and sort re-rank with the layout animation.

### 5. Design check and polish
Screenshot `roam://home` and `roam://search?q=quiet%20pet%20friendly%20cabin%20with%20hot%20tub` in the iOS simulator. Compare each with its design, list the differences, fix them, and repeat.

## Verification
- `npx expo lint` and `npx tsc --noEmit` are clean.
- The scratch parser and ranker checks from step 1 pass.
- Simulator flow:
  1. Sign in and land on Home with a native tab bar.
  2. The entrance fades in once.
  3. Tapping Cabins swaps the cards with a fade and reflow.
  4. Type "pet friendly cabin under $300" and press ↗. The Search tab opens with chips Cabins, Under $300, Pet Friendly, and only matching stays.
  5. Tap "Under $300" off. Pricier cabins slide in.
  6. Sort by price. The order changes.
  7. Type nonsense like "igloo on mars under $5". The empty state shows, and Clear filters brings results back.
  8. Back returns to Home.
  9. Profile → Sign out returns to onboarding.
- Reduced motion on (Settings → Accessibility → Motion): entrances fade without movement.
- Screenshots compared with home.png and search.png, differences listed.

## AGENTS.md updates
- Expo section: "`/` is onboarding … `home` (signed in)" becomes `(tabs)` (signed in). Add that the `(tabs)` group uses `NativeTabs` with Home, Search, Trips, and Profile; Search takes `?q=`; and Trips and Profile are placeholders. Replace "`/home` is a marked placeholder."
- New line under Who owns what → Exact constraints: until Sanity is wired, `src/data/stays.ts` plus `src/lib/search` stand in, with code-parsed hard filters and soft words ranking only.
- Design system: `PressableScale` is the press-feedback primitive (scale 0.97, 120ms). Animations follow the `expo-animation` skill: no tab-switch animation, and no `entering` on virtualized rows.

## Result
Built as planned. Lint and type check are clean. The parser checks pass. The full flow (sign in, Home, category swap, submit, chips, sort, empty state, Clear filters, back) was run on web at iPhone 15 size through Playwright, since this Mac has no Xcode/iOS Simulator. Not yet seen on iOS.
- **Additions beyond the plan:**
  - `type-input-sm` (14px), so the home example sentence fits on one line.
  - `Chip` gained `size="lg"` (h-12) for the home category row.
  - Six icons: pool, fireplace, oceanView, wifi, arrowUpRight, chevronDown.
- **Web only:** the native tab bar floats at the top, so screens pad for it. RN-web's `Alert` is a no-op, so on web Sort steps through the options.
- **Known difference:** search-result tags wrap to two lines, because the design's tags are smaller than the design-system `Tag`.
