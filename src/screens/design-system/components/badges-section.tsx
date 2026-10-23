import { View } from "react-native";

import { Badge } from "@/components/ui/badge";

import { SectionCard } from "./section-card";

export const BadgesSection = () => (
  <SectionCard title="15. Tags / Badges">
    <View className="flex-row flex-wrap gap-3">
      <Badge tone="highlight" icon="star" label="Guest favorite" />
      <Badge tone="success" label="New" />
      <Badge tone="sale" label="20% off" />
      <Badge tone="info" label="Superhost" />
    </View>
  </SectionCard>
);
