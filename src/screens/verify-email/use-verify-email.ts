import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import type { TextInput } from "react-native";

import { getPendingSignUp, resendEmailCode, verifyEmailCode } from "@/lib/auth/mock-auth";

import { CODE_LENGTH, RESEND_COOLDOWN_S } from "./constants";
import { formatCountdown, sanitizeCode } from "./utils";

/** Orchestrator for email verification: the code, checking it, and resending with a cooldown. */
export const useVerifyEmail = () => {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  // Read once: the pending sign-up only changes when this screen succeeds and leaves.
  const [email] = useState(() => getPendingSignUp()?.email);
  const [code, setCode] = useState("");
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  // The first code went out with sign-up, so the cooldown starts right away.
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_S);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((s) => s - 1), 1000);

    return () => clearTimeout(id);
  }, [cooldown]);

  const changeCode = (value: string) => {
    setCode(sanitizeCode(value, CODE_LENGTH));
    setError(undefined);
  };

  const verify = async () => {
    if (code.length < CODE_LENGTH) return;
    setNotice(undefined);
    setLoading(true);
    const result = await verifyEmailCode({ code });
    // On success the root layout's guard moves the guest to /home.
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
    }
  };

  const resend = async () => {
    setError(undefined);
    setNotice(undefined);
    setResending(true);
    const result = await resendEmailCode();
    setResending(false);
    if (!result.ok) {
      setError(result.error);

      return;
    }
    setCode("");
    setCooldown(RESEND_COOLDOWN_S);
    setNotice(`We sent a new code to ${email}.`);
    inputRef.current?.focus();
  };

  return {
    inputRef,
    email,
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
    goBack: router.back,
  };
};
