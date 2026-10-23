import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useSession } from "@/hooks/use-session"

/** Orchestrator for the profile placeholder: who's signed in, and signing out. */
export const useProfile = () => {
  const insets = useSafeAreaInsets()
  const { user, signOut } = useSession()

  return { topInset: insets.top, name: user?.name, email: user?.email ?? "", signOut }
}
