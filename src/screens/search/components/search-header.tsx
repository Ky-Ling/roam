import { TextInput, View } from "react-native"

import { Icon } from "@/components/ui/icon"
import { IconButton } from "@/components/ui/icon-button"
import { colors } from "@/theme"

type SearchHeaderProps = {
  value: string
  onChangeText: (text: string) => void
  onSubmit: () => void
  onBack: () => void
}

export const SearchHeader = ({ value, onChangeText, onSubmit, onBack }: SearchHeaderProps) => (
  <View className="flex-row items-center gap-3">
    <IconButton icon="back" accessibilityLabel="Back to home" onPress={onBack} />
    <View className="h-14 flex-1 flex-row items-center gap-3 rounded-full bg-surface-muted px-5">
      <Icon name="search" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder="Describe your stay"
        accessibilityLabel="Search stays"
        returnKeyType="search"
        clearButtonMode="while-editing"
        className="flex-1 py-0 type-input text-ink"
        textAlignVertical="center"
        style={{ includeFontPadding: false }}
        placeholderTextColor={colors.inkTertiary}
        selectionColor={colors.lavenderStrong}
        cursorColor={colors.lavenderStrong}
      />
      {/* The filters sheet is a later plan; the icon is here to match the design */}
      <View accessible accessibilityLabel="Filters, coming soon">
        <Icon name="filters" />
      </View>
    </View>
  </View>
)
