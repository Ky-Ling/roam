import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { colors } from "@/theme";

// PLACEHOLDER: trips arrive in a later plan.
export const TripsScreen = () => (
  <View className="flex-1 items-center justify-center gap-3 bg-surface px-6">
    <Icon name="calendar" size={40} color={colors.inkTertiary} />
    <Text variant="heading">Trips</Text>
    <Text tone="secondary" className="text-center">
      Your upcoming and past stays will show up here.
    </Text>
  </View>
);
