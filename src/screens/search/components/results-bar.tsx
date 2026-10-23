import { Pressable, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

type ResultsBarProps = { countLabel: string; sortLabel: string; onOpenSort: () => void };

export const ResultsBar = ({ countLabel, sortLabel, onOpenSort }: ResultsBarProps) => (
  <View className="flex-row items-center justify-between">
    <Text variant="body-medium">{countLabel}</Text>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Sort by ${sortLabel}`}
      hitSlop={8}
      onPress={onOpenSort}
      className="flex-row items-center gap-1.5 active:opacity-85"
    >
      <Text variant="caption">
        Sort by <Text variant="caption" className="font-jakarta-bold">{sortLabel}</Text>
      </Text>
      <Icon name="chevronDown" size={18} />
    </Pressable>
  </View>
);
