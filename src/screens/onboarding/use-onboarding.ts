import { useRouter } from "expo-router";
import { useState } from "react";
import { useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { clamp } from "@/lib/utils";

import { SLIDES } from "./constants";

/** Orchestrator for onboarding: page size, the active slide, and the way into auth. */
export const useOnboarding = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = clamp(Math.round(e.nativeEvent.contentOffset.x / width), 0, SLIDES.length - 1);
    if (next !== index) setIndex(next);
  };

  const getItemLayout = (_: unknown, i: number) => ({ length: width, offset: width * i, index: i });

  const goToAuth = () => router.push("/sign-up");

  return {
    slides: SLIDES,
    width,
    height,
    // The design tucks the wordmark right under the status bar.
    topInset: Math.max(insets.top - 8, 8),
    // Web and older devices report no inset; keep the buttons off the screen edge.
    bottomInset: Math.max(insets.bottom, 16),
    index,
    onScroll,
    getItemLayout,
    goToAuth,
  };
};
