import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { colors } from "@/theme"

export const RatingBox = ({ rating, reviewCount }: { rating: string, reviewCount: number }) => (
  <View
    accessible
    accessibilityLabel={`Rated ${rating} from ${reviewCount} reviews`}
    className="items-center rounded-lg bg-surface-muted px-4 py-2.5 corner-squircle"
  >
    <View className="flex-row items-center gap-1">
      <Icon name="star" size={22} color={colors.rating} filled />
      <Text variant="title">{rating}</Text>
    </View>
    <Text variant="body" tone="tertiary">
      ({reviewCount})
    </Text>
  </View>
)
