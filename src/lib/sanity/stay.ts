import { sanityFetch } from "./client"
import type { SanityImage } from "./image"
import type { Amenity } from "./types"

export type ResponseTime = "withinAnHour" | "withinAFewHours" | "withinADay"

export type StayPolicy = {
  title: string
  category: string
  summary: string
  /** Exact wording. Paragraphs are separated by a blank line. */
  body: string
}

/** Another published stay by the same host, for the host sheet. */
export type HostStay = {
  /** The stay's slug. */
  id: string
  title: string
  city: string
  region: string
  pricePerNight: number
  rating: number
  reviewCount: number
  cover: SanityImage | null
}

export type StayHost = {
  name: string
  isSuperhost: boolean | null
  responseTime: ResponseTime | null
  bio: string | null
  joinedYear: number | null
  languages: string[] | null
  photo: SanityImage | null
  /** The host's other published stays, this one excluded (6 max). */
  otherStays: HostStay[]
}

export type StayDetails = {
  /** The stay's slug. */
  id: string
  title: string
  city: string
  region: string
  rating: number
  reviewCount: number
  pricePerNight: number
  cleaningFee: number
  minNights: number
  petsAllowed: boolean
  amenities: Amenity[] | null
  photos: SanityImage[] | null
  houseRules: { checkInFrom: string, checkOutBy: string, quietHours: string | null, rules: string[] | null } | null
  host: StayHost | null
  cancellationPolicy: (Omit<StayPolicy, "category"> & { fullRefundDaysBefore: number | null }) | null
  /** Stay-specific policies. */
  policies: StayPolicy[] | null
  /** Roam-wide policies: never referenced by a stay, so the query adds them to every one. */
  roamPolicies: StayPolicy[]
}

/** One published stay by slug (`$slug`), with its host (and their other stays), policies and the Roam-wide policies. */
export const STAY_QUERY = `*[_type == "property" && slug.current == $slug][0]{
  "id": slug.current,
  title,
  "city": location.city,
  "region": location.region,
  rating,
  reviewCount,
  pricePerNight,
  cleaningFee,
  minNights,
  petsAllowed,
  amenities,
  "photos": photos[]{alt, hotspot, "url": asset->url},
  houseRules{checkInFrom, checkOutBy, quietHours, rules},
  host->{
    name,
    isSuperhost,
    responseTime,
    bio,
    joinedYear,
    languages,
    "photo": photo{alt, hotspot, "url": asset->url},
    "otherStays": *[_type == "property" && references(^._id) && slug.current != $slug] | order(title asc)[0...6]{
      "id": slug.current,
      title,
      "city": location.city,
      "region": location.region,
      pricePerNight,
      rating,
      reviewCount,
      "cover": photos[0]{alt, hotspot, "url": asset->url}
    }
  },
  cancellationPolicy->{title, summary, body, fullRefundDaysBefore},
  "policies": policies[]->{title, category, summary, body},
  "roamPolicies": *[_type == "policy" && appliesToAllStays == true] | order(title asc){title, category, summary, body}
}`

const cache: Record<string, Promise<StayDetails | null>> = {}

/**
 * A stay, fetched once per slug per session so the policies sheet opens from the same data.
 * Null when no published stay has the slug. A failure clears the entry so a retry refetches.
 */
export const fetchStay = (slug: string) => {
  cache[slug] ??= sanityFetch<StayDetails | null>(STAY_QUERY, { slug }).catch((error: unknown) => {
    delete cache[slug]
    throw error
  })

  return cache[slug]
}
