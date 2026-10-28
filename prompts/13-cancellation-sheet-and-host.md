# 13 · Cancellation sheet and host sheet

Status: done

## Goal
The cancellation sheet reads as one policy instead of three stacked headings. It shows the policy's title, its summary in a callout, the refund tiers as a timeline, Roam's Extenuating circumstances below, and a source for each part, all word for word. Tapping "Hosted by …" on a stay opens a host sheet with the host's profile, bio and other stays. Tapping one of those stays opens it.

## Decisions
- **Answers to this round's questions:**
  - **Cancellation sheet:** policy first with tiers (layout below).
  - **Roam-wide cancellation policies** (today only Extenuating circumstances) show below the stay's policy, labeled "Applies to every Roam stay".
  - **Host row:** opens a host sheet with profile facts, bio and the host's other stays.
- **What was wrong with the cancellation sheet** (web screenshot, 393×852): the sheet title "Cancellation policy", the section title "Cancellation" and the policy title "Free cancellation" all stack. The first section's `border-t` draws a divider right under the header. The three refund tiers are flat secondary-gray paragraphs. And the summary from the details card ("Full refund up to 7 days before check-in.") is missing.
- **Cancellation sheet layout** (`?section=cancellation` only; the `all` view is unchanged):
  - Header: the policy's `title` (`type-heading`, e.g. "Free cancellation"), close button as today. If the stay has no cancellation policy, the title is "Cancellation policy" and the body says "This stay has no cancellation policy yet." plus the support line.
  - Callout: `bg-lavender-subtle rounded-xl corner-squircle px-4 py-3.5`, `document` icon 24 `colors.indigo`, `summary` in `type-body-medium`.
  - Timeline: one step per body paragraph (`toParagraphs`). Every cancellation policy in the dataset has three, one per refund tier, but any count works. Each step has a `size-3` `bg-indigo` dot on the left and a 2px `bg-lavender-muted` line joining it to the next dot (none after the last). Text is `type-body` ink, `gap-5` between steps.
  - Source label under the timeline: `document` 14 `colors.inkTertiary` + "Source: This stay's cancellation policy" `type-caption` tertiary. It's the chat's source row, moved to `src/components/policy/source-label/` and shared by both.
  - Then, for each Roam-wide `cancellation` policy: `border-t border-border pt-5`, title `type-title`, body paragraphs `type-body` secondary, and `SourceLabel` "Applies to every Roam stay".
  - Footer: the existing support line.
- **Host data:** `STAY_QUERY`'s host projection adds `bio`, `joinedYear`, `languages`, and the host's other published stays:
  ```
  host->{name, isSuperhost, responseTime, bio, joinedYear, languages,
    "photo": photo{alt, hotspot, "url": asset->url},
    "otherStays": *[_type == "property" && references(^._id) && slug.current != $slug] | order(title asc)[0...6]{
      "id": slug.current, title, "city": location.city, "region": location.region,
      pricePerNight, rating, reviewCount, "cover": photos[0]{alt, hotspot, "url": asset->url}
    }}
  ```
  - Checked with MCP: Lakeside Boathouse's host Marcus returns one other stay (Breckenridge Log Lodge). All 10 hosts have a photo, bio, joined year, languages and response time, and they host 2–4 stays each.
  - The sheet reads the same `useStayDetails` cache, so there's no new request.
  - `StayDetails.host` gets the new fields and a `HostStay` type.
