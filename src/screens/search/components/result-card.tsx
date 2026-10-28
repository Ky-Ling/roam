import { Image } from "expo-image"
import { Pressable, StyleSheet, View } from "react-native"

import { Icon, type IconName } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { Tag } from "@/components/ui/tag"
import { Text } from "@/components/ui/text"
import { colors } from "@/theme"

export type ResultCardProps = {
  title: string
  location: string
  rating: number
  reviewCount: number
  tags: { icon: IconName, label: string }[]
  pricePerNight: number
  photoUrl: string | null
  photoAlt?: string
  saved?: boolean
  onToggleSave?: () => void
  onPress?: () => void
}

/** One search result: photo on the left, facts on the right, heart in the top-right corner. */
export const ResultCard = ({
  title,
  location,
  rating,
  reviewCount,
  tags,
  pricePerNight,
  photoUrl,
  photoAlt,
  saved,
  onToggleSave,
  onPress,
}: ResultCardProps) => (
  <View>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${location}, rated ${rating}, $${pricePerNight} per night`}
      onPress={onPress}
      className="flex-row gap-3 active:opacity-85"
    >
      <View className="h-36 w-34 overflow-hidden rounded-md bg-surface-muted corner-squircle">
        {photoUrl && (
          <Image
            source={{ uri: photoUrl }}
            accessibilityLabel={photoAlt}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            transition={200}
          />
        )}
      </View>

      <View className="flex-1 justify-center gap-1.5">
        {/* pr-12 keeps the title clear of the heart */}
        <Text variant="title" numberOfLines={2} className="pr-12">
          {title}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Icon name="pin" size={16} color={colors.inkTertiary} />
          <Text variant="caption" tone="tertiary" numberOfLines={1} className="flex-1">
            {location}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Icon name="star" size={18} color={colors.rating} filled />
          <Text variant="body">
            {rating.toFixed(1)}{" "}
            <Text variant="body" tone="tertiary">
              ({reviewCount})
            </Text>
          </Text>
        </View>
        <View className="flex-row gap-2 overflow-hidden">
          {tags.map((t) => (
            <Tag key={t.label} icon={t.icon} label={t.label} size="sm" />
          ))}
        </View>
        <Text variant="price">
          ${pricePerNight}{" "}
          <Text variant="caption" tone="tertiary">
            / night
          </Text>
        </Text>
      </View>
    </Pressable>
    {/* Sibling of the row's Pressable, not a child: nested buttons break on web */}
    <IconButton
      icon="heart"
      size="md"
      active={saved}
      accessibilityLabel={saved ? "Remove from saved" : "Save stay"}
      onPress={onToggleSave}
      className="absolute right-0 top-0"
    />
  </View>
)
