import { Image } from "expo-image"
import { Pressable, StyleSheet, View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { colors } from "@/theme"

import type { HostStayView } from "../utils"

type HostStayRowProps = Omit<HostStayView, "id"> & { onPress: () => void }

/** Another stay by the same host. Opens its details. */
export const HostStayRow = ({ title, location, rating, price, coverUrl, coverAlt, onPress }: HostStayRowProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`${title}, ${location}, rated ${rating}, ${price} per night`}
    onPress={onPress}
    className="flex-row items-center gap-3 active:opacity-85"
  >
    <View className="size-16 overflow-hidden rounded-md bg-surface-muted corner-squircle">
      {coverUrl && (
        <Image
          source={{ uri: coverUrl }}
          accessibilityLabel={coverAlt}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
        />
      )}
    </View>
    <View className="flex-1 gap-0.5">
      <Text variant="body-medium" className="font-jakarta-semibold" numberOfLines={1}>
        {title}
      </Text>
      <Text variant="caption" tone="tertiary" numberOfLines={1}>
        {location}
      </Text>
      <View className="flex-row items-center gap-1">
        <Icon name="star" size={14} color={colors.rating} filled />
        <Text variant="caption">
          {rating} · {price}{" "}
          <Text variant="caption" tone="tertiary">
            / night
          </Text>
        </Text>
      </View>
    </View>
    <Icon name="chevronRight" size={20} color={colors.inkTertiary} />
  </Pressable>
)
