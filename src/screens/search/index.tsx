import { View } from "react-native"
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated"

import { Text } from "@/components/ui/text"
import { DURATION, EASE_OUT } from "@/constants/motion"

import { ConstraintChips, ResultCard, ResultsBar, ResultsStatusView, SearchHeader } from "./components"
import { useSearch } from "./use-search"

// Rows are virtualized, so they never get `entering`: the list fades in as a whole on a new sentence,
// and rows slide into place when a chip changes what matches.
const listEntering = FadeIn.duration(DURATION.enter).easing(EASE_OUT)
const rowLayout = LinearTransition.duration(220).easing(EASE_OUT)

// Reanimated components don't take className. These are the spacing tokens gap-4 px-5 pt-1 pb-6.
const listContent = { gap: 16, paddingHorizontal: 20, paddingTop: 4, paddingBottom: 24 }

export const SearchScreen = () => {
  const vm = useSearch()

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: vm.topInset }}>
      <View className="gap-3 px-5 pb-3">
        <SearchHeader value={vm.draft} onChangeText={vm.setDraft} onSubmit={vm.submit} onBack={vm.goHome} />
        {vm.showChips && <ConstraintChips chips={vm.chips} onToggle={vm.toggleChip} />}
        <View className="pt-1">
          <ResultsBar countLabel={vm.countLabel} sortLabel={vm.sortLabel} onOpenSort={vm.openSort} />
        </View>
        {vm.showUnmatchedNote && (
          <Text variant="caption" tone="secondary">
            {"We couldn't pick out a type, price, place or amenity, so here are all stays."}
          </Text>
        )}
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
          renderItem={({ item }) => (
            <ResultCard {...item} onPress={() => vm.openStay(item.id)} onToggleSave={() => vm.toggleSave(item.id)} />
          )}
          ListEmptyComponent={
            <ResultsStatusView
              status={vm.status}
              canClear={vm.hasActiveFilters}
              onClear={vm.clearFilters}
              onRetry={vm.retry}
            />
          }
        />
      </Animated.View>
    </View>
  )
}
