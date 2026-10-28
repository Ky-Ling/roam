import { View } from "react-native"
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated"

import { Text } from "@/components/ui/text"
import { DURATION, EASE_OUT } from "@/constants/motion"
import type { FeaturedStay } from "@/lib/sanity"
import { isEmpty } from "@/lib/utils"

import type { FeaturedStatus } from "../use-featured-stays"
import { FeaturedStayCard } from "./featured-stay-card"
import { FeaturedStayPlaceholder } from "./featured-stay-placeholder"
import { FeaturedStaysError } from "./featured-stays-error"

// A handful of cards, not a virtualized list, so per-card layout animations are safe.
// Cards that stay put slide into place; cards that leave or arrive fade.
const entering = FadeIn.duration(DURATION.enter).easing(EASE_OUT)
const exiting = FadeOut.duration(DURATION.exit)
const layout = LinearTransition.duration(220).easing(EASE_OUT)

const PLACEHOLDERS = [0, 1, 2]

type FeaturedStaysProps = {
  stays: FeaturedStay[]
  status: FeaturedStatus
  emptyMessage: string
  onRetry: () => void
  onOpenStay: (id: string) => void
}

export const FeaturedStays = ({ stays, status, emptyMessage, onRetry, onOpenStay }: FeaturedStaysProps) => (
  <View className="gap-5">
    {status === "loading" && PLACEHOLDERS.map((i) => <FeaturedStayPlaceholder key={i} />)}
    {status === "error" && <FeaturedStaysError onRetry={onRetry} />}
    {status === "ready" && isEmpty(stays) && (
      <Text variant="body" tone="secondary">
        {emptyMessage}
      </Text>
    )}
    {stays.map((stay) => (
      <Animated.View key={stay.id} entering={entering} exiting={exiting} layout={layout}>
        <FeaturedStayCard stay={stay} onPress={() => onOpenStay(stay.id)} />
      </Animated.View>
    ))}
  </View>
)
