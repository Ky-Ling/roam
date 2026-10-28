import { Pressable, View } from "react-native"

import { cx } from "@/lib/utils"
import { colors } from "@/theme"

import { Icon, type IconName } from "../icon"
import { Text } from "../text"

export type PolicyCardProps = {
  icon: IconName
  title: string
  description: string
  /** Sets the icon on a lavender tile. Off for the bare glyph, as on the details cancellation card. */
  iconBox?: boolean
  onPress?: () => void
  className?: string
}

export const PolicyCard = ({ icon, title, description, iconBox = true, onPress, className }: PolicyCardProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    className={cx(
      "flex-row items-center rounded-xl bg-lavender-subtle px-4 py-3.5 corner-squircle active:opacity-85",
      className,
    )}
  >
    <View className={cx("mr-4 size-12 items-center justify-center rounded-md corner-squircle", iconBox && "bg-lavender-muted")}>
      <Icon name={icon} color={colors.indigo} />
    </View>
    <View className="flex-1 gap-0.5">
      <Text variant="body-medium" className="font-jakarta-semibold">
        {title}
      </Text>
      <Text variant="footnote" tone="secondary" numberOfLines={2}>
        {description}
      </Text>
    </View>
    {/* A tighter gap and a 20 chevron leave the text column room for a one-line summary */}
    <View className="ml-2">
      <Icon name="chevronRight" size={20} color={colors.indigo} />
    </View>
  </Pressable>
)
