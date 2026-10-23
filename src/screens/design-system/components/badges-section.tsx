import { View } from "react-native"

import { Badge } from "@/components/ui/badge"
import { GlassPill } from "@/components/ui/glass-pill"

import { SectionCard } from "./section-card"

export const BadgesSection = () => (
  <SectionCard title="15. Tags / Badges">
    <View className="flex-row flex-wrap gap-3">
      <Badge tone="highlight" icon="star" label="Guest favorite" />
      <Badge tone="success" label="New" />
      <Badge tone="sale" label="20% off" />
      <Badge tone="info" label="Superhost" />
    </View>
    <View className="flex-row items-center gap-3 rounded-lg bg-ink-tertiary p-4 corner-squircle">
      <GlassPill label="Skip" onPress={() => {}} />
      <GlassPill label="Whistler, BC" icon="pin" tone="dark" size="sm" />
    </View>
  </SectionCard>
)
