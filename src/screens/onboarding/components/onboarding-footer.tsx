import { View } from "react-native";

import { AuthSwitchLink } from "@/components/auth/auth-switch-link";
import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@/components/ui/google-logo";
import { StatusBanner } from "@/components/ui/status-banner";

import { ProgressBars } from "./progress-bars";

export type OnboardingFooterProps = {
  count: number;
  activeIndex: number;
  bottomInset: number;
  googleLoading: boolean;
  error?: string;
  onGetStarted: () => void;
  onContinueWithGoogle: () => void;
  onSignIn: () => void;
};

/** Fixed over every page: progress bars, a pass-through gap for the slide text, then the buttons. */
export const OnboardingFooter = ({
  count,
  activeIndex,
  bottomInset,
  googleLoading,
  error,
  onGetStarted,
  onContinueWithGoogle,
  onSignIn,
}: OnboardingFooterProps) => (
  <View pointerEvents="box-none" className="absolute inset-x-0 bottom-0 px-6" style={{ paddingBottom: bottomInset }}>
    <ProgressBars count={count} activeIndex={activeIndex} />
    <View pointerEvents="none" className="mt-5 h-41" />
    <View className="mt-4 gap-3">
      {error && <StatusBanner tone="error" message={error} />}
      <Button title="Get started" trailingIcon="arrowRight" disabled={googleLoading} onPress={onGetStarted} />
      <Button
        title="Continue with Google"
        variant="secondary"
        leading={<GoogleLogo />}
        loading={googleLoading}
        onPress={onContinueWithGoogle}
      />
      {/* Not in the mockup: returning guests need a way to sign in without starting sign-up */}
      <View className="pt-1">
        <AuthSwitchLink prompt="Already have an account?" action="Sign in" disabled={googleLoading} onPress={onSignIn} />
      </View>
    </View>
  </View>
);
