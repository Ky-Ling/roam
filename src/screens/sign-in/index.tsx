import { View } from "react-native"

import { AuthIntro } from "@/components/auth/auth-intro"
import { AuthScreen } from "@/components/auth/auth-screen"
import { AuthSwitchLink } from "@/components/auth/auth-switch-link"
import { OrDivider } from "@/components/auth/or-divider"
import { SocialButtons } from "@/components/auth/social-buttons"
import { Button } from "@/components/ui/button"
import { StatusBanner } from "@/components/ui/status-banner"

import { SignInForm } from "./components"
import { useSignIn } from "./use-sign-in"

export const SignInScreen = () => {
  // The refs come out on their own: the React Compiler treats any object holding a ref as ref-like.
  const { refs, ...vm } = useSignIn()

  return (
    <AuthScreen onBack={vm.goBack}>
      <AuthIntro title={"Welcome\nback"}>Sign in to see your saved stays, trips and recommendations.</AuthIntro>
      <View className="mt-6">
        <SignInForm
          passwordRef={refs.password}
          email={vm.email}
          password={vm.password}
          emailError={vm.emailError}
          passwordError={vm.passwordError}
          onChangeEmail={vm.setEmail}
          onChangePassword={vm.setPassword}
          onEmailDone={vm.focusPassword}
          onSubmit={vm.submit}
          onForgotPassword={vm.forgotPassword}
          editable={!vm.busy}
        />
      </View>
      {vm.error && <StatusBanner tone="error" message={vm.error} className="mt-6" />}
      <Button
        title="Sign in"
        trailingIcon="arrowRight"
        loading={vm.loading}
        disabled={vm.busy && !vm.loading}
        onPress={vm.submit}
        className="mt-6"
      />
      <View className="my-4">
        <OrDivider />
      </View>
      <SocialButtons onContinue={vm.continueWith} loadingProvider={vm.oauthLoading} disabled={vm.busy} />
      <View className="mt-auto pt-6">
        <AuthSwitchLink prompt="New to roam?" action="Create account" onPress={vm.goToSignUp} disabled={vm.busy} />
      </View>
    </AuthScreen>
  )
}
