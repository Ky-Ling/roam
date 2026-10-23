import type { Amenity, Stay, StayType, Vibe } from "@/data/stays";
import { escapeRegExp, sortBy, uniq } from "@/lib/utils";

import type { Constraint } from "./types";

const AMENITY_PATTERNS: [Amenity, RegExp][] = [
  ["hotTub", /\b(hot ?tubs?|jacuzzis?)\b/],
  ["pool", /\b(pools?|swimming)\b/],
  ["fireplace", /\b(fireplaces?|fire ?pits?|wood ?stoves?)\b/],
  ["oceanView", /\b(ocean|sea|water) ?views?\b/],
  ["wifi", /\b(wi-?fi|internet)\b/],
];

// First match wins.
const TYPE_PATTERNS: [StayType, RegExp][] = [
  ["cabin", /\b(cabins?|a-?frames?|lodges?|chalets?)\b/],
  ["villa", /\b(villas?|estates?|mansions?)\b/],
  ["beach", /\b(beach(es|front)?|ocean(front)?|coast(al)?|seaside)\b/],
  ["city", /\b(city|apartments?|lofts?|flats?|downtown|urban)\b/],
];

const VIBE_PATTERNS: [Vibe, RegExp][] = [
  ["quiet", /\b(quiet|peaceful|calm|tranquil)\b/],
  ["cozy", /\b(cozy|cosy|snug)\b/],
  ["secluded", /\b(secluded|private|remote|hidden|off-grid)\b/],
  ["romantic", /\b(romantic|couples?|honeymoon)\b/],
  ["lively", /\b(lively|nightlife|walkable|vibrant)\b/],
  ["modern", /\b(modern|designer|sleek|contemporary)\b/],
  ["family", /\b(family|kids|children)\b/],
];

const PETS = /\b(pets?|dogs?|cats?)\b/;
// "under $300", "below 250", "less than $400", "max 300", "up to $500", "< 300"
const PRICE_CAP = /\b(?:under|below|less than|max(?:imum)?|up to|within)\s*\$?\s*(\d{1,5})\b|<\s*\$?\s*(\d{1,5})/;
// A bare "$300 a night" reads as a cap too
const BARE_PRICE = /\$\s*(\d{1,5})/;

// Chips read in this order: what it is, what it costs, what it has, where, how it feels.
const KIND_ORDER: Constraint["kind"][] = ["type", "maxPrice", "pets", "amenity", "place", "vibe"];

const wordIn = (text: string, word: string) => new RegExp(`\\b${escapeRegExp(word.toLowerCase())}\\b`).test(text);

const matchPlace = (text: string, stays: Stay[]) => {
  // Longest first, so "South Lake Tahoe" wins over a shorter name inside it.
  // Native sort: es-toolkit's sortBy/orderBy only take objects.
  const names = uniq(stays.flatMap((s) => [s.city, s.regionName])).sort((a, b) => b.length - a.length);

  return names.find((p) => wordIn(text, p)) ?? uniq(stays.map((s) => s.region)).find((r) => wordIn(text, r));
};

/**
 * Turns a sentence like "quiet pet friendly cabin with a hot tub under $300" into constraints.
 * Plain code, no AI: values are only ever read from the text, never guessed.
 */
export const parseQuery = (query: string, stays: Stay[]): Constraint[] => {
  let text = ` ${query.toLowerCase()} `;
  const constraints: Constraint[] = [];

  // Amenities go first and are cut from the text, so "ocean view" doesn't also read as a beach stay
  for (const [value, pattern] of AMENITY_PATTERNS) {
    if (!pattern.test(text)) continue;
    constraints.push({ kind: "amenity", value });
    text = text.replace(pattern, " ");
  }

  const type = TYPE_PATTERNS.find(([, pattern]) => pattern.test(text));
  if (type) constraints.push({ kind: "type", value: type[0] });

  const price = text.match(PRICE_CAP) ?? text.match(BARE_PRICE);
  if (price) constraints.push({ kind: "maxPrice", value: Number(price[1] ?? price[2]) });

  if (PETS.test(text)) constraints.push({ kind: "pets" });

  const place = matchPlace(text, stays);
  if (place) constraints.push({ kind: "place", value: place });

  for (const [value, pattern] of VIBE_PATTERNS) {
    if (pattern.test(text)) constraints.push({ kind: "vibe", value });
  }

  return sortBy(constraints, [(c) => KIND_ORDER.indexOf(c.kind)]);
};
