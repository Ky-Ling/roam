import type { Amenity, StayType, Vibe } from "@/lib/sanity"
import { escapeRegExp, sortBy, uniq } from "@/lib/utils"

import type { Constraint } from "./types"

const AMENITY_PATTERNS: [Amenity, RegExp][] = [
  ["hotTub", /\b(hot ?tubs?|jacuzzis?)\b/],
  ["pool", /\b(pools?|swimming)\b/],
  ["fireplace", /\b(fireplaces?|fire ?pits?|wood ?stoves?)\b/],
  ["oceanView", /\b(ocean|sea|water) ?views?\b/],
  ["wifi", /\b(wi-?fi|internet)\b/],
  ["lakeView", /\blake ?views?\b/],
  ["mountainView", /\b(mountain|alpine) ?views?\b/],
  ["forestView", /\b(forest|redwood|tree) ?views?\b/],
  ["beachAccess", /\b(beach access|steps to the beach)\b/],
  ["kitchen", /\bkitchens?\b/],
  ["workspace", /\b(workspaces?|desks?|office)\b/],
  ["freeParking", /\b(free )?parking\b/],
  ["airConditioning", /\b(air[ -]?conditioning|a\/?c)\b/],
  ["washer", /\b(washers?|washing machines?|laundry)\b/],
  ["evCharger", /\b(ev|electric car) ?charg(er|ers|ing)\b/],
  ["bbqGrill", /\b(bbq|barbecue|grill)s?\b/],
]

// First match wins.
const TYPE_PATTERNS: [StayType, RegExp][] = [
  ["cabin", /\b(cabins?|a-?frames?|lodges?|chalets?)\b/],
  ["villa", /\b(villas?|estates?|mansions?)\b/],
  ["beach", /\b(beach(es|front)?|ocean(front)?|coast(al)?|seaside)\b/],
  ["city", /\b(city|apartments?|lofts?|flats?|downtown|urban)\b/],
]

const VIBE_PATTERNS: [Vibe, RegExp][] = [
  ["quiet", /\b(quiet|peaceful|calm|tranquil)\b/],
  ["cozy", /\b(cozy|cosy|snug)\b/],
  ["secluded", /\b(secluded|private|remote|hidden|off-grid)\b/],
  ["romantic", /\b(romantic|couples?|honeymoon)\b/],
  ["lively", /\b(lively|nightlife|walkable|vibrant)\b/],
  ["modern", /\b(modern|designer|sleek|contemporary)\b/],
  ["family", /\b(family|kids|children)\b/],
]

const PETS = /\b(pets?|dogs?|cats?)\b/
// "under $300", "below 250", "less than $400", "max 300", "up to $500", "< 300"
const PRICE_CAP = /\b(?:under|below|less than|max(?:imum)?|up to|within)\s*\$?\s*(\d{1,5})\b|<\s*\$?\s*(\d{1,5})/
// A bare "$300 a night" reads as a cap too
const BARE_PRICE = /\$\s*(\d{1,5})/

// Chips read in this order: what it is, what it costs, what it has, where, how it feels.
const KIND_ORDER: Constraint["kind"][] = ["type", "maxPrice", "pets", "amenity", "place", "vibe"]

const wordIn = (text: string, word: string) => new RegExp(`\\b${escapeRegExp(word.toLowerCase())}\\b`).test(text)

const REGION_CODE = /^[A-Z]{2}$/

// Longest first, so "South Lake Tahoe" wins over "Lake Tahoe", and "California" over "CA".
// Region codes match only in capitals, so "cabin or cottage" doesn't read as Oregon.
// Native sort: es-toolkit's sortBy/orderBy only take objects.
const matchPlace = (text: string, query: string, places: string[]) =>
  uniq(places)
    .sort((a, b) => b.length - a.length)
    .find((p) => (REGION_CODE.test(p) ? new RegExp(`\\b${p}\\b`).test(query) : wordIn(text, p)))

/**
 * Turns a sentence like "quiet pet friendly cabin with a hot tub under $300" into constraints.
 * Plain code, no AI: values are only ever read from the text, never guessed.
 */
export const parseQuery = (query: string, places: string[]): Constraint[] => {
  let text = ` ${query.toLowerCase()} `
  const constraints: Constraint[] = []

  // Amenities go first and are cut from the text, so "ocean view" doesn't also read as a beach stay
  for (const [value, pattern] of AMENITY_PATTERNS) {
    if (!pattern.test(text)) continue
    constraints.push({ kind: "amenity", value })
    text = text.replace(pattern, " ")
  }

  // Place next, also cut, so "Laguna Beach" or "Lake Arrowhead" isn't read as a type or a view
  const place = matchPlace(text, query, places)
  if (place) {
    constraints.push({ kind: "place", value: place })
    text = text.replace(new RegExp(`\\b${escapeRegExp(place.toLowerCase())}\\b`), " ")
  }

  const type = TYPE_PATTERNS.find(([, pattern]) => pattern.test(text))
  if (type) constraints.push({ kind: "type", value: type[0] })

  const price = text.match(PRICE_CAP) ?? text.match(BARE_PRICE)
  if (price) constraints.push({ kind: "maxPrice", value: Number(price[1] ?? price[2]) })

  if (PETS.test(text)) constraints.push({ kind: "pets" })

  for (const [value, pattern] of VIBE_PATTERNS) {
    if (pattern.test(text)) constraints.push({ kind: "vibe", value })
  }

  return sortBy(constraints, [(c) => KIND_ORDER.indexOf(c.kind)])
}
