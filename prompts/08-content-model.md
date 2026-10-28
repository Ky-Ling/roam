# 08 · Content model and seed

Status: done

## Goal
Roam's stays, hosts and policies live in Sanity (project `vjn3nb8q`, dataset `roam-dataset`) under a schema built from the search results and stay details screens. The schema is deployed, and a re-runnable seed fills the dataset with 30 realistic stays. The app keeps reading `src/data/stays.ts` until a later plan wires search to GROQ.

## Decisions
- **Answers to this round's questions:**
  - Photos are Sanity image assets, uploaded from Unsplash.
  - Pricing is nightly price + cleaning fee + minimum nights.
  - Policies are shared documents, and house rules are embedded on each stay.
  - The schema is deployed with the Studio CLI, and seeding is a script. The Sanity MCP is used to check every result.
- **Why the CLI and not MCP `deploy_schema`:** the repo has a local Studio (`studio/sanity.config.ts`). For that case the MCP's `deploy_schema` refuses and tells you to use `npx sanity schema deploy`. An MCP-managed schema would also drift from the Studio code. `run_sanity_cli` has no filesystem access, so it can't deploy local files either.
- **What the screens need:**
  - Search card (`ListingCard`): title, `location.city` + `location.region`, rating, reviewCount, the first two amenities, pricePerNight, and the first photo.
  - Details (`assets/prompt-imgs/property-details.png`):
    - The photo gallery with a count ("1 / 24").
    - Title, place, rating pill.
    - Four highlights: the first amenities in editor order, plus Pet Friendly when `petsAllowed`.
    - The "Ask about policies" entry.
    - The cancellation card: title from the policy plus its `summary`, e.g. "Full refund up to 7 days before check-in."
    - Host row: name, photo, Superhost.
    - "$289 / night · $867 total". Code computes the total from nights × price + cleaning fee, never stores it.
- **Typed fields for everything guests filter on.** That's stayType, pricePerNight, maxGuests, bedrooms, petsAllowed, amenities, location.city / region / regionName, and the cancellation policy's `fullRefundDaysBefore`. They become GROQ filters with params.
- **Soft intent lives in text on the property document:** `summary` and `description`, written so words like quiet, secluded, cozy and walkable appear naturally. The local `vibes` array is **not** carried into the schema: per CLAUDE.md, embeddings handle soft intent, and they only see the document itself. Location strings sit on the property (an embedded object, not a reference) for the same reason.
- **IDs:** Sanity generates every `_id`. Each document type has a required, unique `slug`, which is the seed's lookup key and the app's stable handle.
- **Document types (3):**
  - `property`, groups Basics / Location / Pricing & capacity / Amenities / Photos / Host & policies:
    - `title` string, required, max 60.
    - `slug` (from title), required.
    - `stayType` string list `cabin | beach | city | villa` (radio). Matches the home chips and the `StayType` keys.
    - `summary` string, required, max 160. One descriptive line.
    - `description` text, required, 3–6 rows, 2–3 short paragraphs of descriptive copy.
    - `location` object: `city` (required), `region` (2-letter code, required, regex `^[A-Z]{2}$`), `regionName` (required), `neighborhood` (optional), `coordinates` geopoint (optional; seeded with approximate points for a later map).
    - `pricePerNight` number, required, integer ≥ 1, USD.
    - `cleaningFee` number, integer ≥ 0, default 0.
    - `minNights` number, integer ≥ 1, default 1.
    - `maxGuests`, `bedrooms`, `beds`: integers ≥ 1. `bathrooms` ≥ 0.5 in 0.5 steps.
    - `petsAllowed` boolean, required, default false.
    - `amenities`: array of strings from a fixed list (grid layout, unique). The keys are `hotTub, pool, fireplace, wifi, oceanView, forestView, mountainView, lakeView, beachAccess, kitchen, workspace, freeParking, airConditioning, washer, evCharger, bbqGrill`. The first five keep the app's current keys. The order is editorial, because details shows the first few.
    - `rating` number 0–5 (1 decimal) and `reviewCount` integer ≥ 0. These are stored aggregates until reviews exist, with a description saying so.
    - `photos`: array of `image` (hotspot on, required `alt` string). Min 1, max 24. The first photo is the cover.
    - `host`: reference → `host`, required.
    - `cancellationPolicy`: reference → `policy`, required, with the picker filtered to `category == "cancellation"`.
    - `policies`: array of references → `policy`, filtered to non-cancellation and non-Roam-wide policies. These are the stay-specific ones, such as pets or hot tub safety.
    - `houseRules` object:
      - `checkInFrom` and `checkOutBy` strings, `HH:mm` regex, e.g. "15:00" / "11:00".
      - `quietHours` string, optional, e.g. "10pm–8am".
      - `rules`: array of strings, the exact text quoted in policy answers, e.g. "No parties or events."
    - Preview: title, "City, RG · $price", first photo.
  - `host`:
    - `name` (first name only, as in "Hosted by Alex") and `slug`.
    - `photo` image with hotspot + alt.
    - `isSuperhost` boolean.
    - `bio` text.
    - `joinedYear` integer.
    - `responseTime` list: `withinAnHour | withinAFewHours | withinADay`.
    - `languages` array of strings.
    - Preview: name, Superhost, photo.
  - `policy`:
    - `title`, e.g. "Free cancellation", "Pet stays", "Payment and charges".
    - `slug`.
    - `category` list: `cancellation | pets | checkIn | payment | damage | safety | community`.
    - `appliesToAllStays` boolean. Roam-wide policies are never referenced, and queries add them for every stay.
    - `summary` string, max 120. The one line shown on cards.
    - `body` text, the exact policy wording answers quote. This is plain text with blank-line paragraphs, so no Portable Text renderer is needed in the app.
    - `fullRefundDaysBefore` integer ≥ 0, shown and required only when the category is `cancellation`.
