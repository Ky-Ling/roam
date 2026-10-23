import { Pressable, StyleSheet, View } from "react-native"
import Animated from "react-native-reanimated"

import { CSS_EASE_OUT, DURATION } from "@/constants/motion"
import { cx } from "@/lib/utils"
import { colors } from "@/theme"

import { Icon, type IconName } from "../icon"
import { Text } from "../text"

const tones = {
  /** Filter chips (Cabins, Under $300, ...). */
  lavender: { box: "h-12 px-6", selected: colors.lavender },
  /** Category chips with an icon (All Stays, Cabins, Beach, ...). */
  primary: { box: "h-10 px-4 gap-2", selected: colors.primary },
} as const

/** lg is the home screen's category row: same chip, taller. */
const largeBox = "h-12 px-4 gap-2"

export type ChipProps = {
  label: string
  tone?: keyof typeof tones
  icon?: IconName
  size?: "md" | "lg"
  selected?: boolean
  onPress?: () => void
  className?: string
}

export const Chip = ({ label, tone = "lavender", icon, size = "md", selected, onPress, className }: ChipProps) => {
  const t = tones[tone]

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      className={cx("overflow-hidden rounded-full active:opacity-85", className)}
    >
      {/* The fill crossfades between muted and the tone, so selecting reads as one change */}
      <Animated.View
        style={[fill, { backgroundColor: selected ? t.selected : colors.surfaceMuted }]}
      />
      <View className={cx("flex-row items-center justify-center", size === "lg" ? largeBox : t.box)}>
        {icon && <Icon name={icon} size={20} color={colors.ink} filled={selected} />}
        {tone === "lavender" ? (
          <Text variant="body-medium" className={selected ? "font-jakarta-semibold" : undefined}>
            {label}
          </Text>
        ) : (
          <Text variant="caption">{label}</Text>
        )}
      </View>
    </Pressable>
  )
}

// Plain object, not StyleSheet.create: RN's own style types don't know Reanimated's easing objects
const fill = {
  ...StyleSheet.absoluteFill,
  transitionProperty: "backgroundColor",
  transitionDuration: DURATION.state,
  transitionTimingFunction: CSS_EASE_OUT,
} as const
