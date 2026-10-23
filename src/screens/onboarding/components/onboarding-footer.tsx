import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@/components/ui/google-logo";

import { ProgressBars } from "./progress-bars";

export type OnboardingFooterProps = {
  count: number;
  activeIndex: number;
  bottomInset: number;
  onGetStarted: () => void;
  onContinueWithGoogle: () => void;
};

/** Fixed over every page: progress bars, a pass-through gap for the slide text, then the buttons. */
export const OnboardingFooter = ({
  count,
  activeIndex,
  bottomInset,
  onGetStarted,
  onContinueWithGoogle,
}: OnboardingFooterProps) => (
  <View pointerEvents="box-none" className="absolute inset-x-0 bottom-0 px-6" style={{ paddingBottom: bottomInset }}>
    <ProgressBars count={count} activeIndex={activeIndex} />
    <View pointerEvents="none" className="mt-5 h-41" />
    <View className="mt-4 gap-3">
      <Button title="Get started" trailingIcon="arrowRight" onPress={onGetStarted} />
      <Button
        title="Continue with Google"
        variant="secondary"
        leading={<GoogleLogo />}
        onPress={onContinueWithGoogle}
      />
    </View>
  </View>
);
