import type { ReactNode } from "react"
import { Pressable, View, type PressableProps } from "react-native"
import Animated from "react-native-reanimated"

import { CSS_EASE_OUT, DURATION } from "@/constants/motion"

import { usePressableScale } from "./use-pressable-scale"

export type PressableScaleProps = Omit<PressableProps, "children" | "onPressIn" | "onPressOut"> & {
  children: ReactNode
  /** Styles the content box, which is what scales. */
  className?: string
}

/** Press feedback for button-like surfaces: shrinks to 0.97 on press-in, back on release. */
export const PressableScale = ({ children, className, ...props }: PressableScaleProps) => {
  const vm = usePressableScale()

  return (
    <Pressable pressRetentionOffset={16} {...props} onPressIn={vm.onPressIn} onPressOut={vm.onPressOut}>
      {/* Reanimated views don't take className, so the transition lives here and the classes one level in */}
      <Animated.View style={[styles.base, vm.pressed && (vm.reducedMotion ? styles.dimmed : styles.pressed)]}>
        <View className={className}>{children}</View>
      </Animated.View>
    </Pressable>
  )
}

// Plain objects, not StyleSheet.create: RN's own style types don't know Reanimated's easing objects
const styles = {
  base: {
    opacity: 1,
    transform: [{ scale: 1 }],
    transitionProperty: ["transform", "opacity"],
    transitionDuration: DURATION.press,
    transitionTimingFunction: CSS_EASE_OUT,
  },
  pressed: { transform: [{ scale: 0.97 }] },
  dimmed: { opacity: 0.85 },
}
