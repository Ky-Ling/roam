import type { ReactNode } from "react"
import { ActivityIndicator, Pressable, View } from "react-native"

import { cx } from "@/lib/utils"
import { colors } from "@/theme"

import { Icon, type IconName } from "../icon"
import { Text, type TextVariant } from "../text"

const variants = {
  primary: "bg-primary",
  secondary: "bg-surface border border-border",
} as const

const aligns = {
  center: "justify-center",
  /** Content from the left edge, so stacked buttons line their labels up (social sign-in). */
  start: "justify-start",
} as const

const sizes = {
  sm: "h-10 px-5",
  md: "h-14 px-6",
} as const

export type ButtonProps = {
  title: string
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  align?: keyof typeof aligns
  /** Label style. Social sign-in buttons use the smaller `caption`, as on the auth design. */
  titleVariant?: TextVariant
  /** Leading visual, e.g. a provider logo on a secondary button. */
  leading?: ReactNode
  /** Trailing icon, pinned to the right edge while the title stays centered. */
  trailingIcon?: IconName
  loading?: boolean
  disabled?: boolean
  onPress?: () => void
  className?: string
}

export const Button = ({
  title,
  variant = "primary",
  size = "md",
  align = "center",
  titleVariant = "button",
  leading,
  trailingIcon,
  loading,
  disabled,
  onPress,
  className,
}: ButtonProps) => {
  const inactive = disabled || loading

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      className={cx(
        "flex-row items-center gap-3 rounded-full active:opacity-85",
        // The spinner replaces the content, so it always sits in the middle.
        loading ? aligns.center : aligns[align],
        variants[variant],
        sizes[size],
        disabled && "opacity-40",
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color={colors.ink} />
      ) : (
        <>
          {leading}
          <Text variant={titleVariant}>{title}</Text>
          {trailingIcon && (
            <View className="absolute right-6">
              <Icon name={trailingIcon} />
            </View>
          )}
        </>
      )}
    </Pressable>
  )
}
