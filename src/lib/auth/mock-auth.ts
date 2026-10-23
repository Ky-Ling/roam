import { delay } from "@/lib/utils";

import { setSessionUser, type SessionUser } from "./mock-session";

// MOCK: shaped like Clerk's sign-up / sign-in flow so Clerk can replace it behind the same calls.
export type AuthResult = { ok: true } | { ok: false; error: string };
export type OAuthProvider = "google" | "apple";

/** Clerk's test-mode verification code. */
export const MOCK_VERIFICATION_CODE = "424242";

const LATENCY_MS = 800;

let pendingSignUp: SessionUser | null = null;

export const getPendingSignUp = () => pendingSignUp;

export const signUp = async ({ name, email }: { name: string; email: string; password: string }): Promise<AuthResult> => {
  await delay(LATENCY_MS);
  pendingSignUp = { name, email };

  return { ok: true };
};

export const verifyEmailCode = async ({ code }: { code: string }): Promise<AuthResult> => {
  await delay(LATENCY_MS);
  if (!pendingSignUp) return { ok: false, error: "Your sign-up expired. Start again." };
  if (code !== MOCK_VERIFICATION_CODE) {
    return { ok: false, error: "That code isn't right. Check your email and try again." };
  }
  setSessionUser(pendingSignUp);
  pendingSignUp = null;

  return { ok: true };
};

export const resendEmailCode = async (): Promise<AuthResult> => {
  await delay(LATENCY_MS);

  return { ok: true };
};

export const signIn = async ({ email }: { email: string; password: string }): Promise<AuthResult> => {
  await delay(LATENCY_MS);
  setSessionUser({ email });

  return { ok: true };
};

export const signInWithOAuth = async (provider: OAuthProvider): Promise<AuthResult> => {
  await delay(LATENCY_MS);
  setSessionUser({ name: provider === "google" ? "Google guest" : "Apple guest", email: "guest@example.com" });

  return { ok: true };
};
