# 11 · Property details

Status: done

## Goal
Tapping a stay on Home or Search opens a details screen that looks exactly like `assets/prompt-imgs/property-details.png`, filled with live published Sanity data: photos, title, place, rating, highlights, the stay's cancellation policy, host, nightly price and a minimum-stay total. "Ask about policies" opens a sheet with the stay's house rules and every policy that applies to it, word for word. "Book this stay" says booking is coming soon. Opening a stay sends one PostHog event.

## Decisions
- **Answers to this round's questions:**
  - Total: `minNights × pricePerNight + cleaningFee`, labeled "$800 total · 2 nights" ("1 night" when singular). Computed in code, never stored.
  - House rules and full policy text live on a **policies sheet**, not on the details screen. The details screen matches the design and shows no rules inline.
    - "Ask about policies" opens the full sheet.
    - The cancellation card opens the same sheet showing only the cancellation section.
    - Asking free-text questions (Jev + Context) is a later plan. The card's subtitle stays as designed.
  - Book this stay: native `Alert.alert("Booking is coming soon", "You'll be able to book stays in Roam soon.")`. On web, where react-native-web's `Alert` does nothing, an info-style inline message shows above the bottom bar for 3 s instead.
- **Route:** `src/app/stay/[slug]/index.tsx` (details) and `src/app/stay/[slug]/policies.tsx` (sheet, `?section=cancellation` optional). They're registered in `AppNavigator` inside the signed-in `Stack.Protected`, so they push over the tabs and the tab bar is hidden, as in the design. Details: `headerShown: false`. Policies: `presentation: "formSheet"` with detents, checked against the expo-router v57 docs at build time (falling back to `modal` if form sheets misbehave on web).
- **Entry points:** Search's `ResultCard` row and Home's `FeaturedStayCard` become tappable and push `/stay/<slug>` with `src: "search"` or `src: "home"`. A deep link (`roam://stay/<slug>`) has no `src` and reports `link`. The heart on Search stays a sibling of the row's Pressable.
- **Query (checked against the live dataset with MCP):** `src/lib/sanity/stay.ts` exports `STAY_QUERY`, a `StayDetails` type and `fetchStay(slug)`. Values go as params only:
  ```
  *[_type == "property" && slug.current == $slug][0]{
    "id": slug.current, title, "city": location.city, "region": location.region,
    rating, reviewCount, pricePerNight, cleaningFee, minNights, petsAllowed, amenities,
    "photos": photos[]{alt, hotspot, "url": asset->url},
    houseRules{checkInFrom, checkOutBy, quietHours, rules},
    host->{name, isSuperhost, responseTime, "photo": photo{alt, hotspot, "url": asset->url}},
    cancellationPolicy->{title, summary, body, fullRefundDaysBefore},
    "policies": policies[]->{title, category, summary, body},
    "roamPolicies": *[_type == "policy" && appliesToAllStays == true] | order(title asc){title, category, summary, body}
  }
  ```
  - Roam-wide policies are added by the query, never referenced, per CLAUDE.md.
  - `fetchStay` caches one promise per slug for the session and drops it on failure, like `fetchPlaces`. The sheet opens instantly from the cache, with no second request.
