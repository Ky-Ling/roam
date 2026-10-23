import type { IconName } from "@/components/ui/icon";
import type { Amenity, StayType } from "@/data/stays";

/** How each amenity reads on a tag or chip. */
export const AMENITY_META: Record<Amenity, { label: string; icon: IconName }> = {
  hotTub: { label: "Hot Tub", icon: "hotTub" },
  pool: { label: "Pool", icon: "pool" },
  fireplace: { label: "Fireplace", icon: "fireplace" },
  oceanView: { label: "Ocean View", icon: "oceanView" },
  wifi: { label: "Wifi", icon: "wifi" },
};

/** Plural category names, as on the home chips and search constraints. */
export const STAY_TYPE_META: Record<StayType, { label: string; icon: IconName }> = {
  cabin: { label: "Cabins", icon: "cabins" },
  beach: { label: "Beach", icon: "beach" },
  city: { label: "City", icon: "city" },
  villa: { label: "Villas", icon: "villas" },
};
