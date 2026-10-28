# 09 · Stay copy, embeddings, live Home

Status: done

## Goal
Every stay's `summary` and `description` is rewritten by Sanity Agent Actions using only that stay's own fields. A two-layer check rejects any copy that claims something the fields don't support. Dataset Embeddings are turned on for properties, so soft queries like "quiet secluded cabin" rank by meaning. Home's category chips and featured cards read live stays from Sanity instead of `src/data/stays.ts`.

## Decisions
- **Answers to this round's questions:**
  - Atmosphere comes from a new `vibes` field on `property`. Copy may use a soft word only if the stay has that vibe.
  - Copy that passes the check goes to **drafts**. You review it in the Studio, and it's published only after you approve.
  - Only Home goes live. Search keeps `src/data/stays.ts` and code ranking until the next plan wires GROQ filters and `text::semanticSimilarity()` through an API route.
  - The app reads Sanity with plain `fetch` (no new dependencies).
- **Why the current copy can't be the source:** the hand-written seed copy already states details no field backs, such as "ten minutes from the village", "a fenced patch of forest" and "five-minute drive down the canyon". Generated copy treats only fields as facts.
- **Schema change (content exists, approved in this round):** `property.vibes` is an array of strings from a fixed list `quiet | cozy | secluded | romantic | lively | modern | family`. It uses the same keys as the local `Vibe` type, a grid layout, unique values, min 1 and max 4, in the Basics group. `VIBES` lives in `studio/schemaTypes/constants.ts`. The field description reads: "How the stay feels. The only source for atmosphere words in generated copy." Deploy with `npx sanity schema deploy`, then `npx sanity deploy` (CLAUDE.md requires a redeploy after schema changes).
- **Seed changes (`studio/seed`):**
  - `SeedStay` gains `vibes`. The 16 stays from `src/data/stays.ts` copy their local `vibes` (capped at 4). The 14 new stays get vibes assigned by hand from their photos and setting, listed in the Result.
  - `summary` and `description` are set **only when a stay is created**, so reruns never erase generated copy. Every other field still updates in place.
- **Facts given to the model** (per stay, built by a GROQ projection, passed as one JSON `constant` instruction param):
  - Included: `title`, `stayType`, `location.neighborhood` / `city` / `regionName`, `maxGuests`, `bedrooms`, `beds`, `bathrooms`, `minNights`, `petsAllowed`, amenities as labels (from `AMENITIES` titles, in editor order), `vibes`, and `houseRules` (`checkInFrom`, `checkOutBy`, `quietHours`, `rules`).
  - Left out: price, cleaning fee, rating, reviewCount, host and policies. Copy that names a price or rating goes stale, and Roam's policy text is quoted from its own documents, never paraphrased.
- **Generate** (`client.agent.action.generate`, API version `vX`, schema `_.schemas.default`):
  - Runs on the published document id with `noWrite: true`, `target: {include: ['summary', 'description']}` and `temperature: 0.3`.
  - The instruction tells the model to:
    - Use only `$facts`.
    - Name no distance, landmark, nearby business, view, appliance, room or feature that isn't in the facts.
    - Mention no price, rating, review, or superlative like "best" or "perfect".
    - Use atmosphere words only from `vibes`.
    - Write `summary` as one sentence of 160 characters or fewer, and `description` as 2–3 short plain-text paragraphs (60–110 words total) separated by blank lines.
    - Use US English with no emoji.
- **Check, layer 1 (code, deterministic, `studio/copy/checks.ts`):**
  - Lengths: summary ≤ 160 characters, description has 2–3 paragraphs and 60–110 words.
  - Before matching, the title and place strings are removed from the copy, so "Lake Arrowhead" doesn't count as a lake view.
  - Feature words are rejected when the stay lacks the key: hot tub/jacuzzi/spa, pool, fireplace/wood stove, ocean/sea view, lake view, beach, mountain view, forest view, workspace/desk, parking, EV/charger, washer/laundry, grill/BBQ, air conditioning/A/C, kitchen, Wi-Fi.
  - Pet words (dog, pet, cat, pup) are rejected when `!petsAllowed`.
  - Vibe words (quiet, peaceful, cozy, secluded, private, romantic, lively, buzzing, modern, family, kids) are rejected unless the stay has the matching vibe. "Quiet hours" is allowed when `houseRules.quietHours` is set.
  - Also rejected: `$`, star or rating words, distance and time phrases (minute, mile, km, block, "walk to", "drive"), and any number that isn't in the facts.
