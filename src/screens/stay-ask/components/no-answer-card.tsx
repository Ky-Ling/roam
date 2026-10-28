import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { colors } from "@/theme"

/** Shown when nothing in the stay's data or Roam's policies answers the question. Never a guess. */
export const NoAnswerCard = () => (
  <View className="gap-2 rounded-xl bg-surface-muted p-4 corner-squircle">
    <View className="flex-row items-center gap-2">
      <Icon name="search" size={20} color={colors.inkSecondary} />
      <Text variant="body-medium" className="flex-1 font-jakarta-semibold">
        No answer found
      </Text>
    </View>
    <Text variant="body" tone="secondary">
      {"Nothing in this stay's rules or Roam's policies answers that. Contact Roam support."}
    </Text>
  </View>
)
