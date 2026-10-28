import { View } from "react-native"

import { Text } from "@/components/ui/text"

import { INTRO_MESSAGE } from "../constants"

/** Roam's opening line, so guests know what they can ask and where answers come from. */
export const IntroMessage = () => (
  <View className="max-w-[85%] self-start rounded-xl bg-surface-muted px-4 py-3 corner-squircle">
    <Text variant="body">{INTRO_MESSAGE}</Text>
  </View>
)
