import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"

import { useAppFonts } from "@/hooks/use-app-fonts"
import { usePostHogIdentity } from "@/hooks/use-posthog-identity"
import { useSession } from "@/hooks/use-session"

/** Holds the splash screen until fonts and the restored Clerk session are both ready. */
export const useAppNavigator = () => {
  const fontsReady = useAppFonts()
  const { isLoaded, isSignedIn } = useSession()
  usePostHogIdentity()
  // Waiting for Clerk keeps a signed-in guest from flashing onboarding on launch
  const ready = fontsReady && isLoaded

  useEffect(() => {
    if (ready) SplashScreen.hideAsync()
  }, [ready])

  return { ready, isSignedIn }
}
