import { Pressable } from "react-native"

import { cx } from "@/lib/utils"

import { Icon, type IconName } from "../icon"
import { Text } from "../text"

export type ListRowProps = {
  icon: IconName
  label: string
  onPress?: () => void
  className?: string
}

export const ListRow = ({ icon, label, onPress, className }: ListRowProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    className={cx("min-h-14 flex-row items-center gap-4 px-4 active:bg-surface-muted", className)}
  >
    <Icon name={icon} />
    <Text variant="body-medium" className="flex-1">
      {label}
    </Text>
    <Icon name="chevronRight" size={20} />
  </Pressable>
)
