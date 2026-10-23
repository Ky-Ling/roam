import { Link } from "expo-router";
import { View } from "react-native";

import { Text } from "@/components/ui/text";

const Index = () => (
  <View className="flex-1 items-center justify-center gap-4 bg-surface px-6">
    <Text variant="heading" className="text-center">
      Edit src/app/index.tsx to edit this screen.
    </Text>
    {__DEV__ && (
      <Link href="/design-system">
        <Text variant="body-medium" tone="indigo">
          Open design system
        </Text>
      </Link>
    )}
  </View>
);

export default Index;
