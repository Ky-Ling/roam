import { View } from "react-native"

import { Text } from "@/components/ui/text"
import { cx } from "@/lib/utils"

type CodeBoxProps = {
  digit?: string
  /** The box the next digit goes into, while the input is focused. */
  active: boolean
  error: boolean
}

// Same resting and focus treatment as TextField.
export const CodeBox = ({ digit, active, error }: CodeBoxProps) => (
  <View
    className={cx(
      "h-14 w-12 items-center justify-center rounded-lg corner-squircle",
      active ? "border-[1.5px] bg-lavender-subtle" : "border bg-surface-muted",
      error ? "border-danger" : active ? "border-lavender-strong" : "border-border",
    )}
  >
    <Text variant="title">{digit}</Text>
  </View>
)
