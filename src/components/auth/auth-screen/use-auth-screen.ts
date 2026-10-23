import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useAuthScreen = () => {
  const insets = useSafeAreaInsets();

  return {
    // The design sets the back button right under the status bar.
    topInset: Math.max(insets.top, 16),
    // Web and older devices report no inset; keep the footer off the screen edge.
    bottomInset: Math.max(insets.bottom, 16),
  };
};
