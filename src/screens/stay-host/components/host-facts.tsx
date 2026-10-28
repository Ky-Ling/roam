import { View } from "react-native"

import { Icon, type IconName } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

/** Hosting since, response time and languages, one row each. */
export const HostFacts = ({ facts }: { facts: { icon: IconName, label: string }[] }) => (
  <View className="gap-3">
    {facts.map((fact) => (
      <View key={fact.label} className="flex-row items-center gap-3">
        <Icon name={fact.icon} size={20} />
        <Text variant="body" className="flex-1">
          {fact.label}
        </Text>
      </View>
    ))}
  </View>
)
