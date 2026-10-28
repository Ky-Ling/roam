import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

import { SectionCard } from "./section-card"

export const TypographySection = () => (
  <SectionCard title="03. Typography">
    <Text variant="display">Find your next stay</Text>
    <Text variant="hero">Find a stay that fits your story</Text>
    <Text variant="headline">Create your account</Text>
    <Text variant="heading">Modern Cabin with Hot Tub</Text>
    <Text variant="title">Modern Cabin with Hot Tub</Text>
    <Text variant="price">
      $289{" "}
      <Text variant="caption" tone="tertiary">
        / night
      </Text>
    </Text>
    <Text variant="body" tone="secondary">
      From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.
    </Text>
    <Text variant="lead" tone="secondary">
      Lead · intro paragraph under a hero or heading, with a tighter line rhythm than body.
    </Text>
    <Text variant="caption">Lake Arrowhead, CA</Text>
    <Button title="Book this stay" size="sm" className="self-start" />
    <Text variant="label" tone="secondary">
      Label · tab bar
    </Text>
  </SectionCard>
)