- **Data hook:** `src/screens/stay/use-stay-details.ts` returns `{ stay, status: "loading" | "error" | "missing" | "ready", retry }`. It aborts the request it replaces and ignores a stale failure, following `use-featured-stays.ts`. `missing` means the query returned null (unpublished or bad slug).
- **Highlights row (4 max):** the stay's `amenities` in their editorial order (the schema says details shows the first few), with "Pet Friendly" inserted second when `petsAllowed`. Labels and icons come from `AMENITY_META`. That matches the design's Hot Tub, Pet Friendly, Wi-Fi, Forest View. The design's "Fast Wi-Fi" and "Forest Views" are placeholder copy; the app keeps the existing labels ("Wifi", "Forest View").
- **Cancellation card:** the stay's own policy `title` and `summary` (e.g. "Free cancellation" / "Full refund up to 7 days before check-in."). Other stays show "Flexible", "Firm" or "Strict cancellation" with their own summaries.
- **Host row:** host photo (hotspot crop), "Hosted by {name}". The second line is "Superhost" with a medal icon when `isSuperhost`. Otherwise it's "Responds within a day" (from `responseTime`, using the schema's option titles) with no icon. The row isn't tappable (no host screen yet); the chevron is kept to match the design and noted.
- **Gallery:** horizontal paging list of all `photos` (4–6 in the data, max 24) with a "1 / N" counter that follows the swipe. Photos are requested at 3× the on-screen size through `sanityImageUrl`.
- **Top controls:** back (pops, or goes to `/home` when there's no history), share (React Native `Share.share` with "{title} in {city}, {region} on Roam", no URL since there's no public web app), heart (local state, the existing `stay_saved`/`stay_unsaved` events). All three are siblings over the gallery, not children of a Pressable.
- **Policies sheet content, in order** (all text word for word from Sanity, each section with a source caption):
  1. Check-in and check-out: "Check-in from 3:00 PM", "Check-out by 11:00 AM" (24-hour times formatted to 12-hour in code), "Quiet hours 10pm–8am" when set. Source: "This stay's house rules".
  2. House rules: `rules[]` as a bulleted list. Source: same.
  3. Cancellation: policy title + `body` paragraphs (split on blank lines). Source: "This stay's cancellation policy".
  4. This stay's policies: each `policies[]` title + body. Omitted when empty.
  5. Roam policies: each Roam-wide title + body. Source: "Applies to every Roam stay".
  - Footer: "Can't find what you're looking for? Contact Roam support." (text only, no link yet).
  - `?section=cancellation` shows only section 3.
- **PostHog:**
  - `stay_viewed` `{ stay_id, source }` once per screen mount, when the stay first loads. `stay_id` is the slug (listing data). `source` is `home`, `search` or `link`. No event when the load fails or the stay is missing.
  - `stay_book_tapped` `{ stay_id }` (demand for booking).
  - `stay_policies_opened` `{ stay_id, section: "all" | "cancellation" }`.
  - `stay_shared` `{ stay_id }` when the share sheet opens.
  - No typed text or personal data in any event.
- **States** (no design for them, built from existing primitives):
  - Loading: muted photo block at the gallery's size, then muted bars for title, location and highlights. The bottom bar is hidden. The back button shows.
  - Error: `StatusBanner` "Couldn't load this stay." with a secondary "Try again" button.
  - Missing: "This stay isn't available anymore." with a "Back to home" button.
- **Design measurements** (estimated from property-details.png at about 1.70 px/pt, 393 pt wide, 20 pt side gutters):
  - Gallery: full width, `h-86` (344). The content panel overlaps it by 24 with `rounded-t-2xl` on a white surface.
  - Controls: `IconButton variant="surface" size="lg"` (56) for back, share and heart. 16 from the safe-area top and 20 from the sides; share and heart sit 8 apart.
  - Counter: pill `h-9 px-3.5 rounded-full bg-scrim`, `type-body-medium` white, 16 from the panel edge and 20 from the right.
  - Header: title `type-heading`, 2 lines, flex-1 beside the rating box with a 12 gap.
    - Rating box: `rounded-lg bg-surface-muted px-4 py-2.5 corner-squircle`, centered. Filled star 22 + rating `type-title`, then `(342)` `type-body` tertiary.
    - Location: pin 20 filled ink, then `type-body`. It sits 8 below the title.
  - Highlights: 20 below location, 4 equal columns, icon 28 ink stroke 1.75, label `type-caption` ink 8 below it. A hairline `border-border` 20 below.
  - Cards: 16 below the divider, 12 apart, existing `PolicyCard`. The cancellation card's icon has no lavender box in the design, so `PolicyCard` gets `iconBox?: boolean` (default true).
  - Host row: hairline above, 16 vertical padding. Avatar `size-15` (60) round with a 2 white ring + `shadow-raised`. "Hosted by Alex" `type-title`, "Superhost" `type-caption` tertiary with medal 18 in `colors.lavenderStrong`. Chevron 24.
  - Bottom bar: white, hairline top, `px-5 pt-4` plus safe-area bottom. Left: "$289" `type-heading` + " / night" `type-body`, then "$800 total · 2 nights" `type-body` tertiary. Right: primary button, flex-1, max 216 wide.
  - The button is 64 high, so **proposed new `Button size="lg"`** = `h-16 px-8`, with label `type-title`.
  - New icon: `superhost: Award` (lucide, present in the installed version).
- **Motion:** the content panel fades in when data lands (`DURATION.enter`, `EASE_OUT`). No movement under reduced motion. The gallery has no entering animation. Buttons use the platform press opacity like the rest of the app.

