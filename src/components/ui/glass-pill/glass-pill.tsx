import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect"
import { Pressable, StyleSheet } from "react-native"

import { cx, isNil } from "@/lib/utils"
import { colors } from "@/theme"

import { Icon, type IconName } from "../icon"
import { Text } from "../text"

// Never animate this pill's opacity: GlassView stops rendering under a parent with opacity 0.
const tones = {
  light: { fallback: "border border-white bg-glass", text: "ink", icon: colors.ink, tint: undefined },
  dark: { fallback: "border border-white/40 bg-scrim", text: "white", icon: colors.white, tint: colors.scrim },
} as const

const sizes = {
  sm: { box: "h-10 px-3.5", text: "caption" },
  md: { box: "h-11 px-5", text: "body-medium" },
} as const

const liquidGlass = isLiquidGlassAvailable()

export type GlassPillProps = {
  label: string
  icon?: IconName
  /** light for dark-on-light controls (Skip), dark for white text over a photo (location). */
  tone?: keyof typeof tones
  size?: keyof typeof sizes
  /** Makes the pill a button. Without it the pill is a static label. */
  onPress?: () => void
  className?: string
}

export const GlassPill = ({ label, icon, tone = "light", size = "md", onPress, className }: GlassPillProps) => {
  const t = tones[tone]
  const sz = sizes[size]

  return (
    <Pressable
      accessibilityRole={isNil(onPress) ? "text" : "button"}
      accessibilityLabel={label}
      disabled={isNil(onPress)}
      onPress={onPress}
      className={cx(
        "flex-row items-center gap-2 overflow-hidden rounded-full active:opacity-85",
        sz.box,
        !liquidGlass && t.fallback,
        className,
      )}
    >
      {liquidGlass && (
        <GlassView glassEffectStyle="regular" colorScheme={tone} tintColor={t.tint} style={StyleSheet.absoluteFill} />
      )}
      {icon && <Icon name={icon} size={18} color={t.icon} />}
      <Text variant={sz.text} tone={t.text}>
        {label}
      </Text>
    </Pressable>
  )
}
