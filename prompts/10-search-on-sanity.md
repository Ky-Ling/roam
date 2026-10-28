# 10 · Search on Sanity, matched to the design

Status: done

## Goal
Search (`/search?q=`) shows live published stays from Sanity instead of `src/data/stays.ts`, and looks exactly like `assets/prompt-imgs/search.png`. Code parses the sentence, hard constraints become GROQ filters with params, and soft words rank through the `vibes` field. Every submitted sentence sends one PostHog event that says whether it found stays.

## Decisions
- **Answers to this round's questions:**
  - Ranking: GROQ only, from the app. Soft words rank with `score(vibes match $vibes)`. Embeddings through an authenticated API route come in a later plan. No new dependency.
  - Card: a new search-only `ResultCard` in `src/screens/search/components/`. The design-system `ListingCard` stays as it is.
  - Event: one event, `search_completed`, with a `has_results` property.
  - Timing: sent once per submitted sentence, when its first results arrive. Chip toggles and sort changes already have their own events and don't send it.
- **Query (checked against the live dataset with MCP):** `src/lib/sanity/queries.ts` gets `searchStaysQuery(sort)`. It returns a GROQ string with a fixed filter and one of three fixed `order()` clauses. Values are always params, never spliced in:
  ```
  *[_type == "property"
    && ($type == null || stayType == $type)
    && ($maxPrice == null || pricePerNight <= $maxPrice)
    && (!$pets || petsAllowed)
    && count(amenities[@ in $amenities]) == count($amenities)
    && ($place == null || $place in [location.city, location.region, location.regionName])
  ] | score(vibes match $vibes) | order(<ORDER>)[0...100] {
    "id": slug.current, title, "city": location.city, "region": location.region,
    rating, reviewCount, pricePerNight, petsAllowed, amenities,
    "photo": photos[0]{alt, hotspot, "url": asset->url}
  }
  ```
  - ORDER is `best`: `_score desc, rating desc, reviewCount desc`. `price`: `pricePerNight asc, rating desc`. `rating`: `rating desc, reviewCount desc`.
  - When chips are toggled off, those constraints go as `null`, `false` or `[]`. Vibe-only and empty sentences return every stay.
  - The 100 cap is far above the 30 stays. Pagination comes later.
- **Places for the parser:** `SEARCH_PLACES_QUERY` = `array::unique(*[_type == "property"]{"p": [location.city, location.region, location.regionName]}.p[])`. `fetchPlaces()` in `src/lib/sanity/places.ts` caches the promise for the session and drops the cache on failure, so a retry fetches again. `parseQuery(query, places: string[])` replaces the `stays` argument. Longest name wins, as today.
- **Types move:** `StayType`, `Amenity` and `Vibe` move from `src/data/stays.ts` to `src/lib/sanity/types.ts`. `Amenity` grows to the schema's 16 keys. `src/data/stays.ts` is deleted, along with `searchStays` and the local `passes`/`orderBy` ranking. `constraintKey` and `constraintLabel` stay in `src/lib/search`.
- **Parser additions:** patterns for the new amenities: lake view, mountain view, forest/redwood view, beach access, kitchen, workspace/desk, parking, AC/air conditioning, washer/laundry, EV charger, BBQ/grill. As now, amenities are cut from the text first, so "beach access" doesn't also read as a beach stay.
- **Amenity display:** `AMENITY_META` covers all 16 keys. New icons are added in `ui/icon`: forestView `Trees`, mountainView `Mountain`, lakeView `Sailboat`, beachAccess `Umbrella`, kitchen `CookingPot`, workspace `Laptop`, freeParking `CircleParking`, airConditioning `AirVent`, washer `WashingMachine`, evCharger `PlugZap`, bbqGrill `Beef`. Their availability in the installed lucide version is checked at build time, and a missing one is swapped for the nearest glyph and listed.
- **Card tags (2 max):** amenities the guest asked for come first, then the stay's first standout amenity (`hotTub, pool, fireplace, oceanView, beachAccess, lakeView, mountainView, forestView`), then "Pet Friendly" if pets are allowed, then the next standout. Wifi, kitchen and the other basics never show. This matches the design: Hot Tub + Pet Friendly, Pool + Ocean View, Fireplace + Pet Friendly.
- **Data hook:** `src/screens/search/use-search-results.ts` returns `{ stays, status: "loading" | "error" | "ready", retry }` and follows `use-featured-stays.ts`: it aborts the request it replaces and only shows the error of the current request. While a chip or sort change refetches, it keeps showing the previous list, so the rows reflow instead of flashing. Only a new sentence shows the loading state. `useSearch` calls it and stays the screen's one orchestrator.
- **PostHog:** `search_completed` with:
  - `result_count`
  - `has_results` (filter on `false` for searches with no matches)
  - `constraint_kinds`: sorted unique kinds, e.g. `["amenity","maxPrice","type"]`
  - `source`: `home`, `search`, or `link` (no param).

  Home's submit adds `src: "home"` to the route params, and Search's submit adds `src: "search"`. It's sent once per new `q` when its first successful results land, tracked by the last reported `q`. No typed text, place names or values are sent. Resubmitting the same sentence doesn't refetch and doesn't send the event. A failed request sends nothing.
