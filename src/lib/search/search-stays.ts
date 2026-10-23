import { AMENITY_META, STAY_TYPE_META } from "@/constants/stays"
import type { Stay } from "@/data/stays"
import { capitalize, orderBy } from "@/lib/utils"

import type { Constraint, SortKey } from "./types"

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

const passes = (stay: Stay, c: Constraint) => {
  switch (c.kind) {
    case "type":
      return stay.type === c.value
    case "maxPrice":
      return stay.pricePerNight <= c.value
    case "amenity":
      return stay.amenities.includes(c.value)
    case "pets":
      return stay.petsAllowed
    case "place":
      return [stay.city, stay.region, stay.regionName].includes(c.value)
    // Soft intent ranks, it never filters
    case "vibe":
      return true
  }
}

/** Hard constraints filter; vibes only lift matching stays in "best" order. */
export const searchStays = (stays: Stay[], constraints: Constraint[], sort: SortKey = "best") => {
  const matches = stays.filter((stay) => constraints.every((c) => passes(stay, c)))
  const vibes = constraints.flatMap((c) => (c.kind === "vibe" ? [c.value] : []))
  const vibeScore = (stay: Stay) => vibes.filter((v) => stay.vibes.includes(v)).length

  switch (sort) {
    case "price":
      return orderBy(matches, ["pricePerNight", "rating"], ["asc", "desc"])
    case "rating":
      return orderBy(matches, ["rating", "reviewCount"], ["desc", "desc"])
    case "best":
      return orderBy(matches, [vibeScore, "rating", "reviewCount"], ["desc", "desc", "desc"])
  }
}
