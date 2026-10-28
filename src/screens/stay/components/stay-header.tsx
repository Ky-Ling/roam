import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { colors } from "@/theme"

import { RatingBox } from "./rating-box"

type StayHeaderProps = {
  title: string
  location: string
  rating: string
  reviewCount: number
}

/** Title and place on the left, rating box on the right. */
export const StayHeader = ({ title, location, rating, reviewCount }: StayHeaderProps) => (
  <View className="flex-row items-start gap-3">
    <View className="flex-1 gap-2.5">
      <Text variant="heading-lg" accessibilityRole="header" numberOfLines={2}>
        {title}
      </Text>
      <View className="flex-row items-center gap-2">
        <Icon name="pin" size={20} color={colors.white} filled={colors.ink} />
        <Text variant="body" numberOfLines={1} className="flex-1">
          {location}
        </Text>
      </View>
    </View>
    <RatingBox rating={rating} reviewCount={reviewCount} />
  </View>
)
