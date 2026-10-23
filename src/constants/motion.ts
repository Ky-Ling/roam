import { cubicBezier, Easing } from "react-native-reanimated";

// Curves from the expo-animation skill. Never ease-in on UI.
/** Strong ease-out for anything entering or responding to a press (withTiming, layout animations). */
export const EASE_OUT = Easing.bezier(0.23, 1, 0.32, 1);
/** The same curve for Reanimated CSS transitions, which reject cubic-bezier strings. */
export const CSS_EASE_OUT = cubicBezier(0.23, 1, 0.32, 1);

export const DURATION = {
  /** Press feedback. */
  press: 120,
  /** Chip and small state changes. */
  state: 180,
  /** Entrances and list reflow. */
  enter: 260,
  exit: 150,
} as const;