- **Studio:**
  - Each type gets an icon from `@sanity/icons` subpaths (HomeIcon, UserIcon, DocumentTextIcon). `@sanity/icons` already ships with `sanity` 6.20 (`^5.2.3`). It's added to `studio/package.json` at that installed version so the import is declared. No new package is downloaded.
  - Default structure. No custom desk structure.
- **Seed** (`studio/seed/`):
  - Files: `data/policies.ts`, `data/hosts.ts`, `data/stays.ts`, and `seed.ts`.
  - Run with `npm run seed` in `studio/`, which is `sanity exec seed/seed.ts --with-user-token` and uses `getCliClient()` from `sanity/cli`. That's the developer's own login, so there's no write token to store. `npm run seed -- --dry-run` prints creates and updates without writing.
  - Order: policies → hosts → stays. References are resolved by looking up the referenced doc's `_id` by slug.
  - Upsert by `slug.current`: if found, `patch(id).set(fields)`; otherwise `create`. Reruns update in place and never duplicate. Arrays are replaced whole, with `_key`s derived from content (asset id / slug / index), so reruns don't churn keys.
  - Images: each URL is fetched and uploaded with `client.assets.upload`. Sanity dedupes assets by content hash, so reruns reuse the same asset, and an in-run map avoids re-fetching. Up to 4 uploads run at once. A URL that doesn't return 200 fails the run with the stay's slug before anything is written for that stay.
  - The seed never deletes. Stays removed from the seed file stay in the dataset (CLAUDE.md: ask before deleting data). If a `drafts.` copy exists, the seed logs a warning and leaves it alone.
