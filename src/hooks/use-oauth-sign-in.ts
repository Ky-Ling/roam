import { useSSO } from "@clerk/expo";
import { useState } from "react";

import { clerkErrorMessage } from "@/lib/auth/clerk";
import type { OAuthProvider } from "@/lib/auth/types";

const strategies = { google: "oauth_google" } as const;

/** Continue with Google in the system browser. On success the root layout's guard moves the guest to /home. */
export const useOAuthSignIn = () => {
  const { startSSOFlow } = useSSO();
  const [oauthLoading, setOAuthLoading] = useState<OAuthProvider>();
  const [oauthError, setOAuthError] = useState<string>();

  const continueWith = async (provider: OAuthProvider) => {
    setOAuthError(undefined);
    setOAuthLoading(provider);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy: strategies[provider] });
      // No session means the guest closed the browser: not an error
      if (createdSessionId) await setActive?.({ session: createdSessionId });
    } catch (err) {
      setOAuthError(clerkErrorMessage(err));
    } finally {
      setOAuthLoading(undefined);
    }
  };

  return { oauthLoading, oauthError, clearOAuthError: () => setOAuthError(undefined), continueWith };
};
