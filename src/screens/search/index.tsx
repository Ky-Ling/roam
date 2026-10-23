import { View } from "react-native"
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated"

import { ListingCard } from "@/components/ui/listing-card"
import { DURATION, EASE_OUT } from "@/constants/motion"

import { ConstraintChips, EmptyResults, ResultsBar, SearchHeader } from "./components"
import { useSearch } from "./use-search"

// Rows are virtualized, so they never get `entering`: the list fades in as a whole on a new sentence,
// and rows slide into place when a chip changes what matches.
const listEntering = FadeIn.duration(DURATION.enter).easing(EASE_OUT)
const rowLayout = LinearTransition.duration(220).easing(EASE_OUT)

// Reanimated components don't take className. These are the spacing tokens gap-3 px-5 pb-6.
const listContent = { gap: 12, paddingHorizontal: 20, paddingBottom: 24 }

export const SearchScreen = () => {
  const vm = useSearch()

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: vm.topInset }}>
      <View className="gap-4 px-5 pb-3">
        <SearchHeader value={vm.draft} onChangeText={vm.setDraft} onSubmit={vm.submit} onBack={vm.goHome} />
        {vm.showChips && <ConstraintChips chips={vm.chips} onToggle={vm.toggleChip} />}
        <ResultsBar countLabel={vm.countLabel} sortLabel={vm.sortLabel} onOpenSort={vm.openSort} />
      </View>
      <Animated.View key={vm.listKey} entering={listEntering} style={{ flex: 1 }}>
        <Animated.FlatList
          data={vm.results}
          keyExtractor={(item) => item.id}
          itemLayoutAnimation={rowLayout}
          // Native tabs overlap the list; this insets it above the tab bar
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={listContent}
          keyboardDismissMode="on-drag"
          renderItem={({ item }) => <ListingCard {...item} onToggleSave={() => vm.toggleSave(item.id)} />}
          ListEmptyComponent={<EmptyResults canClear={vm.hasActiveFilters} onClear={vm.clearFilters} />}
        />
      </Animated.View>
    </View>
  )
}
