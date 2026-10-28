import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { StatusBanner } from "@/components/ui/status-banner"
import { Text } from "@/components/ui/text"

type StayStatusProps = {
  kind: "error" | "missing"
  topInset: number
  onRetry: () => void
  onBack: () => void
}

/** A failed load (with retry) or a slug no published stay has. The back button sits above it. */
export const StayStatus = ({ kind, topInset, onRetry, onBack }: StayStatusProps) => (
  // Clears the 56pt back button plus a 24pt gap
  <View className="gap-3 px-5" style={{ paddingTop: topInset + 80 }}>
    {kind === "error" ? (
      <>
        <StatusBanner tone="error" message="Couldn't load this stay." />
        <Button title="Try again" variant="secondary" onPress={onRetry} />
      </>
    ) : (
      <>
        <Text variant="title">{"This stay isn't available anymore."}</Text>
        <Button title="Back to home" variant="secondary" onPress={onBack} />
      </>
    )}
  </View>
)
