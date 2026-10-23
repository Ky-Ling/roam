import { FadeIn, FadeInDown } from "react-native-reanimated"

import { DURATION, EASE_OUT } from "@/constants/motion"

/** Gap between staggered entrances: enough to read as a sequence, short enough to stay out of the way. */
const STAGGER = 40

/**
 * Entrance for the index-th block of a screen: rises 12 and fades in. Reduced motion keeps the
 * fade (it explains the change) and drops the movement.
 */
export const staggeredEntrance = (index: number, reducedMotion: boolean) => {
  const delay = index * STAGGER

  if (reducedMotion) return FadeIn.duration(DURATION.enter).delay(delay).easing(EASE_OUT)

  return FadeInDown.withInitialValues({ opacity: 0, transform: [{ translateY: 12 }] })
    .duration(DURATION.enter)
    .delay(delay)
    .easing(EASE_OUT)
}
