import { Image } from "expo-image"
import { View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { colors } from "@/theme"

type HostProfileProps = {
  name: string
  photoUrl: string | null
  superhost: boolean
}

/** Photo, name and the Superhost medal, centered at the top of the sheet. */
export const HostProfile = ({ name, photoUrl, superhost }: HostProfileProps) => (
  <View className="items-center gap-2">
    <View className="size-24 overflow-hidden rounded-full border-2 border-white bg-surface-muted shadow-raised">
      {photoUrl && (
        <Image
          source={{ uri: photoUrl }}
          accessibilityLabel={`Photo of ${name}`}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      )}
    </View>
    <Text variant="heading" accessibilityRole="header">
      {name}
    </Text>
    {superhost && (
      <View className="flex-row items-center gap-1.5">
        <Icon name="superhost" size={18} color={colors.bronze} />
        <Text variant="caption" tone="tertiary" className="font-jakarta">
          Superhost
        </Text>
      </View>
    )}
  </View>
)
