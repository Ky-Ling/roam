import { View } from "react-native";

import { Icon, type IconName } from "@/components/ui/icon";

import { SectionCard } from "./section-card";

const sheetIcons: IconName[] = ["home", "search", "heart", "calendar", "user", "settings", "pin", "filters"];

export const IconographySection = () => (
  <SectionCard title="11. Iconography">
    <View className="flex-row flex-wrap gap-3">
      {sheetIcons.map((name) => (
        <View key={name} className="size-12 items-center justify-center rounded-full border border-border bg-surface">
          <Icon name={name} />
        </View>
      ))}
    </View>
  </SectionCard>
);
