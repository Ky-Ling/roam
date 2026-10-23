import type { ReactNode, Ref } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import { cx } from "@/lib/utils";
import { colors } from "@/theme";

import { Icon, type IconName } from "../icon";
import { Text } from "../text";
import { useTextField } from "./use-text-field";

export type TextFieldProps = Omit<TextInputProps, "style" | "placeholderTextColor" | "selectionColor"> & {
  icon?: IconName;
  /** Caption above the input inside the field (auth forms). The field grows to fit both lines. */
  label?: string;
  /** Message under the field. Also turns the border red. */
  error?: string;
  /** Action on the right edge, e.g. a filters button on the search field. */
  trailing?: ReactNode;
  ref?: Ref<TextInput>;
  className?: string;
};

export const TextField = ({
  icon,
  label,
  error,
  trailing,
  secureTextEntry,
  className,
  onFocus,
  onBlur,
  ref,
  ...props
}: TextFieldProps) => {
  // The ref comes out on its own: the React Compiler treats any object holding a ref as ref-like.
  const { inputRef, ...vm } = useTextField({ secureTextEntry, onFocus, onBlur, ref });

  const input = (
    <TextInput
      ref={inputRef}
      // No fixed height or line-height, so the row's items-center lines the text up with the icon.
      // Android adds font padding and default vertical padding that push the text off center.
      className={cx("py-0 type-input text-ink", !label && "flex-1")}
      textAlignVertical="center"
      style={{ includeFontPadding: false }}
      placeholderTextColor={colors.inkTertiary}
      selectionColor={colors.lavenderStrong}
      cursorColor={colors.lavenderStrong}
      secureTextEntry={vm.isSecure && vm.hidden}
      accessibilityLabel={label}
      onFocus={vm.handleFocus}
      onBlur={vm.handleBlur}
      {...props}
    />
  );

  return (
    <View className={cx("gap-1.5", className)}>
      <View
        className={cx(
          "flex-row items-center rounded-lg corner-squircle",
          label ? "gap-6 px-4 py-2" : "h-14 gap-3 px-4",
          // The focus ring is slightly heavier than the 1px resting border on the sheet
          vm.focused ? "border-[1.5px] bg-lavender-subtle" : "border bg-surface-muted",
          error ? "border-danger" : vm.focused ? "border-lavender-strong" : "border-border",
        )}
      >
        {icon && <Icon name={icon} />}
        {label ? (
          <View className="flex-1">
            <Text variant="caption" onPress={vm.focusInput} accessible={false}>
              {label}
            </Text>
            {input}
          </View>
        ) : (
          input
        )}
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
      {error && (
        <Text variant="caption" tone="danger" className="px-1">
          {error}
        </Text>
      )}
    </View>
  );
};
