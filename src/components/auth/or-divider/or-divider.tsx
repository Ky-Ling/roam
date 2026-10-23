import { View } from "react-native";

import { Text } from "@/components/ui/text";

export const OrDivider = () => (
  <View className="flex-row items-center gap-4">
    <View className="h-px flex-1 bg-border" />
    <Text variant="caption" tone="tertiary">
      or
    </Text>
    <View className="h-px flex-1 bg-border" />
  </View>
);
