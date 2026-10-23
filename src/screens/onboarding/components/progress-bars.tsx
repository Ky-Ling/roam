import { View } from "react-native";

import { cx } from "@/lib/utils";

export const ProgressBars = ({ count, activeIndex }: { count: number; activeIndex: number }) => (
  <View
    accessible
    accessibilityRole="progressbar"
    accessibilityLabel={`Slide ${activeIndex + 1} of ${count}`}
    className="h-1 flex-row gap-2"
  >
    {Array.from({ length: count }, (_, i) => (
      <View key={i} className={cx("w-8 rounded-full", i === activeIndex ? "bg-lavender-strong" : "bg-border")} />
    ))}
  </View>
);
