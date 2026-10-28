import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { colors } from "@/theme"

/** Where a quoted policy text comes from. Every answer and policy shows one. */
export const SourceLabel = ({ source }: { source: string }) => (
  <View className="flex-row items-center gap-1.5">
    <Icon name="document" size={14} color={colors.inkTertiary} />
    <Text variant="caption" tone="tertiary" className="flex-1">
      {`Source: ${source}`}
    </Text>
  </View>
)
