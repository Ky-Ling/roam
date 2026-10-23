import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, type TextInput } from "react-native";

import { useOAuthSignIn } from "@/hooks/use-oauth-sign-in";
import { signIn } from "@/lib/auth/mock-auth";
import { normalizeEmail, validateEmail } from "@/lib/auth/validation";

/** Orchestrator for Sign in: the form, its validation, and the ways out of it. */
export const useSignIn = () => {
  const router = useRouter();
  const oauth = useOAuthSignIn();
  const passwordRef = useRef<TextInput>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Errors stay hidden until the first submit, then follow every keystroke.
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string>();

  const errors = { email: validateEmail(email), password: password ? undefined : "Enter your password." };
  const isValid = !errors.email && !errors.password;

  const submit = async () => {
    setSubmitted(true);
    if (!isValid) return;
    setRequestError(undefined);
    oauth.clearOAuthError();
    setLoading(true);
    const result = await signIn({ email: normalizeEmail(email), password });
    // On success the root layout's guard moves the guest to /home.
    if (!result.ok) {
      setRequestError(result.error);
      setLoading(false);
    }
  };

  const forgotPassword = () => Alert.alert("Password reset", "Password reset arrives with Clerk.");

  return {
    refs: { password: passwordRef },
    email,
    password,
    emailError: submitted ? errors.email : undefined,
    passwordError: submitted ? errors.password : undefined,
    setEmail,
    setPassword,
    focusPassword: () => passwordRef.current?.focus(),
    loading,
    oauthLoading: oauth.oauthLoading,
    busy: loading || !!oauth.oauthLoading,
    error: requestError ?? oauth.oauthError,
    submit,
    forgotPassword,
    continueWith: oauth.continueWith,
    goToSignUp: () => router.replace("/sign-up"),
    goBack: router.back,
  };
};
