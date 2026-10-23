import type { ReactNode } from "react"
import { View } from "react-native"

import { Text } from "@/components/ui/text"

type SectionCardProps = {
  title: string
  children: ReactNode
}

export const SectionCard = ({ title, children }: SectionCardProps) => (
  <View className="gap-4 rounded-xl bg-surface p-4 corner-squircle">
    <Text variant="body-medium" className="font-jakarta-semibold">
      {title}
    </Text>
    {children}
  </View>
)
