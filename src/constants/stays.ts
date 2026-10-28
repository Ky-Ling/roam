import type { IconName } from "@/components/ui/icon"
import type { Amenity, StayType } from "@/lib/sanity"

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

/** Plural category names, as on the home chips and search constraints. */
export const STAY_TYPE_META: Record<StayType, { label: string, icon: IconName }> = {
  cabin: { label: "Cabins", icon: "cabins" },
  beach: { label: "Beach", icon: "beach" },
  city: { label: "City", icon: "city" },
  villa: { label: "Villas", icon: "villas" },
}
