import type { IconName } from "@/components/ui/icon"
import { AMENITY_META, PETS_META, RESPONSE_TIME_LABEL } from "@/constants/stays"
import { sanityImageUrl, type StayDetails } from "@/lib/sanity"
import { compact, isNil, round } from "@/lib/utils"

import { GALLERY_HEIGHT } from "./constants"

const HIGHLIGHT_COUNT = 4

/** The first amenities in the stay's editorial order, with Pet Friendly second when pets are allowed. */
const toHighlights = (stay: StayDetails): { icon: IconName, label: string }[] => {
  const amenities = (stay.amenities ?? []).map((a) => AMENITY_META[a])
  const pets = stay.petsAllowed ? [PETS_META] : []

  return [...amenities.slice(0, 1), ...pets, ...amenities.slice(1)].slice(0, HIGHLIGHT_COUNT)
}

/** Minimum stay: nights × nightly price + cleaning fee, computed here and never stored. */
const totalLabel = (stay: StayDetails) => {
  const nights = stay.minNights
  const total = nights * stay.pricePerNight + stay.cleaningFee

  return `$${total.toLocaleString("en-US")} for ${nights} ${nights === 1 ? "night" : "nights"}`
}

const hostView = (host: NonNullable<StayDetails["host"]>) => ({
  name: host.name,
  superhost: host.isSuperhost === true,
  subtitle: host.isSuperhost ? "Superhost" : isNil(host.responseTime) ? null : RESPONSE_TIME_LABEL[host.responseTime],
  // 3x the 60pt avatar
  photoUrl: isNil(host.photo) ? null : sanityImageUrl(host.photo, { width: 180, height: 180 }),
})

/** Everything the details screen shows, ready to render. Photos are requested at 3x the gallery's size. */
export const toStayView = (stay: StayDetails, screenWidth: number) => ({
  title: stay.title,
  location: `${stay.city}, ${stay.region}`,
  rating: stay.rating.toFixed(1),
  reviewCount: stay.reviewCount,
  highlights: toHighlights(stay),
  photos: compact(stay.photos ?? []).map((photo) => ({
    url: sanityImageUrl(photo, { width: round(screenWidth * 3), height: GALLERY_HEIGHT * 3 }),
    alt: photo.alt,
  })),
  cancellation: isNil(stay.cancellationPolicy)
    ? null
    : { title: stay.cancellationPolicy.title, summary: stay.cancellationPolicy.summary },
  host: isNil(stay.host) ? null : hostView(stay.host),
  price: `$${stay.pricePerNight.toLocaleString("en-US")}`,
  total: totalLabel(stay),
})

export type StayView = ReturnType<typeof toStayView>
