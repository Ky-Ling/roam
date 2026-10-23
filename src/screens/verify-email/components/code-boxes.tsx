import type { RefObject } from "react";
import { TextInput, View } from "react-native";

import { range } from "@/lib/utils";

import { CodeBox } from "./code-box";

type CodeBoxesProps = {
  inputRef: RefObject<TextInput | null>;
  code: string;
  length: number;
  focused: boolean;
  error: boolean;
  editable: boolean;
  onChangeCode: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: () => void;
};

/** Six boxes drawn from one invisible input laid over them, so paste and one-time-code autofill work.
 * No maxLength: it would cut a pasted "123 456" before the hook strips the non-digits. */
export const CodeBoxes = ({ inputRef, ...props }: CodeBoxesProps) => (
  <View className="flex-row justify-between">
    {range(props.length).map((i) => (
      <CodeBox
        key={i}
        digit={props.code[i]}
        active={props.focused && i === Math.min(props.code.length, props.length - 1)}
        error={props.error}
      />
    ))}
    <TextInput
      ref={inputRef}
      value={props.code}
      onChangeText={props.onChangeCode}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onSubmitEditing={props.onSubmit}
      editable={props.editable}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      autoComplete="one-time-code"
      autoFocus
      caretHidden
      accessibilityLabel="Verification code"
      className="absolute inset-0 text-transparent outline-none"
      selectionColor="transparent"
    />
  </View>
);
