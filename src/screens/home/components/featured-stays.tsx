import { View } from "react-native";
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";

import { DURATION, EASE_OUT } from "@/constants/motion";
import type { Stay } from "@/data/stays";

import { FeaturedStayCard } from "./featured-stay-card";

// A handful of cards, not a virtualized list, so per-card layout animations are safe.
// Cards that stay put slide into place; cards that leave or arrive fade.
const entering = FadeIn.duration(DURATION.enter).easing(EASE_OUT);
const exiting = FadeOut.duration(DURATION.exit);
const layout = LinearTransition.duration(220).easing(EASE_OUT);

export const FeaturedStays = ({ stays }: { stays: Stay[] }) => (
  <View className="gap-5">
    {stays.map((stay) => (
      <Animated.View key={stay.id} entering={entering} exiting={exiting} layout={layout}>
        <FeaturedStayCard stay={stay} />
      </Animated.View>
    ))}
  </View>
);
