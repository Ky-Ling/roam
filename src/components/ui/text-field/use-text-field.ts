import { useState } from "react";
import type { TextInputProps } from "react-native";

type UseTextFieldArgs = Pick<TextInputProps, "secureTextEntry" | "onFocus" | "onBlur">;

export const useTextField = ({ secureTextEntry, onFocus, onBlur }: UseTextFieldArgs) => {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  const handleFocus: TextInputProps["onFocus"] = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur: TextInputProps["onBlur"] = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const toggleHidden = () => setHidden((h) => !h);

  return {
    focused,
    hidden,
    isSecure: !!secureTextEntry,
    toggleHidden,
    handleFocus,
    handleBlur,
  };
};
