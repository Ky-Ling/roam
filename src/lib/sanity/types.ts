// Content keys from studio/schemaTypes/constants.ts. Keep in sync with the schema's option lists.

export type StayType = "cabin" | "beach" | "city" | "villa"

export type Amenity =
  | "hotTub"
  | "pool"
  | "fireplace"
  | "wifi"
  | "oceanView"
  | "forestView"
  | "mountainView"
  | "lakeView"
  | "beachAccess"
  | "kitchen"
  | "workspace"
  | "freeParking"
  | "airConditioning"
  | "washer"
  | "evCharger"
  | "bbqGrill"

/** Soft intent: ranks, never filters. */
export type Vibe = "quiet" | "cozy" | "secluded" | "romantic" | "lively" | "modern" | "family"
