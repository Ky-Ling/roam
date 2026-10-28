import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

type BookingBarProps = {
  price: string
  total: string
  bottomInset: number
  onBook: () => void
}

/** Nightly price, the minimum-stay total and the call to action, pinned to the bottom. */
export const BookingBar = ({ price, total, bottomInset, onBook }: BookingBarProps) => (
  <View
    className="flex-row items-center gap-4 border-t border-border bg-surface px-5 pt-4"
    style={{ paddingBottom: bottomInset }}
  >
    <View className="flex-1">
      <Text variant="heading">
        {price}{" "}
        <Text variant="body">/ night</Text>
      </Text>
      <Text variant="body" tone="tertiary" numberOfLines={1}>
        {total}
      </Text>
    </View>
    <Button title="Book this stay" size="lg" onPress={onBook} className="max-w-54 flex-1" />
  </View>
)
