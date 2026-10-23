import { useImperativeHandle, useRef, useState, type Ref } from "react"
import type { TextInput, TextInputProps } from "react-native"

type UseTextFieldArgs = Pick<TextInputProps, "secureTextEntry" | "onFocus" | "onBlur"> & {
  ref?: Ref<TextInput>
}

export const useTextField = ({ secureTextEntry, onFocus, onBlur, ref }: UseTextFieldArgs) => {
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(true)
  const inputRef = useRef<TextInput>(null)

  // Keep our own handle (the label focuses the input) and expose the same input to the caller's ref.
  useImperativeHandle(ref, () => inputRef.current as TextInput)

  const handleFocus: TextInputProps["onFocus"] = (e) => {
    setFocused(true)
    onFocus?.(e)
  }

  const handleBlur: TextInputProps["onBlur"] = (e) => {
    setFocused(false)
    onBlur?.(e)
  }

  const toggleHidden = () => setHidden((h) => !h)

  const focusInput = () => inputRef.current?.focus()

  return {
    focused,
    hidden,
    isSecure: !!secureTextEntry,
    inputRef,
    focusInput,
    toggleHidden,
    handleFocus,
    handleBlur,
  }
}
