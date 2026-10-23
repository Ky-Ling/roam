import { useSyncExternalStore } from "react";

import { clearSession, getSessionUser, subscribeSession } from "@/lib/auth/mock-session";

/** The signed-in guest. Clerk's useAuth / useUser replace the mock store behind this hook. */
export const useSession = () => {
  const user = useSyncExternalStore(subscribeSession, getSessionUser, getSessionUser);

  return { isSignedIn: !!user, user, signOut: clearSession };
};
