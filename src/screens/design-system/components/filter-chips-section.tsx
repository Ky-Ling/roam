import { View } from "react-native"

import { Chip } from "@/components/ui/chip"
import type { IconName } from "@/components/ui/icon"

import { SectionCard } from "./section-card"

const filters = ["Cabins", "Under $300", "Pet Friendly", "Quiet"] as const

const categories: { label: string, icon: IconName }[] = [
  { label: "All Stays", icon: "home" },
  { label: "Cabins", icon: "cabins" },
  { label: "Beach", icon: "beach" },
  { label: "City", icon: "city" },
  { label: "Villas", icon: "villas" },
]

type FilterChipsSectionProps = {
  filter: string
  onSelectFilter: (filter: string) => void
  category: string
  onSelectCategory: (category: string) => void
}

export const FilterChipsSection = ({ filter, onSelectFilter, category, onSelectCategory }: FilterChipsSectionProps) => (
  <SectionCard title="06. Filter chips">
    <View className="flex-row flex-wrap gap-3">
      {filters.map((f) => (
        <Chip key={f} label={f} selected={filter === f} onPress={() => onSelectFilter(f)} />
      ))}
    </View>
    {/* sm: the search screen's constraint row */}
    <View className="flex-row flex-wrap gap-2.5">
      {filters.map((f) => (
        <Chip key={f} label={f} size="sm" selected={filter === f} onPress={() => onSelectFilter(f)} />
      ))}
    </View>
    <View className="flex-row flex-wrap gap-2">
      {categories.map((c) => (
        <Chip
          key={c.label}
          tone="primary"
          icon={c.icon}
          label={c.label}
          selected={category === c.label}
          onPress={() => onSelectCategory(c.label)}
        />
      ))}
    </View>
  </SectionCard>
)
