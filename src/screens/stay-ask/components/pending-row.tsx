import { Text } from "@/components/ui/text"

/** Shown while a reply is on its way. */
export const PendingRow = () => (
  <Text variant="caption" tone="tertiary" accessibilityLiveRegion="polite">
    Looking that up…
  </Text>
)
