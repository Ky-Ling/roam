import { useState } from "react";

import { signInWithOAuth, type OAuthProvider } from "@/lib/auth/mock-auth";

/** Continue with Google / Apple. On success the root layout's guard moves the guest to /home. */
export const useOAuthSignIn = () => {
  const [oauthLoading, setOAuthLoading] = useState<OAuthProvider>();
  const [oauthError, setOAuthError] = useState<string>();

  const continueWith = async (provider: OAuthProvider) => {
    setOAuthError(undefined);
    setOAuthLoading(provider);
    const result = await signInWithOAuth(provider);
    if (!result.ok) {
      setOAuthError(result.error);
      setOAuthLoading(undefined);
    }
  };

  return { oauthLoading, oauthError, clearOAuthError: () => setOAuthError(undefined), continueWith };
};
