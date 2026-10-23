import type { RefObject } from "react";
import { View, type TextInput } from "react-native";

import { TextField } from "@/components/ui/text-field";

type SignUpFormProps = {
  emailRef: RefObject<TextInput | null>;
  passwordRef: RefObject<TextInput | null>;
  name: string;
  email: string;
  password: string;
  nameError?: string;
  emailError?: string;
  passwordError?: string;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onNameDone: () => void;
  onEmailDone: () => void;
  onSubmit: () => void;
  editable: boolean;
};

export const SignUpForm = ({ emailRef, passwordRef, ...props }: SignUpFormProps) => (
  <View className="gap-3">
    <TextField
      icon="user"
      label="Full name"
      placeholder="e.g. Adrian Hajdin"
      value={props.name}
      onChangeText={props.onChangeName}
      error={props.nameError}
      editable={props.editable}
      textContentType="name"
      autoComplete="name"
      autoCapitalize="words"
      returnKeyType="next"
      submitBehavior="submit"
      onSubmitEditing={props.onNameDone}
    />
    <TextField
      ref={emailRef}
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
      placeholder="At least 8 characters"
      value={props.password}
      onChangeText={props.onChangePassword}
      error={props.passwordError}
      editable={props.editable}
      secureTextEntry
      textContentType="newPassword"
      autoComplete="new-password"
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="go"
      onSubmitEditing={props.onSubmit}
    />
  </View>
);