## Out of scope
- Booking, dates and guest picking. The total uses the minimum stay only.
- Asking policy questions (Jev, the Context endpoint, the API route).
- A host profile screen, a full-screen photo viewer, a map, the description and the reviews list.
- Persisting hearts, and a public share URL.
- Schema changes. None are needed.

## Steps
### 1. Query and fetch
- Add `src/lib/sanity/stay.ts` with `STAY_QUERY`, the `StayDetails` type and a cached `fetchStay(slug)`, and export them from `index.ts`.
- Done when `npx tsc --noEmit` passes, and the query run through MCP for `lakeside-boathouse` returns the stay, its host, its cancellation policy, one stay policy and four Roam-wide policies.

### 2. Primitives
- Add `Button size="lg"`, `PolicyCard iconBox`, and the `superhost` icon.
- Show them on `/design-system`.
- Lint and type check are clean.

### 3. Details screen
- Route `src/app/stay/[slug]/index.tsx`, registered in `AppNavigator`.
- `src/screens/stay/`:
  - `index.tsx` and `use-stay.ts` (orchestrator: params, data, saved, share, book, the `stay_viewed` event, navigation).
  - `use-stay-details.ts`.
  - `utils.ts`: `toHighlights`, `totalLabel`, `hostSubtitle`, `formatTime`.
  - `components/`: `photo-gallery.tsx`, `gallery-controls.tsx`, `photo-counter.tsx`, `stay-header.tsx`, `rating-box.tsx`, `highlights-row.tsx`, `host-row.tsx`, `booking-bar.tsx`, `coming-soon-note.tsx` (web), `stay-placeholder.tsx`, `stay-status.tsx` (error and missing).
- Make Search rows and Home featured cards push the route with `src`.
- Done when a stay opens from both, lint and type check are clean.

### 4. Policies sheet
- Route `src/app/stay/[slug]/policies.tsx` (form sheet).
- `src/screens/stay-policies/`: `index.tsx`, `use-stay-policies.ts`, `components/policy-section.tsx`, `components/rule-list.tsx`, using the same `use-stay-details` data hook (imported from `src/screens/stay/`, or moved to `src/hooks/` if two screens sharing it reads better).
- Wire both cards on the details screen, with `stay_policies_opened`.

### 5. Design check
Open `roam://stay/lakeside-boathouse` in the iOS simulator. If no simulator is available, use web at iPhone 15 size (393×852), as in plans 07–10. Screenshot it, compare it with property-details.png, list every difference, fix, and repeat. Then screenshot the policies sheet.

## Verification
- `npx expo lint` and `npx tsc --noEmit` are clean.
- Flows:
  1. Home → tap a featured stay. Details open with its photos, title, place, rating, highlights, cancellation card, host and price. The total equals minNights × price + cleaning fee (Lakeside Boathouse: 2 × 345 + 110 = $800 · 2 nights).
  2. Search "pet friendly cabin" → tap a row. "Pet Friendly" is the second highlight.
  3. Swipe the gallery. The counter follows (1 / 5 → 2 / 5).
  4. Tap "Ask about policies". The sheet shows check-in/out, quiet hours, the house rules, cancellation, the stay's policies and the Roam-wide policies, matching the Studio text word for word.
  5. Tap the cancellation card. The sheet shows only the cancellation policy.
  6. Tap "Book this stay". iOS shows the alert; web shows the inline note.
  7. Share opens the share sheet. The heart toggles. Back returns to where the stay was opened from.
  8. `roam://stay/not-a-stay` shows the missing state. A blocked request shows the error banner, and Try again recovers.
  9. Edit a stay's house rule in the Studio and publish. Reopening the stay after an app reload shows it (the cache lasts a session).
