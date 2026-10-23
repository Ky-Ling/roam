import { Pressable } from "react-native";

import { cx } from "@/lib/utils";
import { colors } from "@/theme";

import { Icon } from "../icon";

type StepButtonProps = {
  icon: "minus" | "plus";
  label: string;
  disabled: boolean;
  onPress: () => void;
};

export const StepButton = ({ icon, label, disabled, onPress }: StepButtonProps) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label}
    accessibilityState={{ disabled }}
    disabled={disabled}
    onPress={onPress}
    className={cx("size-10 items-center justify-center rounded-full active:opacity-85", disabled && "opacity-40")}
  >
    <Icon name={icon} size={20} color={colors.ink} />
  </Pressable>
);
