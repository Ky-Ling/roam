// The only things generated copy may say about a stay. Price, rating, host and policies are left
// out on purpose: prices and ratings go stale in prose, and policy text is quoted, never paraphrased.

import type {SanityClient} from 'sanity'

import {AMENITIES, type Amenity, type StayType, type Vibe} from '../schemaTypes/constants'

export type StayFacts = {
  title: string
  stayType: StayType
  place: {neighborhood?: string; city: string; regionName: string}
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  minNights: number
  petsAllowed: boolean
  /** Amenity labels, in the stay's editorial order. */
  amenities: string[]
  vibes: Vibe[]
  houseRules: {checkInFrom: string; checkOutBy: string; quietHours?: string; rules: string[]}
}

export type StayRecord = {
  _id: string
  slug: string
  amenityKeys: Amenity[]
  facts: StayFacts
}

type Row = Omit<StayFacts, 'amenities'> & {_id: string; slug: string; amenities: Amenity[]}

const FACTS_QUERY = `*[_type == "property" && !(_id in path("drafts.**")) && ($slug == null || slug.current == $slug)]
  | order(slug.current asc) {
    _id,
    "slug": slug.current,
    title,
    stayType,
    "place": location{neighborhood, city, regionName},
    maxGuests,
    bedrooms,
    beds,
    bathrooms,
    minNights,
    petsAllowed,
    amenities,
    vibes,
    houseRules{checkInFrom, checkOutBy, quietHours, rules}
  }`

const LABELS = new Map<string, string>(AMENITIES.map((a) => [a.value, a.title]))

/** Published stays (or the one with `slug`) with the facts their copy may use. */
export const fetchStays = async (client: SanityClient, slug: string | null) => {
  const rows = await client.fetch<Row[]>(FACTS_QUERY, {slug})

  return rows.map(({_id, slug: s, amenities, ...rest}): StayRecord => {
    const facts = {...rest, amenities: amenities.map((a) => LABELS.get(a) ?? a)}
    // GROQ returns null for unset optional fields; drop them so the model never sees "null"
    if (!facts.place.neighborhood) delete facts.place.neighborhood
    if (!facts.houseRules.quietHours) delete facts.houseRules.quietHours

    return {_id, slug: s, amenityKeys: amenities, facts}
  })
}

/** The facts as the model sees them. */
export const factsJson = (stay: StayRecord) => JSON.stringify(stay.facts, null, 2)
