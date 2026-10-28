import type { StayType } from "@/data/stays"

import type { SanityImage } from "./image"

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
