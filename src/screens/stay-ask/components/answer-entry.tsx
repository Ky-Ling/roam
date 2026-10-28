import { View } from "react-native"

import { RuleList } from "@/components/policy/rule-list"
import { SourceLabel } from "@/components/policy/source-label"
import { Text } from "@/components/ui/text"
import type { AnswerEntry as AnswerEntryData } from "@/lib/ask"

/** One quoted piece of text with its source underneath. */
export const AnswerEntry = ({ heading, paragraphs, bullets, source }: AnswerEntryData) => (
  <View className="gap-2">
    {heading && (
      <Text variant="body-medium" className="font-jakarta-semibold">
        {heading}
      </Text>
    )}
    {bullets ? (
      <RuleList rules={paragraphs} />
    ) : (
      paragraphs.map((p) => (
        <Text key={p} variant="body" tone="secondary">
          {p}
        </Text>
      ))
    )}
    <SourceLabel source={source} />
  </View>
)
