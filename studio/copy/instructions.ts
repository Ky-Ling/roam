// Instruction text for Agent Actions. Values reach the model only through $params.

export const GENERATE_INSTRUCTION = `
You write the summary and description for a vacation rental listing on Roam.

The ONLY facts about this stay are in $facts. The current summary and description are being
replaced: ignore them completely and do not reuse anything from them.

Rules:
- Every statement must follow directly from $facts. Do not mention any distance, travel time,
  landmark, nearby business, trail, town feature, view, appliance, room, furniture or feature that
  is not in $facts. Views exist only if an amenity says so.
- Do not mention price, fees, ratings, reviews, the host, or cancellation and other policies.
- No superlatives or hype ("best", "perfect", "ultimate", "world-class").
- Atmosphere words (quiet, cozy, secluded, private, romantic, lively, modern, family-friendly and
  their synonyms) may only describe a vibe listed in $facts.vibes.
- If petsAllowed is false, do not mention pets at all.
- Numbers (guests, bedrooms, beds, bathrooms, minimum nights, check-in and check-out times) must
  match $facts exactly.
- summary: one sentence, at most 150 characters. Lead with what makes this stay distinctive (the
  hook in its title or a standout amenity), not a string of vibe words.
- description: 2 or 3 short paragraphs of plain text separated by a blank line, 75 to 100 words in
  total. Mention the place, who it sleeps, the amenities in $facts.amenities, and whether pets are
  welcome when they are.
- Write like a good travel editor: warm, concrete, natural sentences. Weave the vibes and
  amenities into the description of the place; never catalog them ("Amenities include ...") or
  name the vibes as a list. Don't open both fields the same way.
- Write times the US way ("3pm", "11am").
- US English. No emoji, no markdown, no lists.

$avoid
`.trim()

export const CHECK_INSTRUCTION = `
You are a strict fact checker for vacation rental copy.

Facts about the stay: $facts
Copy to check: $copy

List every claim in the copy that the facts do not directly support. A claim is unsupported if it
adds a detail (a feature, view, room, distance, nearby place, activity, quality or atmosphere) that
is not stated in the facts, or contradicts a fact. Atmosphere words are supported only by
facts.vibes. Generic phrasing that adds no new detail ("a place to unwind") is fine.

Respond with json only, in this shape: {"unsupported": [{"claim": "...", "reason": "..."}]}.
Return {"unsupported": []} when every claim is supported.
`.trim()

/** Tells the retry what the last attempt got wrong. */
export const avoidText = (failures: string[]) =>
  failures.length > 0
    ? `A previous attempt was rejected for these reasons. Do not repeat them:\n- ${failures.join('\n- ')}`
    : ''
