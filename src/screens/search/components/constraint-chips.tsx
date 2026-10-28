import { ScrollView } from "react-native"

import { Chip } from "@/components/ui/chip"

type ConstraintChipsProps = {
  chips: { key: string, label: string, selected: boolean }[]
  onToggle: (key: string) => void
}

/** What the sentence was understood to ask for. Tapping one turns it off or back on. */
export const ConstraintChips = ({ chips, onToggle }: ConstraintChipsProps) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className="-mx-5 grow-0"
    contentContainerClassName="gap-2.5 px-5"
  >
    {chips.map((c) => (
      <Chip key={c.key} label={c.label} size="sm" selected={c.selected} onPress={() => onToggle(c.key)} />
    ))}
  </ScrollView>
)
