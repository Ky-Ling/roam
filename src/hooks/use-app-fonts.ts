import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

import { isNotNil } from "@/lib/utils";

SplashScreen.preventAutoHideAsync();

/** Loads Plus Jakarta Sans and hides the splash screen once fonts are ready (or failed). */
export const useAppFonts = () => {
  // Keys are the fonts' PostScript names, so fontFamily matches on iOS, Android, and web.
  const [loaded, error] = useFonts({
    "PlusJakartaSans-Regular": require("@/assets/fonts/PlusJakartaSans-Regular.ttf"),
    "PlusJakartaSans-Medium": require("@/assets/fonts/PlusJakartaSans-Medium.ttf"),
    "PlusJakartaSans-SemiBold": require("@/assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "PlusJakartaSans-Bold": require("@/assets/fonts/PlusJakartaSans-Bold.ttf"),
  });
  const ready = loaded || isNotNil(error);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  return ready;
};
