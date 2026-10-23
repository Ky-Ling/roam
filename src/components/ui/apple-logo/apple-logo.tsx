import { SymbolView } from "expo-symbols";
import { View } from "react-native";

import { colors } from "@/theme";

import { Text } from "../text";

// Apple's own glyph from SF Symbols on iOS, drawn at 24 like the Google "G".
// PLACEHOLDER (Android/web): Material Symbols has no Apple logo. Swap for the official asset once provided.
export const AppleLogo = () => (
  <SymbolView
    name={{ ios: "apple.logo" }}
    size={24}
    tintColor={colors.ink}
    accessibilityElementsHidden
    fallback={
      <View className="size-6 items-center justify-center rounded-full bg-ink">
        <Text variant="label" tone="white" className="font-jakarta-bold">
          A
        </Text>
      </View>
    }
  />
);