- PostHog (MCP query on the dev session's events):
  - Flow 1 sends `stay_viewed` with `source: "home"`, flow 2 with `source: "search"`, a deep link with `source: "link"`, each once.
  - Flow 8 sends no `stay_viewed`.
  - `stay_book_tapped`, `stay_policies_opened` (both sections) and `stay_shared` arrive with the slug only.
- Screenshots are compared with property-details.png, and the differences are listed.

## AGENTS.md updates
- **Expo / routes:** `/stay/[slug]` (details) and `/stay/[slug]/policies` (form sheet, `?section=cancellation`) live in the signed-in guard and push over the tabs. Home and Search open stays with `src`.
- **Content / exact constraints:** details read `STAY_QUERY` through a per-slug session cache (`fetchStay`). Roam-wide policies come from the query. The total shown is the minimum stay (`minNights × pricePerNight + cleaningFee`) until dates exist.
- **Policy knowledge:** until the Q&A lands, the policies sheet lists house rules and every applicable policy word for word, each with its source.
- **Analytics:** `stay_viewed` (`stay_id`, `source`), `stay_book_tapped`, `stay_policies_opened` (`section`), `stay_shared`.
- **Design system:** `Button size="lg"` (h-16, `type-title` label), `PolicyCard iconBox`.

## Result
Built as planned. Lint and type check are clean. Checked on web at iPhone size (393×852) through Playwright, signed in as the dev test user `roam-details+clerk_test@example.com`, because this Mac has no Xcode/iOS Simulator. Not yet seen on iOS or Android, so the form sheet's detents and the native "coming soon" alert are untested on device.
- **Design check:** "Test Modern Cabin with Hot Tub" (the design's stay) renders with the same layout: gallery, 56pt controls, counter, title with rating box, highlights Hot Tub / Pet Friendly / Wifi / Forest View, both policy cards, host row and the booking bar.
- **Changes during the build:**
  - The total reads "$800 for 2 nights", not "$800 total · 2 nights". The longer label was cut off beside the 216pt button.
  - The counter pill is `bg-ink/85`, not `bg-scrim`. At 45% it disappeared over dark photos, and the design's pill is near-opaque.
  - The web "coming soon" note has `shadow-raised` so it reads over the cards.
  - `use-stay-details` lives in `src/hooks/`, because the details screen and the sheet both use it. It ignores a replaced request instead of aborting it, since the fetch is shared through the cache.
  - The pets tag moved to `PETS_META` in `src/constants/stays.ts` (used by Search's tags and the highlights).
- **Known differences from property-details.png:** the labels are the existing `AMENITY_META` ones ("Wifi", "Forest View"; the design has "Fast Wi-Fi", "Forest Views"). The cancellation summary wraps to two lines (the design fits it on one at a slightly smaller size). The host row's chevron isn't tappable. The design's "$867 total" and "1 / 24" are placeholder data: the stay has 6 photos and no cleaning fee, so its total is $578 for 2 nights.
- **PostHog (checked with MCP SQL):** `stay_viewed` arrived with `source` `home`, `search` and `link`, once per open. `stay_policies_opened` arrived with `all` and `cancellation`, and `stay_book_tapped` and `stay_shared` arrived with the slug only. The missing-stay link sent no `stay_viewed`.

### Follow-up: design audit
A review on the iPhone (Expo Go) found share and save in the wrong place, no photo counter, and no host row after the cancellation card. I couldn't screenshot the phone (no expo-mcp tunnel, and its JS runtime didn't answer the inspector), so the fixes avoid the classes native likely drops, and I re-measured the design:
- Controls use explicit `left`/`right` styles with `justify-between`, not `inset-x-5` + `ml-auto` (Tailwind v4 compiles those to `inset-inline` with `calc()`).
- The counter uses the new `scrim-strong` token instead of `bg-ink/85` (`color-mix()`, which native drops, leaving white text on a bright photo).
- The panel overlaps the photo by 12 with `rounded-t-md`, not 24 with `rounded-t-2xl`. Negative margins are inline styles.
- The title uses the new `type-heading-lg` (Jakarta Bold 30/31, -1). The paw highlight is solid. The Superhost medal uses the new `bronze` token (#9A7163, sampled from the design).
- `PolicyCard` is tighter (`py-3.5`). Its description uses the new `type-footnote` (12/17: the design's "Full refund up to 7 days before check-in." measures 226pt at 12px). It has a 20 chevron 8 from the text, so every stay's one-line summary fits (the longest needs 235pt; the column is 237).
- The gallery is 348 tall when there's room. On shorter screens it shrinks (down to 248) until the whole panel, host row included, shows above the booking bar, as in the design. The panel and bar are measured with `onLayout`.
- The bar's bottom padding is `clamp(insets.bottom - 12, 16, 40)`, so the button ends ~20 above the edge, as designed.
- Checked on web at 393×852 and 393×932: the host row shows above the bar at both sizes. Still not seen on the phone.
