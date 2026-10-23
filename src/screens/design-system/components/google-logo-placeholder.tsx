import { View } from "react-native";

import { Text } from "@/components/ui/text";

// PLACEHOLDER: no Google logo asset yet. Replace with the official "G" mark.
export const GoogleLogoPlaceholder = () => (
  <View className="size-6 items-center justify-center rounded-full bg-border">
    <Text variant="label" className="font-jakarta-bold">
      G
    </Text>
  </View>
);
