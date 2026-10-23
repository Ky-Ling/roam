import { ListingCard } from "@/components/ui/listing-card";

import { SectionCard } from "./section-card";

type ListingCardSectionProps = {
  saved: boolean;
  onToggleSave: () => void;
};

export const ListingCardSection = ({ saved, onToggleSave }: ListingCardSectionProps) => (
  <SectionCard title="07. Listing card">
    <ListingCard
      title="Modern Cabin with Hot Tub"
      location="Lake Arrowhead, CA"
      rating={4.9}
      reviewCount={342}
      amenities={[
        { icon: "hotTub", label: "Hot Tub" },
        { icon: "pets", label: "Pet Friendly" },
      ]}
      pricePerNight={280}
      imageUrl="https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=400&q=80"
      saved={saved}
      onToggleSave={onToggleSave}
    />
  </SectionCard>
);
