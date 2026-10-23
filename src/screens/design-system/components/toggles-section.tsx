import { View } from "react-native"

import { Stepper } from "@/components/ui/stepper"
import { Toggle } from "@/components/ui/toggle"

import { SectionCard } from "./section-card"

type TogglesSectionProps = {
  instantBook: boolean
  onChangeInstantBook: (value: boolean) => void
  guests: number
  onChangeGuests: (value: number) => void
}

export const TogglesSection = ({ instantBook, onChangeInstantBook, guests, onChangeGuests }: TogglesSectionProps) => (
  <SectionCard title="13. Toggles / Steppers">
    <View className="flex-row items-center gap-6">
      <Toggle value={instantBook} onValueChange={onChangeInstantBook} accessibilityLabel="Instant book" />
      <Stepper value={guests} onChange={onChangeGuests} min={1} max={16} accessibilityLabel="Guests" />
    </View>
  </SectionCard>
)
