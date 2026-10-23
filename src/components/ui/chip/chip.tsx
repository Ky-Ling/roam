import { Pressable } from "react-native";

import { cx } from "@/lib/utils";
import { colors } from "@/theme";

import { Icon, type IconName } from "../icon";
import { Text } from "../text";

const tones = {
  /** Filter chips (Cabins, Under $300, ...). */
  lavender: { box: "h-12 px-6", selected: "bg-lavender" },
  /** Category chips with an icon (All Stays, Cabins, Beach, ...). */
  primary: { box: "h-10 px-4 gap-2", selected: "bg-primary" },
} as const;

export type ChipProps = {
  label: string;
  tone?: keyof typeof tones;
  icon?: IconName;
  selected?: boolean;
  onPress?: () => void;
  className?: string;
};

export const Chip = ({ label, tone = "lavender", icon, selected, onPress, className }: ChipProps) => {
  const t = tones[tone];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={onPress}
      className={cx(
        "flex-row items-center justify-center rounded-full active:opacity-85",
        t.box,
        selected ? t.selected : "bg-surface-muted",
        className,
      )}
    >
      {icon && <Icon name={icon} size={20} color={colors.ink} filled={selected} />}
      {tone === "lavender" ? (
        <Text variant="body-medium" className={selected ? "font-jakarta-semibold" : undefined}>
          {label}
        </Text>
      ) : (
        <Text variant="caption">{label}</Text>
      )}
    </Pressable>
  );
};
