import type { ListingCardProps } from "@/components/ui/listing-card";
import { AMENITY_META } from "@/constants/stays";
import type { Stay } from "@/data/stays";

/** Two tags fit the card: the stay's standout amenities, with pets ahead of wifi. */
const toTags = (stay: Stay): ListingCardProps["amenities"] => {
  const standout = stay.amenities.filter((a) => a !== "wifi").map((a) => AMENITY_META[a]);
  const pets = stay.petsAllowed ? [{ label: "Pet Friendly", icon: "pets" as const }] : [];

  return [...standout.slice(0, 1), ...pets, ...standout.slice(1)].slice(0, 2);
};

export const toListing = (stay: Stay) => ({
  id: stay.id,
  title: stay.title,
  location: `${stay.city}, ${stay.region}`,
  rating: stay.rating,
  reviewCount: stay.reviewCount,
  amenities: toTags(stay),
  pricePerNight: stay.pricePerNight,
  imageUrl: stay.imageUrl,
});

export type Listing = ReturnType<typeof toListing>;
