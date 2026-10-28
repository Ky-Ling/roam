// Option lists shared by the schema and the seed. Values are the keys the app filters on.

export const STAY_TYPES = [
  {title: 'Cabin', value: 'cabin'},
  {title: 'Beach', value: 'beach'},
  {title: 'City', value: 'city'},
  {title: 'Villa', value: 'villa'},
] as const

export type StayType = (typeof STAY_TYPES)[number]['value']

// Order here is only the Studio's checkbox order; the order on a stay is editorial.
export const AMENITIES = [
  {title: 'Hot tub', value: 'hotTub'},
  {title: 'Pool', value: 'pool'},
  {title: 'Fireplace', value: 'fireplace'},
  {title: 'Wi-Fi', value: 'wifi'},
  {title: 'Ocean view', value: 'oceanView'},
  {title: 'Forest view', value: 'forestView'},
  {title: 'Mountain view', value: 'mountainView'},
  {title: 'Lake view', value: 'lakeView'},
  {title: 'Beach access', value: 'beachAccess'},
  {title: 'Kitchen', value: 'kitchen'},
  {title: 'Workspace', value: 'workspace'},
  {title: 'Free parking', value: 'freeParking'},
  {title: 'Air conditioning', value: 'airConditioning'},
  {title: 'Washer', value: 'washer'},
  {title: 'EV charger', value: 'evCharger'},
  {title: 'BBQ grill', value: 'bbqGrill'},
] as const

export type Amenity = (typeof AMENITIES)[number]['value']

// How a stay feels. Generated copy may only use atmosphere words a stay has here.
export const VIBES = [
  {title: 'Quiet', value: 'quiet'},
  {title: 'Cozy', value: 'cozy'},
  {title: 'Secluded', value: 'secluded'},
  {title: 'Romantic', value: 'romantic'},
  {title: 'Lively', value: 'lively'},
  {title: 'Modern', value: 'modern'},
  {title: 'Family', value: 'family'},
] as const

export type Vibe = (typeof VIBES)[number]['value']

export const POLICY_CATEGORIES = [
  {title: 'Cancellation', value: 'cancellation'},
  {title: 'Pets', value: 'pets'},
  {title: 'Check-in', value: 'checkIn'},
  {title: 'Payment', value: 'payment'},
  {title: 'Damage', value: 'damage'},
  {title: 'Safety', value: 'safety'},
  {title: 'Community', value: 'community'},
] as const

export type PolicyCategory = (typeof POLICY_CATEGORIES)[number]['value']

export const RESPONSE_TIMES = [
  {title: 'Within an hour', value: 'withinAnHour'},
  {title: 'Within a few hours', value: 'withinAFewHours'},
  {title: 'Within a day', value: 'withinADay'},
] as const

export type ResponseTime = (typeof RESPONSE_TIMES)[number]['value']