- **States** (no design for them, built from existing primitives):
  - Loading: 3 static placeholder rows, each a `w-34 h-36 rounded-md bg-surface-muted` block plus two muted text bars.
  - Error: `StatusBanner` "Couldn't load stays." with a secondary "Try again" button.
  - Empty: the existing `EmptyResults`.
  - The count line reads "… stays" while loading.
- **Design measurements** (estimated from search.png at about 1.87 px/pt, 20pt side gutters):
  - Header: back button `size-13` muted circle, chevron 24. Field `h-13 rounded-full bg-surface-muted px-5`, search icon 24, `type-input`, filters icon 24 on the right. Gap 12.
  - Chips: lavender, new `Chip size="sm"` = `h-9 px-4`, label `type-body-medium` (semibold when selected), gap 10 (`gap-2.5`). They sit 12 below the header.
  - Results bar: 16 below the chips. "124 stays" `type-body`. "Sort by **Best match**" `type-caption` with the value in Jakarta bold, plus chevron-down 18.
  - Result row: 16 below the results bar, rows 16 apart, no card background, padding or shadow.
    - Photo `w-34 h-36` (136×144) `rounded-md corner-squircle`, Sanity URL at 3× (408×432) through `sanityImageUrl`.
    - Text column 12 to the right of the photo, `gap-1.5`:
      - Title `type-title`, 2 lines, with `pr-12` to clear the heart.
      - Pin 16 + city, region `type-caption` tertiary.
      - Filled star 18 `colors.rating` + rating `type-body` + `(count)` tertiary.
      - Tags.
      - Price.
    - Heart: `IconButton` muted, `size-11` (44), at the row's top right as a sibling of the row's Pressable.
  - Tags: new `Tag size="sm"` = `h-7 px-2.5 gap-1`, icon 14, `type-label`, on one line.
  - Price: "$289" in a **proposed new token `type-price`** (Jakarta bold 20 / line-height 24, letter-spacing -0.2), then " / night" `type-caption` tertiary.
  - Tab bar: native as before (it doesn't copy the design's yellow pill, per CLAUDE.md).
- **Motion:** unchanged. The list fades in per new sentence, rows use `itemLayoutAnimation` on chip and sort changes, and there's no `entering` on rows.
- **Rows aren't tappable** (no details screen yet). Hearts stay local state with their existing events.

## Out of scope
- Embeddings / `text::semanticSimilarity()` and the API route with Clerk verification.
- The filters sheet (the icon stays a labeled no-op).
- Pagination past 100 results.
- Property details.
- Persisting hearts.
- A `search_failed` event.
- Changing `ListingCard` or the tab bar.

## Steps
### 1. Types, places and query
- Add `src/lib/sanity/types.ts` (`StayType`, `Amenity` with 16 keys, `Vibe`).
- Add `places.ts` (`SEARCH_PLACES_QUERY`, cached `fetchPlaces`).
- Add `searchStaysQuery(sort)` and a `SearchStay` type to `queries.ts`, and export them from `index.ts`.
- Point `FEATURED_STAYS_QUERY`, `constants/stays.ts`, `screens/home/constants.ts` and `lib/search/types.ts` at the new types.
- Done when `npx tsc --noEmit` passes, ignoring Search files that still use the local data.

### 2. Parser and constraint params
- `parseQuery(query, places)` with the new amenity patterns.
- `toQueryParams(active: Constraint[])` in `src/lib/search` returns `{ type, maxPrice, pets, amenities, place, vibes }` with null or empty defaults.
- Delete `search-stays.ts`'s ranking (keep `constraintKey` and `constraintLabel`, moved to `constraints.ts`) and `src/data/stays.ts`.
- Done when a scratch run of the parser plus params, using real places, gives:
  - "quiet pet friendly cabin with a hot tub under $300" → cabin, 300, pets, [hotTub], [quiet].
  - "beach house in Malibu" → beach, Malibu.
  - "cabins in California" → cabin, California.
  - Each param set returns the expected stays through MCP GROQ.

### 3. Icons, tags and tokens
- Add the icons and the full `AMENITY_META`.
- Add `Tag size="sm"`, `Chip size="sm"` and `@utility type-price` with its `Text` variant.
- Show the new sizes on `/design-system` (tags, chips and typography sections).

