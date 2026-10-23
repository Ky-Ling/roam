import { View } from "react-native"

import { GlassPill } from "@/components/ui/glass-pill"
import { Wordmark } from "@/components/ui/wordmark"

export const OnboardingHeader = ({ topInset, onSkip }: { topInset: number, onSkip: () => void }) => (
  <View
    pointerEvents="box-none"
    className="absolute inset-x-0 top-0 flex-row items-center justify-between px-6"
    style={{ paddingTop: topInset }}
  >
    <Wordmark />
    {/* "roam" has no ascenders, so its letters sit 7 below the line box's center; follow them. */}
    <GlassPill label="Skip" onPress={onSkip} className="mt-1.5" />
  </View>
)
