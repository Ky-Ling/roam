import { View } from "react-native"

import { Icon, type IconName } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import type { AnswerCard as AnswerCardData, TopicKey } from "@/lib/ask"
import { colors } from "@/theme"

import { AnswerEntry } from "./answer-entry"

const topicIcons: Record<TopicKey, IconName> = {
  checkIn: "calendar",
  cancellation: "document",
  pets: "pets",
  houseRules: "list",
  payment: "card",
  safety: "safety",
  damage: "damage",
  community: "community",
}

/** One topic of a reply: every quoted entry for it, each with its source. */
export const AnswerCard = ({ topic, label, entries }: AnswerCardData) => (
  <View className="gap-3 rounded-xl bg-lavender-subtle p-4 corner-squircle">
    <View className="flex-row items-center gap-2">
      <Icon name={topicIcons[topic]} size={20} color={colors.indigo} />
      <Text variant="body-medium" className="flex-1 font-jakarta-semibold">
        {label}
      </Text>
    </View>
    {entries.map((entry, i) => (
      <View key={entry.heading ?? i} className={i > 0 ? "border-t border-lavender-muted pt-3" : undefined}>
        <AnswerEntry {...entry} />
      </View>
    ))}
  </View>
)
