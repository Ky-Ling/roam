import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useSession } from "@/hooks/use-session";

/** Orchestrator for the home placeholder: who's signed in, and signing out. */
export const useHome = () => {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useSession();

  return { topInset: insets.top, displayName: user?.name ?? user?.email ?? "", signOut };
};