- **Check, layer 2 (Agent Actions Prompt, `format: 'json'`, `temperature: 0`):** the prompt gets `$facts` and `$copy` and returns json `{"unsupported": [{"claim", "reason"}]}`, listing every claim in the copy that the facts don't directly support. The copy passes only when the list is empty.
- **Retry:** if either layer fails, Generate runs once more with the failures passed as `$avoid`. If it fails again, the stay is skipped, nothing is written for it, and the report lists why.
- **Write:** for a stay that passes, `createOrReplace` its `drafts.<id>` from the published document with the new `summary` and `description`. If a draft already exists, the stay is skipped with a warning (same rule as the seed). Publishing happens after your review, through the Studio or MCP `publish_documents`.
- **Script:** `studio/copy/generate-copy.ts`, run as `npm run copy` (`sanity exec copy/generate-copy.ts --with-user-token --`). It uses your CLI login like the seed, so there's no write token to store.
  - Flags: `--slug <slug>` runs one stay, and `--dry-run` generates and checks but writes nothing.
  - It processes stays one at a time and prints a per-stay line (pass / fail layer / claims), then a summary.
  - The same prompt and check files are reused when new stays are added.
- **Embeddings:** turned on **after** the reviewed copy is published, so the first generation embeds the final text.
  - Command: `npx sanity datasets embeddings enable roam-dataset --projection='{ _type == "property" => { title, summary, description, vibes, "place": [location.neighborhood, location.city, location.regionName] } }' --wait`
  - Only properties are embedded. Hosts and policies would add noise, and policies go to the Context endpoint later.
  - Amenity keys stay out (camelCase keys embed poorly, and the description already names the amenities in words). Hard constraints stay GROQ filters.
- **App, Sanity access (`src/lib/sanity/`):**
  - `config.ts`: project id `vjn3nb8q`, dataset `roam-dataset`, API version `2026-10-01`. These are public identifiers for a public-read dataset, so they're constants with no env var.
  - `client.ts`: `sanityFetch<T>(query, params, signal)` sends a GET to `https://vjn3nb8q.apicdn.sanity.io/v2026-10-01/data/query/roam-dataset` with `query` and each param JSON-encoded as `$name`. It throws on non-200 or a GROQ `error`, and returns `result`. No token, ever.
  - `image.ts`: `sanityImageUrl(image, {width, height})` adds `w`, `h`, `fit=crop`, `auto=format`, and, when a hotspot exists, `crop=focalpoint&fp-x&fp-y` to the asset URL.
  - `queries.ts`: `FEATURED_STAYS_QUERY` and its `FeaturedStay` result type.
- **Featured query:** `*[_type == "property" && !(_id in path("drafts.**")) && ($type == "all" || stayType == $type)] | order(rating desc, reviewCount desc)[0...20]{"id": slug.current, title, stayType, "city": location.city, "region": location.region, rating, "photo": photos[0]{alt, hotspot, "url": asset->url}}`. The category is a GROQ filter passed as the `$type` param.
- **Home data flow:**
  - `src/screens/home/use-featured-stays.ts` fetches per category, keeps fetched categories in a `Map` so switching back is instant, and aborts stale requests. It returns `{ stays, status: "loading" | "error" | "ready", retry }`.
  - `useHome` calls it and passes the result through, so the screen still calls one orchestrator.
  - `FeaturedStayCard` takes a `FeaturedStay`. Its image is `sanityImageUrl(photo, {width: 1200, height: 960})`, and the accessibility label uses `photo.alt` context plus the title.
- **Home states** (no design exists for these; built from existing primitives and tokens, no new tokens):
  - Loading: 3 placeholder cards at the card's size (`h-70 rounded-2xl bg-surface-muted corner-squircle`), static, with no shimmer.
  - Error: `StatusBanner` "Couldn't load stays." with a secondary `Button` "Try again" that calls `retry`.
  - Empty: `Text variant="body" tone="secondary"` "No {category label} stays yet." The cards' existing enter, exit and layout animations are unchanged.
