import type { ReactNode } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import { cx } from "@/lib/utils";
import { colors } from "@/theme";

import { Icon, type IconName } from "../icon";
import { useTextField } from "./use-text-field";

export type TextFieldProps = Omit<TextInputProps, "style" | "placeholderTextColor" | "selectionColor"> & {
  icon?: IconName;
  /** Action on the right edge, e.g. a filters button on the search field. */
  trailing?: ReactNode;
  className?: string;
};

export const TextField = ({
  icon,
  trailing,
  secureTextEntry,
  className,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) => {
  const vm = useTextField({ secureTextEntry, onFocus, onBlur });

  return (
    <View
      className={cx(
        "h-14 flex-row items-center gap-3 rounded-lg px-4 corner-squircle",
        // The focus ring is slightly heavier than the 1px resting border on the sheet
        vm.focused
          ? "border-[1.5px] border-lavender-strong bg-lavender-subtle"
          : "border border-border bg-surface-muted",
        className,
      )}
    >
      {icon && <Icon name={icon} />}
      <TextInput
        // No fixed height or line-height, so the row's items-center lines the text up with the icon.
        // Android adds font padding and default vertical padding that push the text off center.
        className="flex-1 py-0 type-input text-ink"
        textAlignVertical="center"
        style={{ includeFontPadding: false }}
        placeholderTextColor={colors.inkTertiary}
        selectionColor={colors.lavenderStrong}
        cursorColor={colors.lavenderStrong}
        secureTextEntry={vm.isSecure && vm.hidden}
        onFocus={vm.handleFocus}
        onBlur={vm.handleBlur}
        {...props}
      />
      {vm.isSecure ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={vm.hidden ? "Show password" : "Hide password"}
          hitSlop={8}
          onPress={vm.toggleHidden}
          className="active:opacity-85"
        >
          <Icon name={vm.hidden ? "eyeOff" : "eye"} />
        </Pressable>
      ) : (
        trailing
      )}
    </View>
  );
};
