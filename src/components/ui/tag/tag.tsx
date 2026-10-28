import { View } from "react-native"

import { cx } from "@/lib/utils"

import { Icon, type IconName } from "../icon"
import { Text } from "../text"

const sizes = {
  md: { box: "h-8 gap-1.5 px-3", icon: 16, text: "caption" },
  /** Search result rows: two tags fit beside the photo. */
  sm: { box: "h-7 gap-1 px-2.5", icon: 14, text: "label" },
} as const

export type TagProps = { label: string, icon?: IconName, size?: keyof typeof sizes, className?: string }

/** Small neutral pill for facts like amenities. Not tappable. */
export const Tag = ({ label, icon, size = "md", className }: TagProps) => (
  <View className={cx("flex-row items-center self-start rounded-full bg-surface-muted", sizes[size].box, className)}>
    {icon && <Icon name={icon} size={sizes[size].icon} />}
    <Text variant={sizes[size].text} numberOfLines={1}>
      {label}
    </Text>
  </View>
)
