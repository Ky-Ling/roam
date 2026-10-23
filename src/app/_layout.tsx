import "../../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useAppFonts } from "@/hooks/use-app-fonts";
import { useSession } from "@/hooks/use-session";

const RootLayout = () => {
  const ready = useAppFonts();
  const { isSignedIn } = useSession();

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        {/* Flipping the guard redirects and drops the other side's history, so Back can't cross it. */}
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="design-system" options={{ title: "Design system" }} />
      </Stack>
    </>
  );
};

export default RootLayout;
