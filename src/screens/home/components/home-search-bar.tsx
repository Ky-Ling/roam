import { TextInput, View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { PressableScale } from "@/components/ui/pressable-scale"
import { colors } from "@/theme"

type HomeSearchBarProps = {
  value: string
  placeholder: string
  onChangeText: (text: string) => void
  onSubmit: () => void
}

export const HomeSearchBar = ({ value, placeholder, onChangeText, onSubmit }: HomeSearchBarProps) => (
  <View className="h-16 flex-row items-center gap-2.5 rounded-full bg-lavender pl-4 pr-2">
    <Icon name="sparkles" size={20} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmit}
      placeholder={placeholder}
      accessibilityLabel="Describe your stay"
      returnKeyType="search"
      // Matches TextField: no line-height, no Android font padding, so the text centers on the icon
      className="flex-1 py-0 type-input-sm text-ink"
      textAlignVertical="center"
      style={{ includeFontPadding: false }}
      placeholderTextColor={colors.ink}
      selectionColor={colors.indigo}
      cursorColor={colors.indigo}
    />
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel="Find stays"
      hitSlop={4}
      onPress={onSubmit}
      className="size-12 items-center justify-center rounded-full bg-surface"
    >
      <Icon name="arrowUpRight" size={24} />
    </PressableScale>
  </View>
)
