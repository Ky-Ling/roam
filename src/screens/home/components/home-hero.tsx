import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Text } from "@/components/ui/text";

type HomeHeroProps = { name: string; onOpenSearch: () => void };

export const HomeHero = ({ name, onOpenSearch }: HomeHeroProps) => (
  <View className="flex-row items-end gap-4">
    <View className="flex-1 gap-2">
      <Text variant="title" tone="secondary">
        Hey, {name} 👋
      </Text>
      <Text variant="hero" accessibilityRole="header">
        Find your{"\n"}next stay
      </Text>
    </View>
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Open search"
      onPress={onOpenSearch}
      className="h-22 w-16 items-center justify-center rounded-2xl bg-surface-muted corner-squircle"
    >
      <Icon name="search" size={28} />
    </PressableScale>
  </View>
);
