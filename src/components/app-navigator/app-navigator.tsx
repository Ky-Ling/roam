import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useAppNavigator } from "./use-app-navigator";

/** The root stack. Signed-out guests get onboarding and auth; signed-in guests get the app. */
export const AppNavigator = () => {
  const vm = useAppNavigator();

  if (!vm.ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        {/* Flipping the guard redirects and drops the other side's history, so Back can't cross it. */}
        <Stack.Protected guard={!vm.isSignedIn}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={vm.isSignedIn}>
          <Stack.Screen name="home" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Screen name="design-system" options={{ title: "Design system" }} />
      </Stack>
    </>
  );
};
