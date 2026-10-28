import type { IconName } from "@/components/ui/icon"
import type { Amenity, ResponseTime, StayType } from "@/lib/sanity"

/** How each amenity reads on a tag or chip. */
export const AMENITY_META: Record<Amenity, { label: string, icon: IconName }> = {
  hotTub: { label: "Hot Tub", icon: "hotTub" },
  pool: { label: "Pool", icon: "pool" },
  fireplace: { label: "Fireplace", icon: "fireplace" },
  wifi: { label: "Wifi", icon: "wifi" },
  oceanView: { label: "Ocean View", icon: "oceanView" },
  forestView: { label: "Forest View", icon: "forestView" },
  mountainView: { label: "Mountain View", icon: "mountainView" },
  lakeView: { label: "Lake View", icon: "lakeView" },
  beachAccess: { label: "Beach Access", icon: "beachAccess" },
  kitchen: { label: "Kitchen", icon: "kitchen" },
  workspace: { label: "Workspace", icon: "workspace" },
  freeParking: { label: "Free Parking", icon: "freeParking" },
  airConditioning: { label: "Air Conditioning", icon: "airConditioning" },
  washer: { label: "Washer", icon: "washer" },
  evCharger: { label: "EV Charger", icon: "evCharger" },
  bbqGrill: { label: "BBQ Grill", icon: "bbqGrill" },
}

/** The tag or highlight for a stay that allows pets. Not an amenity: it comes from `petsAllowed`. */
export const PETS_META: { label: string, icon: IconName } = { label: "Pet Friendly", icon: "pets" }

/** Plural category names, as on the home chips and search constraints. */
export const STAY_TYPE_META: Record<StayType, { label: string, icon: IconName }> = {
  cabin: { label: "Cabins", icon: "cabins" },
  beach: { label: "Beach", icon: "beach" },
  city: { label: "City", icon: "city" },
  villa: { label: "Villas", icon: "villas" },
}

/** The schema's response-time option titles, as a sentence. Details' host row and the host sheet. */
export const RESPONSE_TIME_LABEL: Record<ResponseTime, string> = {
  withinAnHour: "Responds within an hour",
  withinAFewHours: "Responds within a few hours",
  withinADay: "Responds within a day",
}
