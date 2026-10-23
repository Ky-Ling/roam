import { Text } from "@/components/ui/text"
import { Wordmark } from "@/components/ui/wordmark"

import { SectionCard } from "./section-card"

export const BrandSection = () => (
  <SectionCard title="01. Brand">
    <Wordmark size="lg" />
    <Text variant="heading" tone="tertiary" className="font-jakarta">
      Find unforgettable stays for every kind of trip.
    </Text>
  </SectionCard>
)