- **Host route:** `src/app/stay/[slug]/host.tsx`, registered in `AppNavigator` with the same form-sheet options as the policies sheet (`formSheet`, detents `[0.75, 1]`, grabber, radius 28).
- **Host sheet layout** (no design, so it's built from the design system, top to bottom, `px-5`):
  - Close button top-right (`IconButton close md`), as on the policies sheet.
  - Avatar `size-24` round with the details row's white ring and `shadow-raised`, photo at 3× (288) via `sanityImageUrl`, centered. Name `type-heading` centered. Superhost row (medal 18 `colors.bronze` + "Superhost" `type-caption` tertiary) only when `isSuperhost`.
  - Facts, `gap-3`, each an icon 20 ink + `type-body`. A row is hidden when its field is empty:
    - `calendar` "Hosting since 2019"
    - `message` "Responds within a day" (the existing `RESPONSE_TIME_LABEL`, moved into the shared utils)
    - new `languages` icon (lucide `Languages`) "Speaks English, German"
  - "About Marcus": `type-title`, then `bio` word for word in `type-body` secondary. Hidden when there's no bio.
  - "Marcus's other stays": `type-title`, then one row per stay: cover `size-16 rounded-md corner-squircle` (192px at 3×), title `type-body-medium` semibold (1 line), "City, CA" `type-caption` tertiary, then a star 14 + rating `type-caption` and "$389 / night" `type-caption`. Each row is a `Pressable` with an accessibility label. Hidden when the host has no other stays.
  - States: the same loading, error (with Try again) and missing handling as the policies sheet. A stay with no host shows "Host details aren't available." (the row isn't tappable then anyway).
- **Opening another stay from the sheet:** dismiss the sheet, then push `/stay/<id>` with `src: "host"`. Verify the order on web at build time (a push from inside a form sheet can land under it on iOS). `stay_viewed.source` gains `host`.
- **Host row:** becomes a `Pressable` (`accessibilityRole="button"`, label "About your host, {name}"), `active:opacity-85`. Chevron unchanged.
- **PostHog:** `stay_host_opened` `{ stay_id }`. Opening another stay is covered by `stay_viewed` with `source: "host"`.
- **Shared code:** `RESPONSE_TIME_LABEL` moves from `screens/stay/utils.ts` to `src/constants/stays.ts` (used by details and the host sheet).

## Out of scope
- Messaging the host, a full host profile route, and reviews.
- Changing the `all` policies view.
- Schema changes. None are needed: every field already exists.

## Steps
### 1. Query
- Extend `STAY_QUERY` and the `StayDetails` types. Move `RESPONSE_TIME_LABEL`. Add the `languages` icon.
- Done when type check passes and the query through MCP returns the new host fields for `lakeside-boathouse`.

### 2. Cancellation sheet
- `src/components/policy/source-label/` (from the chat's `answer-entry.tsx`, which now uses it).
- `screens/stay-policies/`: the hook returns `title` from the policy and a `cancellation` view (`summary`, `steps`, `roam[]`) when `section === "cancellation"`. Utils build it.
- New components: `components/cancellation-view.tsx`, `components/refund-timeline.tsx`, `components/summary-callout.tsx`.
- Screenshot `?section=cancellation` for Free, Strict and Flexible stays.

### 3. Host sheet
- Route + navigator entry.
- `src/screens/stay-host/`: `index.tsx`, `use-stay-host.ts` (data, close, open stay, events), `utils.ts` (`toHostView`), and `components/` with `host-profile.tsx`, `host-facts.tsx`, `host-stay-row.tsx`, `host-status.tsx`.
- Make `HostRow` a Pressable wired through `use-stay.ts` (`openHost`, `stay_host_opened`).

### 4. Look check
Web at 393×852 (no simulator on this Mac): the cancellation sheet for three policies, the host sheet for a Superhost and a non-Superhost, and tapping another stay. Fix and repeat.

## Verification
- `npx expo lint` and `npx tsc --noEmit` are clean.
- Flows:
  1. Details → cancellation card. The title is the policy's (e.g. "Free cancellation"), then the summary callout, three timeline steps, the source, then Extenuating circumstances with "Applies to every Roam stay", all matching Studio word for word. There's no "Cancellation" heading and no divider under the header.
  2. "See all policies" from the chat still shows every section as before.
  3. Details → host row opens the host sheet: photo, name, Superhost (if any), hosting since, response time, languages, bio, other stays.
  4. Tap another stay. The sheet closes and that stay's details open. Back returns to the first stay.
  5. A host with no other stays (if any) hides that section.
- PostHog (MCP SQL): `stay_host_opened` with the slug, and `stay_viewed` with `source: "host"`.

## AGENTS.md updates
- **Expo / routes:** `/stay/[slug]/host` (form sheet, opened by the host row). Stays opened from it carry `src=host`.
- **Content:** `STAY_QUERY`'s host includes `bio`, `joinedYear`, `languages`, `otherStays` (6 max).
- **Policy knowledge:** the cancellation sheet shows the policy title, summary callout, refund timeline (one step per body paragraph) and Roam-wide cancellation policies, each with a `SourceLabel`.
- **Analytics:** `stay_host_opened`, and `stay_viewed.source` gains `host`.
- **Design system:** `languages` icon. `SourceLabel` lives in `components/policy/`.

## Result
Built as planned. Lint and type check are clean. Checked on web at 393×852 through Playwright (no simulator on this Mac). Not yet seen on iOS or Android, so the host sheet's detents and the replace-from-sheet navigation are untested on device.
- **Cancellation sheet:** Free (Lakeside Boathouse), Strict (Vineyard Villa) and Flexible (Forest Cabin) show the policy title, summary callout, three timeline steps, the source, then Extenuating circumstances with its own source. There are no duplicate headings and no divider under the header. The `all` view is unchanged.
- **Host sheet:** Alex (Superhost, 3 other stays) and Marcus (no medal, 1 other stay) show photo, name, facts, bio and stays. Tapping Breckenridge Log Lodge opened `/stay/breckenridge-log-lodge?src=host`, and Back returned to Lakeside Boathouse.
- **Changes during the build:**
  - Opening a stay from the sheet uses `router.replace` (it pops the sheet and pushes the stay in one step) instead of dismiss-then-push.
  - `toSections` lost its `section` parameter: the cancellation view has its own `toCancellationView`.
  - The support line now also shows under the cancellation sheet.
- **PostHog (MCP SQL):** `stay_host_opened` arrived with the slug for both hosts, and `stay_viewed` arrived with `source: "host"`.
- **No design:** the host sheet and the timeline use the design system only.

### Follow-up: overlap on iPhone
On the iPhone, the scrolling content in both sheets drew over the fixed header: the summary covered the title, "Check-in and check-out" overlapped "House rules and policies", and the grabber sat on the host's photo. iOS gives a form sheet's scroll view the whole sheet, so anything beside it gets covered. The fix makes the `ScrollView` the sheet's only content. The policies title is now a sticky header inside it (`stickyHeaderIndices={[0]}`, `pt-7` to clear the grabber). The host sheet's content starts at `pt-8`, with the close button floating top-right through explicit `top`/`right` styles. Both sheets pad the bottom by the safe area + 24. Checked on web. Not yet re-checked on the iPhone.
- **Second follow-up:** after that fix, the host sheet showed no content on the iPhone. Its `ScrollView` was still wrapped in a `View` with a floating close button beside it, and it mixed `contentContainerClassName` with `contentContainerStyle`. It now has the policies sheet's shape: a root `ScrollView` with a sticky close bar and the padding on an inner `View`. Checked on web. Not yet re-checked on the iPhone.