- **Seed content:**
  - Policies (11):
    - Cancellation: Flexible (1 day), Moderate (7 days, titled "Free cancellation" with summary "Full refund up to 7 days before check-in." to match the design), Firm (14 days), Strict (30 days, 50% after).
    - Stay-specific: Pet stays, Hot tub and pool safety, Long stays (28+ nights).
    - Roam-wide: Payment and charges, Damage and incidentals, Extenuating circumstances, Community standards.
  - Hosts (10), first names only, with Unsplash portraits: Alex (Superhost, hosts the Modern Cabin), Maya, Jordan, Priya, Sam, Elena, Marcus, Hana, Diego, Noor. Most host 2–4 stays.
  - Stays (30). All 16 in `src/data/stays.ts` keep the same title, place, type, rating, reviewCount, price, guests, pets and amenities. The four in search.png match exactly. They're enriched with views and other amenities (for example, the Modern Cabin gets `forestView`, as in the design), bedrooms, fees, house rules and copy. 14 new stays:
    - **California (8):**
      - Treehouse above Deer Creek (cabin, Nevada City, $210).
      - Ski Chalet near the Gondola (cabin, Truckee, $425).
      - Surf Shack by the Pier (beach, Cayucos, $189).
      - Bluff-top Cottage with Whale Views (beach, Mendocino, $274).
      - Victorian Flat on Alamo Square (city, San Francisco, $258).
      - Arts District Loft (city, Los Angeles, $199).
      - Stargazer Cabin (cabin, Joshua Tree, $185).
      - Vineyard Villa with Pool (villa, Napa, $610).
    - **Elsewhere (6):**
      - Cannon Beach Shingle House (beach, OR, $335).
      - Hood River Barn Loft (cabin, OR, $205).
      - Pike Place Pied-à-Terre (city, Seattle WA, $232).
      - San Juan Island Cabin (cabin, Friday Harbor WA, $295).
      - Red Rock Casita (villa, Sedona AZ, $348).
      - Breckenridge Log Lodge (cabin, CO, $389).
  - The mix is 12 cabins, 7 beach, 6 city, 5 villas. About two-thirds allow pets, and prices run $164–$610, so "under $300", "pet friendly" and place queries all return several stays.
  - Photos: 5–8 per stay. The cover is the stay's own photo (the existing 16 reuse their current Unsplash IDs). The rest are type-appropriate exteriors and interiors from a pool of Unsplash IDs that a script checks return 200 before they go into the data file.
- **Studio deploy:** `studioHost: "roam-stays"` in `sanity.cli.ts` (or the first free variant), then `npx sanity deploy`. CLAUDE.md requires a deployed Studio for Sanity Context, and the policy Q&A plan depends on it.
- **Dataset privacy:** `roam-dataset` is public-read. Everything here is public listing content, and hosts are fictional. Private user data such as saved stays and bookings never goes in this dataset.

## Out of scope
- App changes: GROQ queries, TypeGen, swapping `src/data/stays.ts`, extending `AMENITY_META` and the icons for the new amenity keys.
- The stay details screen itself.
- Turning on Dataset Embeddings and the `score()` ranking.
- The Sanity Context endpoint for policies.
- Agent Actions copy generation (the seed copy is hand-written).
- Reviews, availability and calendars, bookings, host accounts.
- Deleting the unused `production` dataset.

## Steps
### 1. Schema
Create `studio/schemaTypes/{property,host,policy}.ts` and `house-rules.ts` / `location.ts` objects, plus the `AMENITIES`, `STAY_TYPES` and `POLICY_CATEGORIES` lists in `studio/schemaTypes/constants.ts`. Register them in `schemaTypes/index.ts`. Use `defineType` / `defineField` / `defineArrayMember`, validations, groups and previews exactly as decided. Add `@sanity/icons` to `studio/package.json`. Done when `npx sanity build` succeeds and `npx eslint .` and `npx tsc --noEmit` in `studio/` are clean. `npx sanity dev` should show all three types with the expected fields.

### 2. Deploy schema and Studio
In `studio/`, set `studioHost` and run `npx sanity schema deploy` then `npx sanity deploy`. Done when MCP `list_workspace_schemas` shows the Studio-deployed schema, `get_schema` for `property` lists every field, and `get_project_studios` lists the hosted Studio.

### 3. Seed data
Write `studio/seed/data/*.ts` with the 11 policies, 10 hosts and 30 stays as decided. A scratch script HEAD-checks every Unsplash URL first, and only 200s go into the file. Done when the data type-checks against local `SeedStay` / `SeedHost` / `SeedPolicy` types.

### 4. Seed script
Write `studio/seed/seed.ts` (upsert by slug, reference lookup, image upload with dedupe and concurrency 4, `--dry-run`) and add the `seed` npm script. Run `--dry-run`, then the real seed, then the real seed a second time.

