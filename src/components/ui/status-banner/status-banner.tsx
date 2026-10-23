import { Pressable, View } from "react-native"

import { cx } from "@/lib/utils"
import { colors } from "@/theme"

import { Icon } from "../icon"
import { Text } from "../text"

const tones = {
  success: {
    box: "bg-success-subtle",
    icon: "success",
    fill: colors.success,
    text: "success",
    dismiss: colors.successInk,
  },
  error: { box: "bg-danger-subtle", icon: "error", fill: colors.danger, text: "danger", dismiss: colors.danger },
} as const

export type StatusBannerProps = {
  tone: keyof typeof tones
  message: string
  onDismiss?: () => void
  className?: string
}

export const StatusBanner = ({ tone, message, onDismiss, className }: StatusBannerProps) => {
  const t = tones[tone]

  return (
    <View
      accessibilityRole="alert"
      className={cx("min-h-12 flex-row items-center gap-3 rounded-md px-4 py-3 corner-squircle", t.box, className)}
    >
      {/* Solid disc with a white glyph, as on the sheet */}
      <Icon name={t.icon} size={24} color={colors.white} filled={t.fill} />
      <Text variant="body-medium" tone={t.text} className="flex-1 font-jakarta">
        {message}
      </Text>
      {onDismiss && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          hitSlop={8}
          onPress={onDismiss}
          className="active:opacity-85"
        >
          <Icon name="close" size={22} color={t.dismiss} />
        </Pressable>
      )}
    </View>
  )
}
