import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@/components/ui/google-logo";
import type { OAuthProvider } from "@/lib/auth/types";

type SocialButtonsProps = {
  onContinue: (provider: OAuthProvider) => void;
  /** The provider whose request is running; it shows the spinner. */
  loadingProvider?: OAuthProvider;
  disabled?: boolean;
};

// The design lines both logos and both labels up in one column, inset from the left edge.
const logoSlot = "ml-10 mr-5";

export const SocialButtons = ({ onContinue, loadingProvider, disabled }: SocialButtonsProps) => (
  <View className="gap-3">
    <Button
      title="Continue with Google"
      variant="secondary"
      align="start"
      titleVariant="caption"
      leading={
        <View className={logoSlot}>
          <GoogleLogo />
        </View>
      }
      loading={loadingProvider === "google"}
      disabled={disabled && loadingProvider !== "google"}
      onPress={() => onContinue("google")}
    />
    {/* Continue with Apple returns once Apple is configured in Clerk (AppleLogo is ready in ui/) */}
  </View>
);
