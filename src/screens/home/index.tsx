import { ScrollView } from "react-native";
import Animated from "react-native-reanimated";

import { staggeredEntrance } from "@/lib/motion";

import { CategoryChips, FeaturedStays, HomeHeader, HomeHero, HomeSearchBar } from "./components";
import { SEARCH_EXAMPLE } from "./constants";
import { useHome } from "./use-home";

// The ScrollView is the screen's first child, so native tabs inset it for the status and tab bars.
export const HomeScreen = () => {
  const vm = useHome();

  return (
    <ScrollView
      className="flex-1 bg-surface"
      // Web's native tabs float a bar over the top of the screen instead of sitting at the bottom
      contentContainerClassName="gap-6 px-5 pb-8 pt-2 web:pt-24"
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      <Animated.View entering={staggeredEntrance(0, vm.reducedMotion)}>
        <HomeHeader avatarUrl={vm.avatarUrl} initial={vm.initial} />
      </Animated.View>
      <Animated.View entering={staggeredEntrance(1, vm.reducedMotion)}>
        <HomeHero name={vm.name} onOpenSearch={vm.openSearch} />
      </Animated.View>
      <Animated.View entering={staggeredEntrance(2, vm.reducedMotion)}>
        <HomeSearchBar
          value={vm.query}
          placeholder={SEARCH_EXAMPLE}
          onChangeText={vm.setQuery}
          onSubmit={vm.submitSearch}
        />
      </Animated.View>
      <Animated.View entering={staggeredEntrance(3, vm.reducedMotion)}>
        <CategoryChips selected={vm.category} onSelect={vm.setCategory} />
      </Animated.View>
      <Animated.View entering={staggeredEntrance(4, vm.reducedMotion)}>
        <FeaturedStays stays={vm.featured} />
      </Animated.View>
    </ScrollView>
  );
};
