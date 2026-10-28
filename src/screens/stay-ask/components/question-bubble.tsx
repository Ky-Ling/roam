import { View } from "react-native"

import { Text } from "@/components/ui/text"

/** The guest's question, typed or sent by a chip. */
export const QuestionBubble = ({ text }: { text: string }) => (
  <View className="max-w-[85%] self-end rounded-xl bg-lavender-muted px-4 py-3 corner-squircle">
    <Text variant="body">{text}</Text>
  </View>
)
