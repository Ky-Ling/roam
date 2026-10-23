import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import type { TextInput } from "react-native";

import { useOAuthSignIn } from "@/hooks/use-oauth-sign-in";
import { signUp } from "@/lib/auth/mock-auth";
import { normalizeEmail, validateEmail, validateName, validatePassword } from "@/lib/auth/validation";

/** Orchestrator for Create account: the form, its validation, and the ways out of it. */
export const useSignUp = () => {
  const router = useRouter();
  const oauth = useOAuthSignIn();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Errors stay hidden until the first submit, then follow every keystroke.
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState<string>();

  const errors = { name: validateName(name), email: validateEmail(email), password: validatePassword(password) };
  const isValid = !errors.name && !errors.email && !errors.password;

  const submit = async () => {
    setSubmitted(true);
    if (!isValid) return;
    setRequestError(undefined);
    oauth.clearOAuthError();
    setLoading(true);
    const result = await signUp({ name: name.trim(), email: normalizeEmail(email), password });
    setLoading(false);
    if (!result.ok) {
      setRequestError(result.error);

      return;
    }
    router.push("/verify-email");
  };

  return {
    refs: { email: emailRef, password: passwordRef },
    name,
    email,
    password,
    nameError: submitted ? errors.name : undefined,
    emailError: submitted ? errors.email : undefined,
    passwordError: submitted ? errors.password : undefined,
    setName,
    setEmail,
    setPassword,
    focusEmail: () => emailRef.current?.focus(),
    focusPassword: () => passwordRef.current?.focus(),
    loading,
    oauthLoading: oauth.oauthLoading,
    busy: loading || !!oauth.oauthLoading,
    error: requestError ?? oauth.oauthError,
    submit,
    continueWith: oauth.continueWith,
    goToSignIn: () => router.replace("/sign-in"),
    goBack: router.back,
  };
};
