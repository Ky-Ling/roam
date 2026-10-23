import { View } from "react-native"

import { cx } from "@/lib/utils"

import { Text } from "../text"
import { StepButton } from "./step-button"
import { useStepper } from "./use-stepper"

export type StepperProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  /** No upper bound when omitted. */
  max?: number
  /** Names the quantity for screen readers, e.g. "Guests". */
  accessibilityLabel?: string
  className?: string
}

export const Stepper = ({ value, onChange, min = 0, max, accessibilityLabel, className }: StepperProps) => {
  const vm = useStepper({ value, onChange, min, max })

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={vm.accessibilityValue}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={vm.handleAccessibilityAction}
      className={cx(
        "h-12 flex-row items-center self-start rounded-full border border-border bg-surface px-1",
        className,
      )}
    >
      <StepButton icon="minus" label="Decrease" disabled={!vm.canDecrease} onPress={vm.decrement} />
      <Text variant="title" className="min-w-8 text-center">
        {value}
      </Text>
      <StepButton icon="plus" label="Increase" disabled={!vm.canIncrease} onPress={vm.increment} />
    </View>
  )
}
