import { View } from "react-native"

import { Icon, type IconName } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

/** Up to four amenities in equal columns. The paw is solid, as in the design; the rest are outlines. */
export const HighlightsRow = ({ highlights }: { highlights: { icon: IconName, label: string }[] }) => (
  <View className="flex-row">
    {highlights.map((h) => (
      <View key={h.label} className="flex-1 items-center gap-2">
        <Icon name={h.icon} size={28} strokeWidth={1.75} filled={h.icon === "pets"} />
        <Text variant="caption" numberOfLines={1} className="font-jakarta">
          {h.label}
        </Text>
      </View>
    ))}
  </View>
)
