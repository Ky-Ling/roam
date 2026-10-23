import { View } from "react-native";

import { Chip } from "@/components/ui/chip";

import { CATEGORIES, type Category } from "../constants";

type CategoryChipsProps = { selected: Category; onSelect: (category: Category) => void };

export const CategoryChips = ({ selected, onSelect }: CategoryChipsProps) => (
  <View className="flex-row flex-wrap gap-3">
    {CATEGORIES.map((c) => (
      <Chip
        key={c.key}
        tone="primary"
        size="lg"
        icon={c.icon}
        label={c.label}
        selected={selected === c.key}
        onPress={() => onSelect(c.key)}
      />
    ))}
  </View>
);
