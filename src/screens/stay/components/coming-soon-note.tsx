import { View } from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { DURATION, EASE_OUT } from "@/constants/motion"
import { colors } from "@/theme"

const entering = FadeIn.duration(DURATION.enter).easing(EASE_OUT)
const exiting = FadeOut.duration(DURATION.exit)

/** Web's stand-in for the native "coming soon" alert, floating above the booking bar. */
export const ComingSoonNote = () => (
  <Animated.View entering={entering} exiting={exiting} style={{ position: "absolute", left: 20, right: 20, top: -64 }}>
    <View
      accessibilityRole="alert"
      className="min-h-12 flex-row items-center gap-3 rounded-md bg-info-subtle px-4 py-3 shadow-raised corner-squircle"
    >
      <Icon name="calendar" size={22} color={colors.infoInk} />
      <Text variant="body-medium" tone="info" className="flex-1 font-jakarta">
        Booking is coming soon.
      </Text>
    </View>
  </Animated.View>
)
