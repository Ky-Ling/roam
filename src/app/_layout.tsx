import "../../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useAppFonts } from "@/hooks/use-app-fonts";

const RootLayout = () => {
  const ready = useAppFonts();

  if (!ready) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="design-system" options={{ title: "Design system" }} />
      </Stack>
    </>
  );
};

export default RootLayout;
