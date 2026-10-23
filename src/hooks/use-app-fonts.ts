import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

import { isNotNil } from "@/lib/utils"

// AppNavigator hides it once fonts and the Clerk session are both ready
SplashScreen.preventAutoHideAsync()

/** Loads Plus Jakarta Sans. Ready once the fonts load or fail (the system font is the fallback). */
export const useAppFonts = () => {
  // Keys are the fonts' PostScript names, so fontFamily matches on iOS, Android, and web.
  const [loaded, error] = useFonts({
    "PlusJakartaSans-Regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
  })

  return loaded || isNotNil(error)
}
