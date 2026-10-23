import type { ReactNode } from "react"
import { View } from "react-native"

import { Text } from "@/components/ui/text"

/** Hero title (break lines with \n, as the design does) and the intro paragraph under it. */
export const AuthIntro = ({ title, children }: { title: string, children: ReactNode }) => (
  <View className="mt-7 gap-3">
    <Text variant="headline" accessibilityRole="header">
      {title}
    </Text>
    {/* The design wraps the intro well short of the margin, at about 300. */}
    <Text variant="lead" tone="secondary" className="max-w-75">
      {children}
    </Text>
  </View>
)
