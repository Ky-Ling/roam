import { useSignUp as useClerkSignUp } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import type { TextInput } from "react-native";

import { PROTECT_CHECK_MESSAGE } from "@/constants/auth";
import { useOAuthSignIn } from "@/hooks/use-oauth-sign-in";
import { clerkErrorMessage, fieldMessage, splitFullName } from "@/lib/auth/clerk";
import { normalizeEmail, validateEmail, validateName, validatePassword } from "@/lib/auth/validation";

/** Orchestrator for Create account: the form, its validation, and the ways out of it. */
export const useSignUp = () => {
  const router = useRouter();
  const oauth = useOAuthSignIn();
  const { signUp, errors: clerkErrors, fetchStatus } = useClerkSignUp();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Errors stay hidden until the first submit, then follow every keystroke.
  const [submitted, setSubmitted] = useState(false);
  const [requestError, setRequestError] = useState<string>();

  // Every field is checked on the device first; Clerk only sees a valid form
  const errors = { name: validateName(name), email: validateEmail(email), password: validatePassword(password) };
  const isValid = !errors.name && !errors.email && !errors.password;

  const submit = async () => {
    setSubmitted(true);
    if (!isValid) return;
    setRequestError(undefined);
    oauth.clearOAuthError();
    const created = await signUp.password({
      emailAddress: normalizeEmail(email),
      password,
      ...splitFullName(name),
    });
    // Field errors (taken email, breached password) come back through clerkErrors.fields
    if (created.error) return;
    if (signUp.missingFields.includes("protect_check")) {
      setRequestError(PROTECT_CHECK_MESSAGE);

      return;
    }
    const sent = await signUp.verifications.sendEmailCode();
    if (!sent.error) router.push("/verify-email");
  };

  // Clerk's message for a field shows once the field passes the local checks
  const serverErrors = {
    name: fieldMessage(clerkErrors.fields.firstName) ?? fieldMessage(clerkErrors.fields.lastName),
    email: fieldMessage(clerkErrors.fields.emailAddress),
    password: fieldMessage(clerkErrors.fields.password),
  };
  const globalError = clerkErrors.global ? clerkErrorMessage(clerkErrors.global[0]) : undefined;
  const loading = fetchStatus === "fetching";

  return {
    refs: { email: emailRef, password: passwordRef },
    name,
    email,
    password,
    nameError: submitted ? (errors.name ?? serverErrors.name) : undefined,
    emailError: submitted ? (errors.email ?? serverErrors.email) : undefined,
    passwordError: submitted ? (errors.password ?? serverErrors.password) : undefined,
    setName,
    setEmail,
    setPassword,
    focusEmail: () => emailRef.current?.focus(),
    focusPassword: () => passwordRef.current?.focus(),
    loading,
    oauthLoading: oauth.oauthLoading,
    busy: loading || !!oauth.oauthLoading,
    error: requestError ?? globalError ?? oauth.oauthError,
    submit,
    continueWith: oauth.continueWith,
    goToSignIn: () => router.replace("/sign-in"),
    goBack: router.back,
  };
};
