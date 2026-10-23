import { FlatList, View } from "react-native"

import { OnboardingFooter, OnboardingHeader, OnboardingSlide } from "./components"
import { useOnboarding } from "./use-onboarding"

/** First screen: a 3-slide photo carousel with fixed brand header and auth buttons. */
export const OnboardingScreen = () => {
  const vm = useOnboarding()

  return (
    <View className="flex-1 bg-surface">
      <FlatList
        data={vm.slides}
        keyExtractor={(slide) => slide.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={vm.onScroll}
        getItemLayout={vm.getItemLayout}
        renderItem={({ item }) => (
          <OnboardingSlide slide={item} width={vm.width} height={vm.height} bottomInset={vm.bottomInset} />
        )}
      />
      <OnboardingHeader topInset={vm.topInset} onSkip={vm.goToAuth} />
      <OnboardingFooter
        count={vm.slides.length}
        activeIndex={vm.index}
        bottomInset={vm.bottomInset}
        googleLoading={vm.googleLoading}
        error={vm.error}
        onGetStarted={vm.goToAuth}
        onContinueWithGoogle={vm.continueWithGoogle}
        onSignIn={vm.goToSignIn}
      />
    </View>
  )
}
