import { View } from "react-native"

import { IconButton } from "@/components/ui/icon-button"
import { Text } from "@/components/ui/text"
import { isEmpty } from "@/lib/utils"

type AskHeaderProps = {
  stayTitle: string
  topInset: number
  onBack: () => void
  onOpenPolicies?: () => void
}

/** Back, the screen title with the stay's name, and a shortcut to every policy word for word. */
export const AskHeader = ({ stayTitle, topInset, onBack, onOpenPolicies }: AskHeaderProps) => (
  <View
    className="flex-row items-center gap-3 border-b border-border bg-surface px-5 pb-3"
    style={{ paddingTop: topInset + 8 }}
  >
    <IconButton icon="back" variant="outline" size="md" accessibilityLabel="Back" onPress={onBack} />
    <View className="flex-1">
      <Text variant="title" accessibilityRole="header" numberOfLines={1}>
        Ask about this stay
      </Text>
      {!isEmpty(stayTitle) && (
        <Text variant="caption" tone="secondary" numberOfLines={1}>
          {stayTitle}
        </Text>
      )}
    </View>
    {onOpenPolicies && (
      <IconButton icon="document" size="md" accessibilityLabel="See all policies" onPress={onOpenPolicies} />
    )}
  </View>
)
