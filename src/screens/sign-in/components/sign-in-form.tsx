import type { RefObject } from "react"
import { Pressable, View, type TextInput } from "react-native"

import { Text } from "@/components/ui/text"
import { TextField } from "@/components/ui/text-field"

type SignInFormProps = {
  passwordRef: RefObject<TextInput | null>
  email: string
  password: string
  emailError?: string
  passwordError?: string
  onChangeEmail: (value: string) => void
  onChangePassword: (value: string) => void
  onEmailDone: () => void
  onSubmit: () => void
  onForgotPassword: () => void
  editable: boolean
}

export const SignInForm = ({ passwordRef, ...props }: SignInFormProps) => (
  <View className="gap-3">
    <TextField
      icon="mail"
      label="Email address"
      placeholder="you@example.com"
      value={props.email}
      onChangeText={props.onChangeEmail}
      error={props.emailError}
      editable={props.editable}
      textContentType="emailAddress"
      autoComplete="email"
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="next"
      submitBehavior="submit"
      onSubmitEditing={props.onEmailDone}
    />
    <TextField
      ref={passwordRef}
      icon="lock"
      label="Password"
      placeholder="Your password"
      value={props.password}
      onChangeText={props.onChangePassword}
      error={props.passwordError}
      editable={props.editable}
      secureTextEntry
      textContentType="password"
      autoComplete="current-password"
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="go"
      onSubmitEditing={props.onSubmit}
    />
    <Pressable
      accessibilityRole="button"
      hitSlop={8}
      onPress={props.onForgotPassword}
      className="self-end active:opacity-85"
    >
      <Text variant="caption" className="font-jakarta-semibold">
        Forgot password?
      </Text>
    </Pressable>
  </View>
)