## Verification
- `studio/`: `npx eslint .`, `npx tsc --noEmit` and `npx sanity build` are clean. Root `npx expo lint` and `npx tsc --noEmit` are still clean.
- MCP `get_schema`: `property`, `host` and `policy` are deployed with the decided fields.
- MCP GROQ after the first seed:
  - `count(*[_type=="property"])` = 30, `host` = 10, `policy` = 11.
  - No property is missing `host`, `cancellationPolicy` or `photos[0]`.
  - `count(*[_type=="sanity.imageAsset"])` is noted.
- Idempotency: after the second seed, every count above is identical, including the asset count. `_id`s are unchanged, compared before and after.
- MCP `documents_validate` (or `npx sanity documents validate`) reports no errors.
- Realistic queries via MCP GROQ, with values passed as params:
  - `stayType == $type && petsAllowed && $amenity in amenities && pricePerNight <= $max` with cabin / hotTub / 300 returns the Lake Arrowhead and Idyllwild cabins (plus any new matches).
  - `location.city == $city` with Malibu returns the Oceanview Villa.
  - `location.regionName == $region` with Oregon returns the 2 Oregon stays.
  - The details projection `{title, location, rating, reviewCount, amenities[0...4], petsAllowed, pricePerNight, cleaningFee, minNights, "photos": photos[]{alt, "url": asset->url}, host->{name, isSuperhost, "photo": photo.asset->url}, cancellationPolicy->{title, summary, fullRefundDaysBefore}, "policies": [...policies[]->, ...*[_type=="policy" && appliesToAllStays]]{title, body}, houseRules}` for `modern-cabin-with-hot-tub` returns everything the details design shows.
- The deployed Studio opens, and editing a stay shows the filtered policy pickers.

## AGENTS.md updates
- **Who owns what → Content:** add "Schema lives in `studio/schemaTypes` (`property`, `host`, `policy`), deployed with `npx sanity schema deploy` from `studio/`, not MCP `deploy_schema`, because the MCP refuses it when a local Studio exists. `npm run seed` in `studio/` upserts the 30 seed stays by slug, so it's safe to rerun and never deletes." Replace "Schema deploys … go through the Sanity MCP" with: the MCP is for checks, queries and content edits.
- **Rules:** add "Every document type has a unique `slug`, which is the stable handle for seeds and the app. Property location is embedded, not referenced, so embeddings see it. Roam-wide policies (`appliesToAllStays`) are never referenced; queries add them for every stay. Totals are computed from nights × `pricePerNight` + `cleaningFee`, never stored."
- **Exact constraints:** note that the local `vibes` field has no schema counterpart, because soft intent comes from `summary`/`description` once embeddings are on.

## Result
Built as planned. Schema and hosted Studio are deployed (Studio host `roam-vjn3nb8q`, since `roam-stays` and `roam-stays-studio` were taken). The seed wrote 11 policies, 10 hosts, 30 stays and 73 image assets. A second run created nothing, reused all 73 assets and kept all 51 `_id`s. `sanity documents validate` passes for 51/51 documents.
- **Differences from the plan:**
  - The mix is 10 cabins, 7 beach, 6 city and 7 villas, 18 of them pet-friendly. It changed because covers were picked from photos that were actually checked by eye.
  - Some new titles changed to match their photos: "Hidden Log Cabin…" was dropped, Joshua Tree became "Desert Stargazer Cabin", "Surf Cottage by the Pier", "Hood River Red Barn", "San Juan Island Farmhouse" (beach), and "Modern Oak House in Ojai" (villa) was added.
  - No extra photo is another stay's cover, so no house appears under two stays.
- **Found during verification:** "Extenuating circumstances" is a Roam-wide policy in the cancellation category. So `fullRefundDaysBefore` is required only for per-stay cancellation policies, and the stay's cancellation picker excludes Roam-wide ones.
- **Seed hardening:** the first real run hit a transient `fetch failed`. Downloads and uploads now retry 4× with backoff. The rerun recovered cleanly, updating the 14 docs already written.
- **Pre-existing:** `npx tsc --noEmit` in `studio/` reports one error inside `node_modules/eventsource` (TS5097). It was already there on master and isn't from this change.
- **Unsplash sizing:** photos are stored at 1600px wide in their original aspect ratio (many are portrait). Crops come from the image URL builder plus hotspot when the app is wired.
