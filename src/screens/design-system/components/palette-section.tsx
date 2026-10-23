import { View } from "react-native"

import { Text } from "@/components/ui/text"

import { SectionCard } from "./section-card"

const palette = [
  { name: "Primary Yellow", value: "#FFC629", className: "bg-primary" },
  { name: "Lavender", value: "#C9B4FF", className: "bg-lavender" },
  { name: "Text Primary", value: "#0B0B1A", className: "bg-ink" },
  { name: "Text Secondary", value: "#6B7280", className: "bg-ink-secondary" },
  { name: "Surface White", value: "#FFFFFF", className: "bg-surface border border-border" },
  { name: "Surface Gray", value: "#F4F4F7", className: "bg-surface-muted" },
  { name: "Border Gray", value: "#E5E7EB", className: "bg-border" },
  { name: "Glass Blur", value: "rgba(255,255,255,0.7)", className: "bg-glass border border-border" },
] as const

const extendedPalette = [
  "bg-primary-subtle",
  "bg-lavender-strong",
  "bg-lavender-subtle",
  "bg-lavender-muted",
  "bg-indigo",
  "bg-ink-tertiary",
  "bg-rating",
  "bg-success",
  "bg-success-subtle",
  "bg-success-ink",
  "bg-danger",
  "bg-danger-subtle",
  "bg-info-subtle",
  "bg-info-ink",
] as const

export const PaletteSection = () => (
  <SectionCard title="02. Color palette">
    <View className="flex-row flex-wrap gap-3">
      {palette.map((swatch) => (
        <View key={swatch.name} className="w-24 gap-1.5">
          <View className={`h-16 rounded-md corner-squircle ${swatch.className}`} />
          <Text variant="label" className="font-jakarta-semibold">
            {swatch.name}
          </Text>
          <Text variant="label" tone="tertiary">
            {swatch.value}
          </Text>
        </View>
      ))}
    </View>
    <Text variant="caption" tone="secondary">
      Supporting tokens
    </Text>
    <View className="flex-row flex-wrap gap-2">
      {extendedPalette.map((c) => (
        <View key={c} className="items-center gap-1">
          <View className={`size-10 rounded-sm ${c}`} />
          <Text variant="label" tone="tertiary">
            {c.replace("bg-", "")}
          </Text>
        </View>
      ))}
    </View>
  </SectionCard>
)
