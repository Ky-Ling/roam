import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { colors } from "@/theme";

type EmptyResultsProps = { canClear: boolean; onClear: () => void };

export const EmptyResults = ({ canClear, onClear }: EmptyResultsProps) => (
  <View className="items-center gap-3 px-6 pt-16">
    <Icon name="search" size={36} color={colors.inkTertiary} />
    <Text variant="title">No stays match that</Text>
    <Text tone="secondary" className="text-center">
      Try turning a filter off, or describe your stay another way.
    </Text>
    {canClear && <Button title="Clear filters" variant="secondary" size="sm" onPress={onClear} className="mt-2" />}
  </View>
);
