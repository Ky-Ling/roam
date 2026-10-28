import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { StatusBanner } from "@/components/ui/status-banner"

export const FeaturedStaysError = ({ onRetry }: { onRetry: () => void }) => (
  <View className="gap-3">
    <StatusBanner tone="error" message="Couldn't load stays." />
    <Button title="Try again" variant="secondary" onPress={onRetry} />
  </View>
)
