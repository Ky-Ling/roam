import type { ReactNode } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

import { cx } from "@/lib/utils";
import { colors } from "@/theme";

import { Icon, type IconName } from "../icon";
import { Text } from "../text";

const variants = {
  primary: "bg-primary",
  secondary: "bg-surface border border-border",
} as const;

const sizes = {
  sm: "h-10 px-5",
  md: "h-14 px-6",
} as const;

export type ButtonProps = {
  title: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Leading visual, e.g. a provider logo on a secondary button. */
  leading?: ReactNode;
  /** Trailing icon, pinned to the right edge while the title stays centered. */
  trailingIcon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
};

export const Button = ({
  title,
  variant = "primary",
  size = "md",
  leading,
  trailingIcon,
  loading,
  disabled,
  onPress,
  className,
}: ButtonProps) => {
  const inactive = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      onPress={onPress}
      className={cx(
        "flex-row items-center justify-center gap-3 rounded-full active:opacity-85",
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
          <Text variant="button">{title}</Text>
          {trailingIcon && (
            <View className="absolute right-6">
              <Icon name={trailingIcon} />
            </View>
          )}
        </>
      )}
    </Pressable>
  );
};