### 4. Search screen on Sanity
- Add `use-search-results.ts`.
- Rewrite `use-search.ts`: places → parse → active constraints → params → results, plus the `search_completed` event and the `src` param.
- Add `components/result-card.tsx`, `result-row-placeholder.tsx` and `results-error.tsx`.
- Restyle `search-header`, `constraint-chips` and `results-bar` to the measurements.
- `utils.ts` maps a `SearchStay` to card props, including the tag rule.
- Home's submit passes `src: "home"`.
- `npx expo lint` and `npx tsc --noEmit` must be clean.

### 5. Design check
Open `roam://search?q=cabins%20in%20California` in the iOS simulator. If no simulator is available, use web at iPhone 15 size, as in plans 07 and 09. Screenshot it, compare it with search.png, list every difference, fix, and repeat.

## Verification
- `npx expo lint` and `npx tsc --noEmit` are clean.
- Parser and params scratch checks pass, and their GROQ results match by hand.
- Flows:
  1. From Home, submit "quiet pet friendly cabin with a hot tub under $300". Search shows the chips Cabins, Under $300, Pet Friendly, Hot Tub, Quiet, and only pet-friendly cabins with a hot tub at $300 or less, with quiet ones first.
  2. Turn "Under $300" off. Pricier cabins appear with a reflow and no loading flash.
  3. Change the sort to Price, then Top rated. The order changes.
  4. Submit "igloo on mars under $5". The empty state shows, and Clear filters brings stays back.
  5. Offline or a blocked request shows the error banner, and Try again recovers.
  6. Edit a stay's price in the Studio and publish. The next search reflects it.
- PostHog (MCP query on events from the dev session):
  - Flow 1 sends one `search_completed` with `has_results: true`, `source: "home"` and the right `constraint_kinds`.
  - Flow 4 sends `has_results: false`, `result_count: 0`, `source: "search"`.
  - Chip toggles and sorts send no `search_completed`.
  - No event contains the typed sentence.
- Screenshots are compared with search.png, and the differences are listed.

## AGENTS.md updates
- **Exact constraints:** replace "Search still runs on `src/data/stays.ts` and `src/lib/search` until it moves to GROQ…" with: Search parses the sentence in code (`src/lib/search`, place names from Sanity), sends hard constraints as GROQ params (`searchStaysQuery`), and ranks soft words with `score(vibes match $vibes)` until the embeddings API route lands. Content types (`StayType`, `Amenity`, `Vibe`) live in `src/lib/sanity/types.ts`. Remove the "extend `AMENITY_META`" note.
- **Analytics:** `search_completed` (`result_count`, `has_results`, `constraint_kinds`, `source`) is sent once per submitted sentence. Search routes carry `src` for it.
- **Design system:** `type-price`, `Tag size="sm"` and `Chip size="sm"`.

## Result
Built as planned. Lint and type check are clean. Checked on web at iPhone size (393×852) through Playwright, since this Mac has no Xcode/iOS Simulator. Not yet seen on iOS.
- **Parser checks:** all planned sentences parse as expected. The query for flow 1 returns the 3 pet-friendly hot-tub cabins at $300 or less, quiet ones first, both through MCP GROQ and in the app.
- **Additions beyond the plan:**
  - The place is matched and cut from the text before the type, so "Laguna Beach" doesn't read as a beach stay.
  - Two-letter region codes match only in capitals, so "cabin or cottage" doesn't read as Oregon.
  - `coalesce(amenities, [])` in the filter, so a stay without amenities isn't dropped when none are asked for.
  - An empty sentence (Search opened bare) sends no `search_completed`.
- **PostHog:** checked with MCP SQL. Flow 1 sent `search_completed` with 3 results, `has_results: true`, kinds amenity/maxPrice/pets/type/vibe and `source: home`. The igloo query sent 0 results, `has_results: false`, `source: search`. A deep link sent `source: link`. Chip toggles and sorts sent none.
- **Known differences from search.png:** the back button and field are 56 high (design ≈52) and the heart is 48 (design ≈44). The existing `IconButton` sizes were kept rather than adding new ones. The tab bar stays native. The design's count ("124 stays") is placeholder data; the live dataset has 30 stays.
- **Data notes:** "beach house in Malibu" finds nothing, because the Malibu stay is a villa. "Test Modern Cabin with Hot Tub" is the Studio edit noted in plan 09; the next `npm run seed` resets it.
- **Test user:** `roam-search+clerk_test@example.com` was created in the Clerk dev instance for the web check.
- **Follow-up, sentences with no recognized filter:** "igloo on mars" used to return all 30 stays with no explanation, and counted as `has_results: true`. Search now shows "We couldn't pick out a type, price, place or amenity, so here are all stays." under the results bar, and the event carries `understood: false` (true when anything was recognized). Checked on web and in PostHog.
