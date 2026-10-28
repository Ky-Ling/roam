import { AMENITY_META, STAY_TYPE_META } from "@/constants/stays"
import type { Amenity, StayType, Vibe } from "@/lib/sanity"
import { capitalize, uniq } from "@/lib/utils"

import type { Constraint } from "./types"

/** Stable id for a constraint, for chip keys and on/off state. */
export const constraintKey = (c: Constraint) => ("value" in c ? `${c.kind}:${c.value}` : c.kind)

export const constraintLabel = (c: Constraint) => {
  switch (c.kind) {
    case "type":
      return STAY_TYPE_META[c.value].label
    case "maxPrice":
      return `Under $${c.value}`
    case "amenity":
      return AMENITY_META[c.value].label
    case "pets":
      return "Pet Friendly"
    case "place":
      return c.value
    case "vibe":
      return capitalize(c.value)
  }
}

/** Kinds only, sorted: safe for analytics because it carries no values. */
export const constraintKinds = (constraints: Constraint[]) => uniq(constraints.map((c) => c.kind)).sort()

export type SearchParams = {
  type: StayType | null
  maxPrice: number | null
  pets: boolean
  amenities: Amenity[]
  place: string | null
  vibes: Vibe[]
}

/** GROQ params for `searchStaysQuery`. A constraint that's off or absent becomes null, false or []. */
export const toQueryParams = (constraints: Constraint[]): SearchParams => {
  const params: SearchParams = { type: null, maxPrice: null, pets: false, amenities: [], place: null, vibes: [] }
  for (const c of constraints) {
    switch (c.kind) {
      case "type":
        params.type = c.value
        break
      case "maxPrice":
        params.maxPrice = c.value
        break
      case "pets":
        params.pets = true
        break
      case "amenity":
        params.amenities.push(c.value)
        break
      case "place":
        params.place = c.value
        break
      case "vibe":
        params.vibes.push(c.value)
        break
    }
  }

  return params
}
