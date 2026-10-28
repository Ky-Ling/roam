import type { SanityImage } from "./image"
import type { Amenity, StayType } from "./types"

export type FeaturedStay = {
  /** The stay's slug. */
  id: string
  title: string
  stayType: StayType
  city: string
  region: string
  rating: number
  photo: SanityImage | null
}

/** Top-rated published stays; `$type` is a stay type or "all". */
export const FEATURED_STAYS_QUERY = `*[_type == "property" && ($type == "all" || stayType == $type)]
  | order(rating desc, reviewCount desc)[0...20] {
    "id": slug.current,
    title,
    stayType,
    "city": location.city,
    "region": location.region,
    rating,
    "photo": photos[0]{alt, hotspot, "url": asset->url}
  }`

export type SearchSort = "best" | "price" | "rating"

export type SearchStay = {
  /** The stay's slug. */
  id: string
  title: string
  city: string
  region: string
  rating: number
  reviewCount: number
  pricePerNight: number
  petsAllowed: boolean
  amenities: Amenity[] | null
  photo: SanityImage | null
}

// Fixed clauses, picked by key: GROQ can't take an order field as a param
const SEARCH_ORDER: Record<SearchSort, string> = {
  best: "_score desc, rating desc, reviewCount desc",
  price: "pricePerNight asc, rating desc",
  rating: "rating desc, reviewCount desc",
}

/**
 * Stays matching every hard constraint, ranked by how many of `$vibes` they have.
 * Params: `$type`, `$maxPrice`, `$place` (null to skip), `$pets` (bool), `$amenities`, `$vibes` (arrays).
 */
export const searchStaysQuery = (sort: SearchSort) => `*[_type == "property"
  && ($type == null || stayType == $type)
  && ($maxPrice == null || pricePerNight <= $maxPrice)
  && (!$pets || petsAllowed)
  && count(coalesce(amenities, [])[@ in $amenities]) == count($amenities)
  && ($place == null || $place in [location.city, location.region, location.regionName])
] | score(vibes match $vibes) | order(${SEARCH_ORDER[sort]})[0...100] {
  "id": slug.current,
  title,
  "city": location.city,
  "region": location.region,
  rating,
  reviewCount,
  pricePerNight,
  petsAllowed,
  amenities,
  "photo": photos[0]{alt, hotspot, "url": asset->url}
}`
