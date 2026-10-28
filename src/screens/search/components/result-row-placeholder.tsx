import { View } from "react-native"

/** Static stand-in for a result row while a new sentence loads. */
export const ResultRowPlaceholder = () => (
  <View className="flex-row gap-3">
    <View className="h-36 w-34 rounded-md bg-surface-muted corner-squircle" />
    <View className="flex-1 justify-center gap-3">
      <View className="h-5 w-4/5 rounded-full bg-surface-muted" />
      <View className="h-4 w-1/2 rounded-full bg-surface-muted" />
      <View className="h-4 w-1/3 rounded-full bg-surface-muted" />
    </View>
  </View>
)
