import { useSignIn, useSignUp } from "@clerk/expo";
import type { SetActiveNavigate } from "@clerk/expo/types";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import type { TextInput } from "react-native";

import { SESSION_TASK_MESSAGE } from "@/constants/auth";
import { clerkErrorMessage, fieldMessage, pendingCodeFlow } from "@/lib/auth/clerk";

import { CODE_LENGTH, RESEND_COOLDOWN_S } from "./constants";
import { formatCountdown, sanitizeCode } from "./utils";

/**
 * Orchestrator for email verification: the code, checking it, and resending with a cooldown.
 * Serves sign-up (confirm the email) and sign-in from a new device (confirm it's you).
 */
export const useVerifyEmail = () => {
  const router = useRouter();
  const { signIn, errors: signInErrors, fetchStatus: signInStatus } = useSignIn();
  const { signUp, errors: signUpErrors, fetchStatus: signUpStatus } = useSignUp();
  const inputRef = useRef<TextInput>(null);
  // Read once: the pending flow only changes when this screen succeeds and leaves.
  const [flow] = useState(() => pendingCodeFlow(signIn, signUp));
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const [resending, setResending] = useState(false);
  // The first code went out before this screen opened, so the cooldown starts right away.
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const [notice, setNotice] = useState<string>();
  const [taskError, setTaskError] = useState<string>();
  // Clerk keeps its last error until the next request; typing a new code hides it, as before.
  const [showClerkError, setShowClerkError] = useState(true);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);

    return () => clearTimeout(id);
  }, [cooldown]);

  const isSignIn = flow?.kind === "sign-in";
  const clerkErrors = isSignIn ? signInErrors : signUpErrors;
  const loading = (isSignIn ? signInStatus : signUpStatus) === "fetching";

  // The root layout's guard moves the guest to /home once the session is active, so no navigation here.
  const navigate: SetActiveNavigate = ({ session }) => {
    if (session?.currentTask) setTaskError(SESSION_TASK_MESSAGE);
  };

  const changeCode = (value: string) => {
    setCode(sanitizeCode(value, CODE_LENGTH));
    setTaskError(undefined);
    setShowClerkError(false);
  };

  const verify = async () => {
    if (code.length < CODE_LENGTH) return;
    setNotice(undefined);
    setShowClerkError(true);
    if (isSignIn) {
      const { error } = await signIn.mfa.verifyEmailCode({ code });
      if (!error && signIn.status === "complete") await signIn.finalize({ navigate });

      return;
    }
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (!error && signUp.status === "complete") await signUp.finalize({ navigate });
  };

  const resend = async () => {
    setNotice(undefined);
    setShowClerkError(true);
    setResending(true);
    const { error } = isSignIn ? await signIn.mfa.sendEmailCode() : await signUp.verifications.sendEmailCode();
    setResending(false);
    if (error) return;
    setCode("");
    setCooldown(RESEND_COOLDOWN_S);
    setNotice(`We sent a new code to ${flow?.email}.`);
    inputRef.current?.focus();
  };

  // Leaving a new-device sign-in drops the half-finished attempt, so the form starts clean
  const goBack = async () => {
    if (isSignIn) await signIn.reset();
    router.back();
  };

  const clerkError =
    fieldMessage(clerkErrors.fields.code) ??
    (clerkErrors.global ? clerkErrorMessage(clerkErrors.global[0]) : undefined);
  const error = taskError ?? (showClerkError ? clerkError : undefined);

  return {
    inputRef,
    flow,
    email: flow?.email,
    code,
    codeLength: CODE_LENGTH,
    changeCode,
    focused,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    focusInput: () => inputRef.current?.focus(),
    hasError: !!error,
    error,
    notice,
    canVerify: code.length === CODE_LENGTH,
    loading,
    verify,
    resending,
    canResend: cooldown <= 0 && !resending && !loading,
    cooldownLabel: cooldown > 0 ? formatCountdown(cooldown) : undefined,
    resend,
    goBack,
  };
};
