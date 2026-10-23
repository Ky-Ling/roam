import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { useProfile } from "./use-profile";

// PLACEHOLDER: the profile screen (profile.png) arrives in a later plan.
export const ProfileScreen = () => {
  const vm = useProfile();

  return (
    <View className="flex-1 gap-6 bg-surface px-6" style={{ paddingTop: vm.topInset + 24 }}>
      <View className="gap-2">
        <Text variant="heading">{vm.name ?? "Profile"}</Text>
        <Text tone="secondary">{vm.email}</Text>
      </View>
      <Button title="Sign out" variant="secondary" onPress={vm.signOut} />
    </View>
  );
};
