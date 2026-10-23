import { View } from "react-native"

import { cx } from "@/lib/utils"

import { Icon, type IconName } from "../icon"
import { Text } from "../text"

/** Small neutral pill for facts like amenities. Not tappable. */
export const Tag = ({ label, icon, className }: { label: string, icon?: IconName, className?: string }) => (
  <View className={cx("h-8 flex-row items-center gap-1.5 self-start rounded-full bg-surface-muted px-3", className)}>
    {icon && <Icon name={icon} size={16} />}
    <Text variant="caption">{label}</Text>
  </View>
)
