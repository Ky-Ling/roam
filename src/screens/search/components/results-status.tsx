import { View } from "react-native"

import { Button } from "@/components/ui/button"
import { StatusBanner } from "@/components/ui/status-banner"

import type { ResultsStatus } from "../use-search-results"
import { EmptyResults } from "./empty-results"
import { ResultRowPlaceholder } from "./result-row-placeholder"

const PLACEHOLDERS = [0, 1, 2]

type ResultsStatusProps = {
  status: ResultsStatus
  canClear: boolean
  onClear: () => void
  onRetry: () => void
}

/** What the list shows when it has no rows: loading rows, the error, or the empty state. */
export const ResultsStatusView = ({ status, canClear, onClear, onRetry }: ResultsStatusProps) => (
  <>
    {status === "loading" && (
      <View className="gap-4">
        {PLACEHOLDERS.map((i) => (
          <ResultRowPlaceholder key={i} />
        ))}
      </View>
    )}
    {status === "error" && (
      <View className="gap-3">
        <StatusBanner tone="error" message="Couldn't load stays." />
        <Button title="Try again" variant="secondary" onPress={onRetry} />
      </View>
    )}
    {status === "ready" && <EmptyResults canClear={canClear} onClear={onClear} />}
  </>
)
