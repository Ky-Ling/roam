import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { Pressable, StyleSheet, View } from "react-native";

import { cx } from "@/lib/utils";
import { colors } from "@/theme";

import { Icon, type IconName } from "../icon";
import { Text } from "../text";

export type TabItem<K extends string> = { key: K; label: string; icon: IconName };

export type GlassTabBarProps<K extends string> = {
  items: TabItem<K>[];
  activeKey: K;
  onSelect: (key: K) => void;
  /** The caller adds the bottom safe-area inset. */
  className?: string;
};

const liquidGlass = isLiquidGlassAvailable();

export const GlassTabBar = <K extends string>({ items, activeKey, onSelect, className }: GlassTabBarProps<K>) => (
  <View
    accessibilityRole="tablist"
    className={cx(
      "mx-4 h-18 flex-row items-center overflow-hidden rounded-full px-1 shadow-float",
      !liquidGlass && "border border-white bg-glass",
      className,
    )}
  >
    {liquidGlass && <GlassView glassEffectStyle="regular" colorScheme="light" style={StyleSheet.absoluteFill} />}
    {items.map((item) => {
      const active = item.key === activeKey;

      return (
        <Pressable
          key={item.key}
          accessibilityRole="tab"
          accessibilityLabel={item.label}
          accessibilityState={{ selected: active }}
          onPress={() => onSelect(item.key)}
          className="flex-1 items-center justify-center active:opacity-85"
        >
          <View className={cx("size-16 items-center justify-center gap-0.5 rounded-full", active && "bg-primary")}>
            <Icon name={item.icon} color={colors.ink} filled={active} />
            <Text variant="label">{item.label}</Text>
          </View>
        </Pressable>
      );
    })}
  </View>
);
