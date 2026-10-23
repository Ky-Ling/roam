import { View } from "react-native";

import { cx } from "@/lib/utils";
import { colors } from "@/theme";

import { Icon, type IconName } from "../icon";
import { Text } from "../text";

const tones = {
  highlight: { box: "bg-primary-subtle", text: "ink" },
  success: { box: "bg-success-subtle", text: "success" },
  sale: { box: "bg-danger-subtle", text: "ink" },
  info: { box: "bg-info-subtle", text: "info" },
} as const;

export type BadgeProps = {
  label: string;
  tone?: keyof typeof tones;
  icon?: IconName;
  className?: string;
};

export const Badge = ({ label, tone = "highlight", icon, className }: BadgeProps) => {
  const t = tones[tone];

  return (
    <View className={cx("h-8 flex-row items-center gap-1.5 self-start rounded-full px-4", t.box, className)}>
      {icon && <Icon name={icon} size={18} color={colors.ink} filled={colors.primary} strokeWidth={1.75} />}
      <Text variant="caption" tone={t.text} className="font-jakarta">
        {label}
      </Text>
    </View>
  );
};
