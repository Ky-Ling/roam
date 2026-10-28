import { Image } from "expo-image"
import { Pressable, View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { colors } from "@/theme"

type HostRowProps = {
  name: string
  photoUrl: string | null
  subtitle: string | null
  superhost: boolean
  onPress: () => void
}

/** Who hosts the stay. Opens the host sheet. */
export const HostRow = ({ name, photoUrl, subtitle, superhost, onPress }: HostRowProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={`About your host, ${name}`}
    onPress={onPress}
    className="flex-row items-center gap-4 border-t border-border py-2.5 active:opacity-85"
  >
    <View className="size-16 overflow-hidden rounded-full border-2 border-white bg-surface-muted shadow-raised">
      {photoUrl && <Image source={{ uri: photoUrl }} style={{ width: "100%", height: "100%" }} contentFit="cover" />}
    </View>
    <View className="flex-1 gap-0.5">
      <Text variant="title" numberOfLines={1}>
        Hosted by {name}
      </Text>
      {subtitle && (
        <View className="flex-row items-center gap-1.5">
          {superhost && <Icon name="superhost" size={18} color={colors.bronze} />}
          <Text variant="caption" tone="tertiary" className="font-jakarta">
            {subtitle}
          </Text>
        </View>
      )}
    </View>
    <Icon name="chevronRight" size={24} />
  </Pressable>
)
