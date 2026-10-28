import { View } from "react-native"

import { GALLERY_HEIGHT, PANEL_OVERLAP } from "../constants"

/** Static loading shape: the photo block, then bars where the title, place and highlights go. */
export const StayPlaceholder = () => (
  <View>
    <View className="bg-surface-muted" style={{ height: GALLERY_HEIGHT }} />
    <View className="gap-3 rounded-t-md bg-surface px-5 pt-5" style={{ marginTop: -PANEL_OVERLAP }}>
      <View className="h-8 w-4/5 rounded-sm bg-surface-muted" />
      <View className="h-8 w-1/2 rounded-sm bg-surface-muted" />
      <View className="h-5 w-2/5 rounded-sm bg-surface-muted" />
      <View className="mt-3 h-14 rounded-md bg-surface-muted" />
    </View>
  </View>
)
