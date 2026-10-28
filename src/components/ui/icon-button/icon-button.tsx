import { Pressable } from "react-native"

import { cx } from "@/lib/utils"
import { colors } from "@/theme"

import { Icon, type IconName } from "../icon"

const variants = {
  muted: "bg-surface-muted",
  /** White with a lift, for buttons sitting on photos. */
  surface: "bg-surface shadow-raised",
  /** White with a hairline outline, for the back button on white screens. */
  outline: "bg-surface border border-border",
  /** Yellow, for the one action a row exists for (send). */
  primary: "bg-primary",
} as const

const sizes = {
  sm: { box: "size-9", icon: 18 },
  md: { box: "size-12", icon: 22 },
  lg: { box: "size-14", icon: 24 },
} as const

export type IconButtonProps = {
  icon: IconName
  /** Required: there is no visible text. */
  accessibilityLabel: string
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  /** Filled glyph, e.g. a saved heart. */
  active?: boolean
  disabled?: boolean
  onPress?: () => void
  className?: string
}

export const IconButton = ({
  icon,
  accessibilityLabel,
  variant = "muted",
  size = "lg",
  active,
  disabled,
  onPress,
  className,
}: IconButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    accessibilityState={{ disabled: !!disabled, selected: active }}
    hitSlop={size === "sm" ? 4 : undefined}
    disabled={disabled}
    onPress={onPress}
    className={cx(
      "items-center justify-center rounded-full active:opacity-85",
      variants[variant],
      sizes[size].box,
      disabled && "opacity-40",
      className,
    )}
  >
    <Icon name={icon} size={sizes[size].icon} filled={active} color={colors.ink} />
  </Pressable>
)
