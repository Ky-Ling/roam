import { View } from "react-native"

import { Text } from "@/components/ui/text"

/** The policy's paragraphs as steps on a line, earliest cancellation first. The text is unchanged. */
export const RefundTimeline = ({ steps }: { steps: string[] }) => (
  <View accessibilityRole="list">
    {steps.map((step, i) => {
      const last = i === steps.length - 1

      return (
        <View key={step} className="flex-row gap-3">
          {/* The dot sits on the first line of text; the line runs down to the next dot */}
          <View className="w-3 items-center">
            <View className="mt-1.5 size-3 rounded-full bg-indigo" />
            {!last && <View className="mt-1 w-0.5 flex-1 bg-lavender-muted" />}
          </View>
          <Text variant="body" className={last ? "flex-1" : "flex-1 pb-5"}>
            {step}
          </Text>
        </View>
      )
    })}
  </View>
)
