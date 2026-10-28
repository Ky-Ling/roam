import { View } from "react-native"

import { SourceLabel } from "@/components/policy/source-label"
import { Text } from "@/components/ui/text"

import type { CancellationView as CancellationViewData } from "../utils"
import { RefundTimeline } from "./refund-timeline"
import { SummaryCallout } from "./summary-callout"

/** The stay's cancellation policy (summary, then refund steps), then Roam's, each with its source. */
export const CancellationView = ({ summary, steps, roam }: Omit<CancellationViewData, "title">) => (
  <View className="gap-5">
    <SummaryCallout summary={summary} />
    <View className="gap-4">
      <RefundTimeline steps={steps} />
      <SourceLabel source="This stay's cancellation policy" />
    </View>
    {roam.map((policy) => (
      <View key={policy.title} className="gap-3 border-t border-border pt-5">
        <Text variant="title" accessibilityRole="header">
          {policy.title}
        </Text>
        {policy.paragraphs.map((p) => (
          <Text key={p} variant="body" tone="secondary">
            {p}
          </Text>
        ))}
        <SourceLabel source="Applies to every Roam stay" />
      </View>
    ))}
  </View>
)
