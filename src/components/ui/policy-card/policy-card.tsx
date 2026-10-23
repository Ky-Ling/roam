import { Pressable, View } from "react-native";

import { cx } from "@/lib/utils";
import { colors } from "@/theme";

import { Icon, type IconName } from "../icon";
import { Text } from "../text";

export type PolicyCardProps = {
  icon: IconName;
  title: string;
  description: string;
  onPress?: () => void;
  className?: string;
};

export const PolicyCard = ({ icon, title, description, onPress, className }: PolicyCardProps) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    className={cx(
      "flex-row items-center gap-4 rounded-xl bg-lavender-subtle p-4 corner-squircle active:opacity-85",
      className,
    )}
  >
    <View className="size-12 items-center justify-center rounded-md bg-lavender-muted corner-squircle">
      <Icon name={icon} color={colors.indigo} />
    </View>
    <View className="flex-1 gap-0.5">
      <Text variant="body-medium" className="font-jakarta-semibold">
        {title}
      </Text>
      <Text variant="caption" tone="secondary" className="font-jakarta" numberOfLines={2}>
        {description}
      </Text>
    </View>
    <Icon name="chevronRight" color={colors.indigo} />
  </Pressable>
);
