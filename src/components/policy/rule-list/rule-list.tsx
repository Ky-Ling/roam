import { View } from "react-native"

import { Text } from "@/components/ui/text"

/** House rules, one bullet per rule, as written. */
export const RuleList = ({ rules }: { rules: string[] }) => (
  <View className="gap-2">
    {rules.map((rule) => (
      <View key={rule} className="flex-row gap-3">
        <View className="mt-2.5 size-1.5 rounded-full bg-ink" />
        <Text variant="body" className="flex-1">
          {rule}
        </Text>
      </View>
    ))}
  </View>
)
