import { AMENITY_META, PETS_META } from "@/constants/stays"
import { sanityImageUrl, type Amenity, type SearchStay } from "@/lib/sanity"
import { isNil, uniq } from "@/lib/utils"

import type { ResultCardProps } from "./components/result-card"

// What makes a stay stand out, in the order a card shows them. Basics (wifi, kitchen, ...) never show.
const STANDOUT: Amenity[] = [
  "hotTub",
  "pool",
  "fireplace",
  "oceanView",
  "beachAccess",
  "lakeView",
  "mountainView",
  "forestView",
]

/** Two tags: amenities the guest asked for, then the first standout, Pet Friendly, then the next standout. */
const toTags = (stay: SearchStay, wanted: Amenity[]): ResultCardProps["tags"] => {
  const has = stay.amenities ?? []
  const standout = STANDOUT.filter((a) => has.includes(a))
  const amenities = uniq([...wanted.filter((a) => has.includes(a)), ...standout])
  const tags = amenities.map((a) => AMENITY_META[a])
  const pets = stay.petsAllowed ? [PETS_META] : []

  return [...tags.slice(0, 1), ...pets, ...tags.slice(1)].slice(0, 2)
}

/** Card props for a result. The photo is requested at 3x the card's 136×144. */
export const toResult = (stay: SearchStay, wanted: Amenity[]) => ({
  id: stay.id,
  title: stay.title,
  location: `${stay.city}, ${stay.region}`,
  rating: stay.rating,
  reviewCount: stay.reviewCount,
  tags: toTags(stay, wanted),
  pricePerNight: stay.pricePerNight,
  photoUrl: isNil(stay.photo) ? null : sanityImageUrl(stay.photo, { width: 408, height: 432 }),
  photoAlt: stay.photo?.alt,
})

export const countLabel = (count: number) => `${count} ${count === 1 ? "stay" : "stays"}`
