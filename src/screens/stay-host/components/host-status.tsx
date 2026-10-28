import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { StatusBanner } from "@/components/ui/status-banner"
import { Text } from "@/components/ui/text"
import type { StayStatus } from "@/hooks/use-stay-details"

type HostStatusProps = {
  status: StayStatus
  onRetry: () => void
}

/** Loading, a failed load (with retry), a missing stay, or a stay with no host. */
export const HostStatus = ({ status, onRetry }: HostStatusProps) => (
  <View className="gap-3">
    {status === "loading" && (
      <Text variant="body" tone="secondary">
        Loading host…
      </Text>
    )}
    {status === "error" && (
      <>
        <StatusBanner tone="error" message="Couldn't load this host." />
        <Button title="Try again" variant="secondary" onPress={onRetry} />
      </>
    )}
    {status === "missing" && <Text variant="body">{"This stay isn't available anymore."}</Text>}
    {status === "ready" && <Text variant="body">{"Host details aren't available."}</Text>}
  </View>
)
