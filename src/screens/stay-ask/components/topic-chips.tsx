import { ScrollView } from "react-native"

import { Chip } from "@/components/ui/chip"
import { cx } from "@/lib/utils"

type TopicChipsProps = {
  chips: { key: string, label: string, question: string }[]
  disabled: boolean
  onAsk: (question: string) => void
}

// Inline rather than -mx-5, which no other screen proves on native: the row scrolls to the screen edges
const bleed = { marginHorizontal: -20 }

/** One tap sends a topic's question, the same as typing it. */
export const TopicChips = ({ chips, disabled, onAsk }: TopicChipsProps) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    style={bleed}
    className={cx(disabled && "opacity-40")}
    contentContainerClassName="gap-2 px-5"
  >
    {chips.map((chip) => (
      <Chip key={chip.key} label={chip.label} size="sm" onPress={() => onAsk(chip.question)} />
    ))}
  </ScrollView>
)
