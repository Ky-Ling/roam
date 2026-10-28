import { View } from "react-native"

import { Text } from "@/components/ui/text"

/** "1 / 24" over the gallery's bottom-right corner, 16 above the content panel. */
export const PhotoCounter = ({ index, count }: { index: number, count: number }) => (
  <View
    accessibilityLabel={`Photo ${index + 1} of ${count}`}
    // A plain rgba token: opacity modifiers (bg-ink/85) compile to color-mix(), which native drops
    className="absolute bottom-7 right-5 h-9 justify-center rounded-full bg-scrim-strong px-3.5"
  >
    <Text variant="body-medium" tone="white">
      {index + 1} / {count}
    </Text>
  </View>
)