- **Data split until the next plan:** Home shows the 30 Sanity stays, while Search still searches the 16 local ones. This is expected and noted in `src/data/stays.ts`.

## Out of scope
- Search on GROQ and embeddings, and the authenticated API route for semantic queries.
- Property details screen. Featured cards stay non-tappable.
- Studio AI Assist field actions for editors.
- Embedding hosts or policies, and the Sanity Context endpoint.
- Removing `src/data/stays.ts` (Search still uses it).
- Offline caching and pull-to-refresh.

## Steps
### 1. `vibes` field and seed changes
Add `VIBES` to `studio/schemaTypes/constants.ts` and the `vibes` field to `property.ts` as decided. Add `vibes` to `SeedStay` and to all 30 stays in `seed/data/stays.ts`. Change `seed.ts` so `summary` and `description` are written only on create. In `studio/`, `npx eslint .` and `npx sanity build` must be clean. Deploy the schema and Studio, then run `npm run seed -- --dry-run` and `npm run seed`. Done when MCP GROQ `count(*[_type=="property" && count(vibes) > 0])` = 30 and no `summary` changed (compare a snapshot taken before).

### 2. Copy generator and checks
Write `studio/copy/facts.ts` (the facts projection plus mapping amenity keys to labels), `studio/copy/instructions.ts` (the Generate and Prompt instruction text), `studio/copy/checks.ts` (layer 1), and `studio/copy/generate-copy.ts` (Generate → layer 1 → layer 2 → one retry → draft write, with `--slug` and `--dry-run`). Add the `copy` npm script. Run `--dry-run --slug modern-cabin-with-hot-tub` and read the output. Then run `--dry-run` on all 30. Before writing anything, plant a bad copy (e.g. add "hot tub" to a stay without one) through a tiny local test call to confirm both layers reject it.

### 3. Generate drafts and review
Run `npm run copy` for real. Report every stay's result and show 3 before/after examples. **Stop:** you review the drafts in the Studio. After your approval, publish them (MCP `publish_documents` or the Studio). Stays that failed twice keep their old copy and are listed.

### 4. Turn on embeddings
Run the `embeddings enable` command with the projection and `--wait`, then `npx sanity datasets embeddings status roam-dataset` until it shows `ready`. Check it with the Verification queries below.

### 5. Home on live content
Add `src/lib/sanity/{config,client,image,queries,index}.ts`, `src/screens/home/use-featured-stays.ts`, the loading, error and empty components in `src/screens/home/components/`, and update `use-home.ts`, `index.tsx`, `featured-stays.tsx` and `featured-stay-card.tsx`. Use es-toolkit helpers per the code-structure rules. `npx expo lint` and `npx tsc --noEmit` must be clean. Run it on the iOS simulator if one is available, otherwise on web at iPhone size, and compare with the home design.

## Verification
- `studio/`: `npx eslint .` and `npx sanity build` are clean. Root: `npx expo lint` and `npx tsc --noEmit` are clean.
- Schema: MCP `get_schema` shows `property.vibes`, and the deployed Studio shows the vibes grid.
- Seed rerun: a second `npm run seed` changes no `summary`/`description` and creates nothing.
- Copy:
  - The report shows a pass/fail line for all 30 stays.
  - The planted-hallucination test is rejected by layer 1 and by layer 2.
  - Spot-check 5 published stays by hand against their fields (one per type plus a no-pets stay): every claim maps to a field, no price or rating is mentioned, and soft words ⊆ `vibes`.
- Embeddings: `status` is `ready`, and MCP `list_embeddings_indices` / dataset settings show the projection. These queries go through MCP GROQ with `$q` as a param:
  - `*[_type=="property"] | score(text::semanticSimilarity($q)) | order(_score desc)[0...5]{title, vibes}` with:
    - "quiet secluded cabin to write in": the top results are cabins with quiet or secluded vibes.
    - "lively walkable city weekend": city stays with the lively vibe come first.
    - "romantic sunset by the ocean": beach stays or villas with the romantic vibe.
    - "big family trip with a pool": villas with the family vibe and a pool.
  - Filtered: `stayType == $type && petsAllowed && pricePerNight <= $max` plus the same score, with cabin / 300 / "cozy", returns only pet-friendly cabins under $300, ranked by meaning.
  - A `_score` order that looks wrong is explained by its cause: copy, vibes, projection, or the query.
