import { useState } from "react";
import { useReducedMotion } from "react-native-reanimated";

/** Pressed state for the scale feedback. setState is fine: it fires twice per press, never per frame. */
export const usePressableScale = () => {
  const [pressed, setPressed] = useState(false);
  // Reduced motion keeps the feedback but drops the movement
  const reducedMotion = useReducedMotion();

  return {
    pressed,
    reducedMotion,
    onPressIn: () => setPressed(true),
    onPressOut: () => setPressed(false),
  };
};
