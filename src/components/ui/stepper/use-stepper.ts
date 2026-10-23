import type { AccessibilityActionEvent } from "react-native";

import { isNil } from "@/lib/utils";

type UseStepperArgs = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max?: number;
};

export const useStepper = ({ value, onChange, min, max }: UseStepperArgs) => {
  const canDecrease = value > min;
  const canIncrease = isNil(max) || value < max;

  const decrement = () => onChange(value - 1);
  const increment = () => onChange(value + 1);

  const handleAccessibilityAction = (e: AccessibilityActionEvent) => {
    if (e.nativeEvent.actionName === "increment" && canIncrease) increment();
    if (e.nativeEvent.actionName === "decrement" && canDecrease) decrement();
  };

  return {
    canDecrease,
    canIncrease,
    decrement,
    increment,
    accessibilityValue: { now: value, min, max },
    handleAccessibilityAction,
  };
};
