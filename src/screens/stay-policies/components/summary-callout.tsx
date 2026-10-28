import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { colors } from "@/theme"

/** The policy's one-line summary, styled like the details screen's cancellation card. */
export const SummaryCallout = ({ summary }: { summary: string }) => (
  <View className="flex-row items-center gap-3 rounded-xl bg-lavender-subtle px-4 py-3.5 corner-squircle">
    <Icon name="document" color={colors.indigo} />
    <Text variant="body-medium" className="flex-1">
      {summary}
    </Text>
  </View>
)
