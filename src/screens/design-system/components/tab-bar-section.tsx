import { View } from "react-native";

import { GlassTabBar } from "@/components/ui/glass-tab-bar";

import { TABS, type TabKey } from "../constants";
import { SectionCard } from "./section-card";

type TabBarSectionProps = {
  tab: TabKey;
  onSelectTab: (tab: TabKey) => void;
};

export const TabBarSection = ({ tab, onSelectTab }: TabBarSectionProps) => (
  <SectionCard title="10. Bottom navigation (Liquid glass tab bar)">
    <View className="-mx-4 rounded-lg bg-lavender-subtle py-4">
      <GlassTabBar items={[...TABS]} activeKey={tab} onSelect={onSelectTab} />
    </View>
  </SectionCard>
);
