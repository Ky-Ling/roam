import { Redirect } from "expo-router";
import { Pressable, View } from "react-native";

import { AuthIntro } from "@/components/auth/auth-intro";
import { AuthScreen } from "@/components/auth/auth-screen";
import { Button } from "@/components/ui/button";
import { StatusBanner } from "@/components/ui/status-banner";
import { Text } from "@/components/ui/text";

import { CodeBoxes } from "./components";
import { useVerifyEmail } from "./use-verify-email";

export const VerifyEmailScreen = () => {
  // The ref comes out on its own: the React Compiler treats any object holding a ref as ref-like.
  const { inputRef, ...vm } = useVerifyEmail();

  // Opened without a sign-up in progress (deep link or reload): start over.
  if (!vm.email) return <Redirect href="/sign-up" />;

  return (
    <AuthScreen onBack={vm.goBack}>
      <AuthIntro title={"Check\nyour email"}>
        We sent a 6-digit code to{" "}
        <Text variant="lead" className="font-jakarta-semibold">
          {vm.email}
        </Text>
        . Enter it below to finish creating your account.
      </AuthIntro>
      <View className="mt-6">
        <CodeBoxes
          inputRef={inputRef}
          code={vm.code}
          length={vm.codeLength}
          focused={vm.focused}
          error={vm.hasError}
          editable={!vm.loading}
          onChangeCode={vm.changeCode}
          onFocus={vm.onFocus}
          onBlur={vm.onBlur}
          onSubmit={vm.verify}
        />
      </View>
      {vm.error && <StatusBanner tone="error" message={vm.error} className="mt-6" />}
      {vm.notice && <StatusBanner tone="success" message={vm.notice} className="mt-6" />}
      <Button
        title="Verify email"
        trailingIcon="arrowRight"
        loading={vm.loading}
        disabled={!vm.canVerify}
        onPress={vm.verify}
        className="mt-6"
      />
      <View className="mt-6 flex-row justify-center">
        <Text variant="caption" tone="secondary">
          Didn&apos;t get a code?{" "}
        </Text>
        {vm.cooldownLabel ? (
          <Text variant="caption" tone="tertiary">
            Resend in {vm.cooldownLabel}
          </Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            disabled={!vm.canResend}
            hitSlop={8}
            onPress={vm.resend}
            className="active:opacity-85"
          >
            <Text variant="caption" className="font-jakarta-semibold underline">
              {vm.resending ? "Sending…" : "Resend"}
            </Text>
          </Pressable>
        )}
      </View>
    </AuthScreen>
  );
};
