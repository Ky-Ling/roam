import { View } from "react-native"

import { AuthIntro } from "@/components/auth/auth-intro"
import { AuthScreen } from "@/components/auth/auth-screen"
import { AuthSwitchLink } from "@/components/auth/auth-switch-link"
import { OrDivider } from "@/components/auth/or-divider"
import { SocialButtons } from "@/components/auth/social-buttons"
import { Button } from "@/components/ui/button"
import { StatusBanner } from "@/components/ui/status-banner"

import { SignUpForm } from "./components"
import { useSignUp } from "./use-sign-up"

export const SignUpScreen = () => {
  // The refs come out on their own: the React Compiler treats any object holding a ref as ref-like.
  const { refs, ...vm } = useSignUp()

  return (
    <AuthScreen onBack={vm.goBack}>
      <AuthIntro title={"Create\nyour account"}>
        Join roam to save your stays, get personalized recommendations and access them across all your devices.
      </AuthIntro>
      <View className="mt-6">
        <SignUpForm
          emailRef={refs.email}
          passwordRef={refs.password}
          name={vm.name}
          email={vm.email}
          password={vm.password}
          nameError={vm.nameError}
          emailError={vm.emailError}
          passwordError={vm.passwordError}
          onChangeName={vm.setName}
          onChangeEmail={vm.setEmail}
          onChangePassword={vm.setPassword}
          onNameDone={vm.focusEmail}
          onEmailDone={vm.focusPassword}
          onSubmit={vm.submit}
          editable={!vm.busy}
        />
      </View>
      {vm.error && <StatusBanner tone="error" message={vm.error} className="mt-6" />}
      <Button
        title="Create account"
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
        <AuthSwitchLink
          prompt="Already have an account?"
          action="Sign in"
          onPress={vm.goToSignIn}
          disabled={vm.busy}
        />
      </View>
    </AuthScreen>
  )
}
