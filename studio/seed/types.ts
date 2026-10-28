import type {Amenity, PolicyCategory, ResponseTime, StayType, Vibe} from '../schemaTypes/constants'

/** An Unsplash photo: `id` is the part after `photo-` in images.unsplash.com URLs. */
export type SeedPhoto = {id: string; alt: string}

export type SeedPolicy = {
  slug: string
  title: string
  category: PolicyCategory
  appliesToAllStays: boolean
  summary: string
  body: string
  fullRefundDaysBefore?: number
}

export type SeedHost = {
  slug: string
  name: string
  photo: SeedPhoto
  isSuperhost: boolean
  bio: string
  joinedYear: number
  responseTime: ResponseTime
  languages: string[]
}

export type SeedStay = {
  slug: string
  title: string
  stayType: StayType
  vibes: Vibe[]
  /** Written only when the stay is created; `npm run copy` owns them after that. */
  summary: string
  description: string
  rating: number
  reviewCount: number
  location: {
    city: string
    region: string
    regionName: string
    neighborhood?: string
    lat: number
    lng: number
  }
  pricePerNight: number
  cleaningFee: number
  minNights: number
  maxGuests: number
  bedrooms: number
  beds: number
  bathrooms: number
  petsAllowed: boolean
  amenities: Amenity[]
  photos: SeedPhoto[]
  /** Slugs, resolved to references at seed time. */
  host: string
  cancellationPolicy: string
  policies: string[]
  houseRules: {checkInFrom: string; checkOutBy: string; quietHours?: string; rules: string[]}
}
