import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { cx } from "@/lib/utils";
import { colors } from "@/theme";

import { Icon, type IconName } from "../icon";
import { IconButton } from "../icon-button";
import { Tag } from "../tag";
import { Text } from "../text";

export type ListingCardProps = {
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  amenities: { icon: IconName; label: string }[];
  pricePerNight: number;
  imageUrl: string;
  saved?: boolean;
  onToggleSave?: () => void;
  onPress?: () => void;
  className?: string;
};

export const ListingCard = ({
  title,
  location,
  rating,
  reviewCount,
  amenities,
  pricePerNight,
  imageUrl,
  saved,
  onToggleSave,
  onPress,
  className,
}: ListingCardProps) => (
  <View className={cx("rounded-xl bg-surface shadow-card corner-squircle", className)}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${location}, rated ${rating}, $${pricePerNight} per night`}
      onPress={onPress}
      className="flex-row gap-4 p-3 active:opacity-85"
    >
      <View className="size-32 overflow-hidden rounded-lg corner-squircle">
        <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} />
      </View>

      <View className="flex-1 gap-1.5">
        <Text variant="title" numberOfLines={2}>
          {title}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Icon name="pin" size={16} color={colors.inkTertiary} />
          <Text variant="caption" tone="tertiary" numberOfLines={1}>
            {location}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Icon name="star" size={16} color={colors.rating} filled />
          <Text variant="caption">
            {rating.toFixed(1)}{" "}
            <Text variant="caption" tone="tertiary">
              ({reviewCount})
            </Text>
          </Text>
        </View>
        <View className="flex-row flex-wrap gap-2">
          {amenities.map((a) => (
            <Tag key={a.label} icon={a.icon} label={a.label} />
          ))}
        </View>
        <Text variant="title">
          ${pricePerNight}{" "}
          <Text variant="body" tone="tertiary">
            / night
          </Text>
        </Text>
      </View>
    </Pressable>
    {/* Sibling of the card's Pressable, not a child: nested buttons break on web.
          Sits 8 in from the image's top-right corner (p-3 + 128 image - 8 - 36 button = left 96). */}
    <IconButton
      icon="heart"
      size="sm"
      variant="surface"
      active={saved}
      accessibilityLabel={saved ? "Remove from saved" : "Save stay"}
      onPress={onToggleSave}
      className="absolute left-24 top-5"
    />
  </View>
);
