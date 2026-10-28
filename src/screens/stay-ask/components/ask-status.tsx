import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { StatusBanner } from "@/components/ui/status-banner"
import { Text } from "@/components/ui/text"
import type { StayStatus } from "@/hooks/use-stay-details"

type AskStatusProps = {
  status: Exclude<StayStatus, "ready">
  onRetry: () => void
  onBack: () => void
}

/** Loading, a failed load (with retry), or a slug no published stay has. */
export const AskStatus = ({ status, onRetry, onBack }: AskStatusProps) => (
  <View className="gap-3 px-5 pt-6">
    {status === "loading" && (
      <Text variant="body" tone="secondary">
        Loading this stay…
      </Text>
    )}
    {status === "error" && (
      <>
        <StatusBanner tone="error" message="Couldn't load this stay." />
        <Button title="Try again" variant="secondary" onPress={onRetry} />
      </>
    )}
    {status === "missing" && (
      <>
        <Text variant="title">{"This stay isn't available anymore."}</Text>
        <Button title="Go back" variant="secondary" onPress={onBack} />
      </>
    )}
  </View>
)
