import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Wordmark } from "@/components/ui/wordmark";

import { useHome } from "./use-home";

// PLACEHOLDER: the real home screen arrives in a later plan.
export const HomeScreen = () => {
  const vm = useHome();

  return (
    <View className="flex-1 gap-6 bg-surface px-6" style={{ paddingTop: vm.topInset + 8 }}>
      <Wordmark size="sm" />
      <View className="gap-3">
        <Text variant="heading">You&apos;re in</Text>
        <Text tone="secondary">
          Signed in as {vm.displayName}. The home screen arrives in a later plan.
        </Text>
      </View>
      <Button title="Sign out" variant="secondary" onPress={vm.signOut} />
    </View>
  );
};
