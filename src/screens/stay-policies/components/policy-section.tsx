import { View } from "react-native"

import { Text } from "@/components/ui/text"

import type { PolicySectionView } from "../utils"
import { RuleList } from "@/components/policy/rule-list"

/** One titled group of policy text, with where it comes from. */
export const PolicySection = ({ title, source, blocks }: Omit<PolicySectionView, "key">) => (
  <View className="gap-3 border-t border-border pt-5">
    <View className="gap-0.5">
      <Text variant="title" accessibilityRole="header">
        {title}
      </Text>
      <Text variant="caption" tone="tertiary">
        {source}
      </Text>
    </View>
    {blocks.map((block, i) => (
      <View key={block.heading ?? i} className="gap-2">
        {block.heading && <Text variant="body-medium" className="font-jakarta-semibold">{block.heading}</Text>}
        {block.bullets ? (
          <RuleList rules={block.paragraphs} />
        ) : (
          block.paragraphs.map((p) => (
            <Text key={p} variant="body" tone="secondary">
              {p}
            </Text>
          ))
        )}
      </View>
    ))}
  </View>
)
