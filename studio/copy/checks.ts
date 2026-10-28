// Layer 1 of the copy check: deterministic rules that catch the common ways generated copy
// invents things. Layer 2 (an Agent Actions Prompt) catches what word lists can't.

import type {Amenity, Vibe} from '../schemaTypes/constants'
import type {StayRecord} from './facts'

export type Copy = {summary: string; description: string}

const MAX_SUMMARY = 160
const WORDS = {min: 60, max: 110}

/** Feature words, allowed only when the stay has one of the listed amenities (or the stay type). */
const FEATURES: {words: RegExp; allowedBy: (Amenity | 'beachType')[]}[] = [
  {words: /\b(hot tubs?|jacuzzi|spa)\b/, allowedBy: ['hotTub']},
  {words: /\bpools?\b/, allowedBy: ['pool']},
  {words: /\b(fireplaces?|wood ?stoves?|hearth)\b/, allowedBy: ['fireplace']},
  {words: /\b(ocean|sea|pacific|whales?)\b/, allowedBy: ['oceanView', 'beachAccess']},
  {words: /\blakes?\b/, allowedBy: ['lakeView']},
  {words: /\bbeach(es)?\b/, allowedBy: ['beachAccess', 'beachType']},
  {words: /\b(mountains?|peaks?|slopes?|ridges?)\b/, allowedBy: ['mountainView']},
  {words: /\b(forests?|woods|woodland|pines?|redwoods|trees)\b/, allowedBy: ['forestView']},
  {words: /\b(workspace|desks?|office)\b/, allowedBy: ['workspace']},
  {words: /\b(parking|driveway|garage)\b/, allowedBy: ['freeParking']},
  {words: /\b(ev|chargers?|charging)\b/, allowedBy: ['evCharger']},
  {words: /\b(washers?|dryers?|laundry)\b/, allowedBy: ['washer']},
  {words: /\b(grills?|bbq|barbecue)\b/, allowedBy: ['bbqGrill']},
  {words: /\b(air[- ]condition\w*|a\/c)\b/, allowedBy: ['airConditioning']},
  {words: /\b(kitchens?|kitchenette|cook\w*)\b/, allowedBy: ['kitchen']},
  {words: /\b(wi-?fi|internet)\b/, allowedBy: ['wifi']},
]

const VIBE_WORDS: Record<Vibe, RegExp> = {
  quiet: /\b(quiet|peaceful|calm|tranquil|serene)\b/,
  cozy: /\b(cozy|snug)\b/,
  secluded: /\b(secluded|seclusion|private|privacy|hidden|remote|tucked away|isolated)\b/,
  romantic: /\b(romantic|romance|honeymoon\w*|couples?)\b/,
  lively: /\b(lively|buzzing|vibrant|bustling|nightlife)\b/,
  modern: /\b(modern|contemporary|sleek|minimalist)\b/,
  family: /\b(family|families|kids|children)\b/,
}

const PET_WORDS = /\b(dogs?|pets?|cats?|pups?|puppy|furry)\b/

const ALWAYS_REJECTED: {words: RegExp; reason: string}[] = [
  {words: /\$|\b(price[ds]?|fees?|cheap|affordable|bargain)\b/, reason: 'mentions price'},
  {words: /\b(stars?|rated|ratings?|reviews?|reviewers?)\b/, reason: 'mentions ratings or reviews'},
  {words: /\b(hosts?|hosted)\b/, reason: 'mentions the host'},
  {words: /\b(cancel\w*|refunds?)\b/, reason: 'mentions policies'},
  {
    words:
      /\b(minutes?|mins?|hours? away|miles?|km|kilometers?|blocks?|walk(ing)? to|walkable|drive|steps from|nearby|close to|near)\b/,
    reason: 'states a distance or what is nearby',
  },
  {words: /\b(best|perfect|ultimate|world-class)\b/, reason: 'uses a superlative'},
]

const NUMBER_WORDS: Record<string, number> = {
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Removes names (title, place) and quoted house rules, so "Lake Arrowhead" isn't a lake claim. */
const stripNames = (text: string, stay: StayRecord) => {
  const {title, place, houseRules} = stay.facts
  const names = [title, place.neighborhood, place.city, place.regionName, ...houseRules.rules]
  let out = text.toLowerCase()
  for (const name of names) {
    if (name) out = out.replace(new RegExp(escape(name.toLowerCase()), 'g'), ' ')
  }
  if (houseRules.quietHours) out = out.replace(/quiet hours/g, ' ')

  return out
}

/** Every number the facts contain, plus 12-hour forms of the check-in and check-out hours. */
const allowedNumbers = (stay: StayRecord) => {
  const allowed = new Set((JSON.stringify(stay.facts).match(/\d+(\.\d+)?/g) ?? []).map(Number))
  const {checkInFrom, checkOutBy} = stay.facts.houseRules
  for (const time of [checkInFrom, checkOutBy]) {
    const hour = Number(time.split(':')[0])
    allowed.add(hour % 12 === 0 ? 12 : hour % 12)
  }

  return allowed
}

/** Reasons the copy fails layer 1. Empty means it passes. */
export const checkCopy = (copy: Copy, stay: StayRecord): string[] => {
  const failures: string[] = []
  const {facts, amenityKeys} = stay
  const has = new Set<string>([
    ...amenityKeys,
    ...(facts.stayType === 'beach' ? ['beachType'] : []),
  ])

  if (copy.summary.length > MAX_SUMMARY)
    failures.push(`summary is ${copy.summary.length} characters (max ${MAX_SUMMARY})`)
  const paragraphs = copy.description.split(/\n\s*\n/).filter((p) => p.trim())
  if (paragraphs.length < 2 || paragraphs.length > 3)
    failures.push(`description has ${paragraphs.length} paragraphs (needs 2-3)`)
  const wordCount = copy.description.split(/\s+/).filter(Boolean).length
  if (wordCount < WORDS.min || wordCount > WORDS.max)
    failures.push(`description has ${wordCount} words (needs ${WORDS.min}-${WORDS.max})`)

  const text = stripNames(`${copy.summary}\n${copy.description}`, stay)
  const found = (re: RegExp) => text.match(re)?.[0]

  // A house rule is a fact too: "Pool and gym are shared with residents" backs "pool"
  const rules = facts.houseRules.rules.join(' ').toLowerCase()
  for (const {words, allowedBy} of FEATURES) {
    const word = found(words)
    if (word && !rules.includes(word) && !allowedBy.some((key) => has.has(key)))
      failures.push(`"${word}" isn't backed by an amenity`)
  }
  for (const [vibe, words] of Object.entries(VIBE_WORDS) as [Vibe, RegExp][]) {
    const word = found(words)
    if (word && !facts.vibes.includes(vibe)) failures.push(`"${word}" needs the ${vibe} vibe`)
  }
  const petWord = found(PET_WORDS)
  if (petWord && !facts.petsAllowed) failures.push(`"${petWord}" but pets aren't allowed`)
  for (const {words, reason} of ALWAYS_REJECTED) {
    const word = found(words)
    if (word) failures.push(`"${word}" ${reason}`)
  }

  const allowed = allowedNumbers(stay)
  const numbers = [
    ...(text.match(/\d+(\.\d+)?/g) ?? []).map(Number),
    ...(text.match(/\b[a-z]+\b/g) ?? []).flatMap((w) =>
      w in NUMBER_WORDS ? [NUMBER_WORDS[w]] : [],
    ),
  ]
  for (const n of new Set(numbers)) {
    if (!allowed.has(n)) failures.push(`the number ${n} isn't in the facts`)
  }

  return failures
}