- Home:
  - Signing in shows featured stays from Sanity (30 for All, with titles that aren't in `src/data/stays.ts`, like "Desert Stargazer Cabin").
  - Each chip filters correctly, and switching back to a category is instant.
  - Offline or a bad host shows the error banner, and "Try again" recovers.
  - A category with no stays shows the empty line (checked by temporarily querying an unused type).
  - Photos are cropped by hotspot.
- End to end: edit one stay's `vibes` or title in the Studio and publish, and Home shows the change on the next fetch. Rerunning `npm run copy --slug <it>` makes a new draft that passes the check.

## AGENTS.md updates
- **Content:** add "`property.vibes` (fixed list) is the only source of atmosphere words. `npm run copy` in `studio/` writes `summary`/`description` with Agent Actions Generate from the stay's own fields, checks them in code and with an Agent Actions Prompt, and writes passing copy to drafts for review. The seed sets copy only when it creates a stay."
- **Soft intent:** note that embeddings are on for `property` only, with the projection `title, summary, description, vibes, place`. Change the soft-intent rule so it names `vibes` along with `summary`/`description`.
- **Exact constraints:** replace "The local `vibes` field has no schema counterpart" with "Search still runs on `src/data/stays.ts` until it moves to GROQ; Home reads Sanity through `src/lib/sanity` (plain fetch to apicdn, no token)."
- **Rules:** add "Generated copy never states anything that isn't in the stay's fields, and never mentions price, rating or policies."

## Result
Built as planned. Lint and type check are clean (root and `studio/`).
- **Vibes:** all 30 stays have 1–4 vibes. The 14 new stays got: ski chalet cozy/family/lively, desert stargazer quiet/secluded/romantic, surf cottage lively/cozy, bluff-top cottage quiet/romantic/secluded, Victorian flat lively/cozy, Arts District loft lively/modern, vineyard villa family/romantic, Ojai oak house modern/quiet, Cannon Beach family/cozy, Hood River barn cozy/family, San Juan farmhouse quiet/secluded/family, Pike Place lively/cozy, Red Rock casita quiet/romantic/modern, Breckenridge lodge cozy/family. The seed rerun left every `summary`, `description` and `_id` unchanged.
- **Copy:** 30 of 30 passed both checks, and 2 needed a retry (an atmosphere word without the matching vibe). Planted claims were rejected by both layers: layer 1 caught pool, beach, $, minutes and unknown numbers, and layer 2 also caught doorman, balcony, taco shop, concierge and playground. The user chose to publish the copy as is. It's factual but flat and formulaic ("pairs … with", spec-sheet sentences, house rules repeated in prose), and that's the first thing to tune next.
- **Additions beyond the plan:**
  - A house rule counts as a fact for feature words ("Pool and gym are shared with residents" backs "pool").
  - Layer 2 lives in `copy/fact-check.ts` so it can be tested on its own.
  - The instruction asks for 75–100 words and US times, inside the check's 60–110 limit.
- **Embeddings:** status `ready` with the planned projection. All four semantic queries ranked as expected. The filtered query (cabin, pets, ≤ $300, "cozy") returned only matching stays, ranked by meaning.
- **Home:** live on web at iPhone size via Playwright. All shows 20 cards (the query's `[0...20]` cap, not 30). Cabins shows 10. Returning to a category sends no request. The empty state shows "Nothing in Villas yet." (wording changed from the plan to read better with plural labels). An aborted request shows the error banner, and Try again recovers. Not seen on iOS (no Xcode on this Mac).
- **Found during verification:** web requests got 403 because the project's CORS list only had `localhost:3333`. Added `localhost:8081` and `localhost:8099` without credentials, with the user's OK. Native apps aren't affected.
- **Not exercised:** no seeded photo has a hotspot yet, so the focal-point crop path has only been checked by reading the code.
- **Outside this plan:** the Modern Cabin's title was edited in the Studio to "Test Modern Cabin with Hot Tub" during review. The next `npm run seed` resets it.
