import { Pressable, View } from "react-native"

import { cx } from "@/lib/utils"
import { colors } from "@/theme"

import { Icon, type IconName } from "../icon"
import { Text } from "../text"

export type SegmentOption<T extends string> = { value: T, label: string, icon?: IconName }

export type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) => (
  <View accessibilityRole="tablist" className={cx("h-13 flex-row rounded-full bg-surface-muted p-1", className)}>
    {options.map((option) => {
      const active = option.value === value

      return (
        <Pressable
          key={option.value}
          accessibilityRole="tab"
          accessibilityState={{ selected: active }}
          onPress={() => onChange(option.value)}
          className={cx(
            "flex-1 flex-row items-center justify-center gap-2 rounded-full active:opacity-85",
            active && "bg-ink",
          )}
        >
          {option.icon && <Icon name={option.icon} size={20} color={active ? colors.white : colors.ink} />}
          <Text variant="body-medium" tone={active ? "white" : "ink"}>
            {option.label}
          </Text>
        </Pressable>
      )
    })}
  </View>
)
