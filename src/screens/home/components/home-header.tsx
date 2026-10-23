import { Image } from "expo-image"
import { View } from "react-native"

import { Text } from "@/components/ui/text"
import { Wordmark } from "@/components/ui/wordmark"

type HomeHeaderProps = { avatarUrl?: string, initial: string }

export const HomeHeader = ({ avatarUrl, initial }: HomeHeaderProps) => (
  <View className="flex-row items-center justify-between">
    <Wordmark size="md" />
    <View
      accessibilityRole="image"
      accessibilityLabel="Your profile photo"
      className="size-22 items-center justify-center overflow-hidden rounded-full bg-primary-subtle"
    >
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={{ width: "100%", height: "100%" }} contentFit="cover" transition={200} />
      ) : (
        <Text variant="heading">{initial}</Text>
      )}
    </View>
  </View>
)
