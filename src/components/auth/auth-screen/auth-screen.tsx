import type { ReactNode } from "react"
import { ScrollView, View } from "react-native"

import { IconButton } from "@/components/ui/icon-button"
import { Wordmark } from "@/components/ui/wordmark"

import { useAuthScreen } from "./use-auth-screen"

/** Shell for every auth screen: back button + wordmark header over a keyboard-aware scroll. */
export const AuthScreen = ({ onBack, children }: { onBack: () => void, children: ReactNode }) => {
  const vm = useAuthScreen()

  return (
    <ScrollView
      className="flex-1 bg-surface"
      contentContainerClassName="grow px-6"
      contentContainerStyle={{ paddingTop: vm.topInset, paddingBottom: vm.bottomInset }}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center justify-between">
        <IconButton icon="back" variant="outline" size="md" accessibilityLabel="Back" onPress={onBack} />
        <Wordmark size="sm" />
      </View>
      {children}
    </ScrollView>
  )
}
