import type { Amenity, StayType, Vibe } from "@/data/stays";

/** One thing the guest's sentence was understood to ask for. Everything but vibe filters. */
export type Constraint =
  | { kind: "type"; value: StayType }
  | { kind: "maxPrice"; value: number }
  | { kind: "amenity"; value: Amenity }
  | { kind: "pets" }
  | { kind: "place"; value: string }
  | { kind: "vibe"; value: Vibe };

export type SortKey = "best" | "price" | "rating";
