import { Image } from "expo-image"
import { Pressable, StyleSheet, View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { sanityImageUrl, type FeaturedStay } from "@/lib/sanity"
import { colors } from "@/theme"

// Twice the card's on-screen size, for sharp photos on 2x and 3x screens
const PHOTO_SIZE = { width: 1200, height: 960 }

// Darkens the photo's lower half so the white title reads on any image. One-off value, so it stays here.
const scrim = { experimental_backgroundImage: "linear-gradient(to bottom, transparent 35%, rgba(11, 11, 26, 0.75))" }

/** Full-width photo card. Opens the stay. */
export const FeaturedStayCard = ({ stay, onPress }: { stay: FeaturedStay, onPress: () => void }) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    accessibilityLabel={`${stay.title}, ${stay.city}, ${stay.region}, rated ${stay.rating}`}
    className="h-70 overflow-hidden rounded-2xl bg-surface-muted corner-squircle active:opacity-85"
  >
    {stay.photo && (
      <Image
        source={{ uri: sanityImageUrl(stay.photo, PHOTO_SIZE) }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={200}
      />
    )}
    <View style={[StyleSheet.absoluteFill, scrim]} />

    <View className="absolute right-4 top-4 h-11 flex-row items-center gap-1.5 rounded-full bg-surface px-3.5">
      <Icon name="star" size={18} filled />
      <Text variant="title">{stay.rating.toFixed(1)}</Text>
    </View>

    <View className="absolute bottom-5 left-5 right-24 gap-1">
      <View className="flex-row items-center gap-1.5">
        <Icon name="pin" size={16} color={colors.white} />
        <Text variant="caption" tone="white" numberOfLines={1}>
          {stay.city}, {stay.region}
        </Text>
      </View>
      <Text variant="heading" tone="white" numberOfLines={2}>
        {stay.title}
      </Text>
    </View>

    <View className="absolute bottom-5 right-5 size-14 items-center justify-center rounded-full bg-surface">
      <Icon name="chevronRight" size={24} />
    </View>
  </Pressable>
)
