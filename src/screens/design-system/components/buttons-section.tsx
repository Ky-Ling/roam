import { View } from "react-native"

import { AppleLogo } from "@/components/ui/apple-logo"
import { Button } from "@/components/ui/button"
import { GoogleLogo } from "@/components/ui/google-logo"
import { IconButton } from "@/components/ui/icon-button"

import { SectionCard } from "./section-card"

export const ButtonsSection = () => (
  <SectionCard title="04. Buttons">
    <Button title="Book this stay" trailingIcon="arrowRight" />
    <Button title="Continue with Google" variant="secondary" leading={<GoogleLogo />} />
    <Button title="Continue with Apple" variant="secondary" leading={<AppleLogo />} />
    <Button title="Book this stay" loading />
    <Button title="Book this stay" disabled />
    <View className="flex-row gap-4">
      <IconButton icon="heart" accessibilityLabel="Save stay" />
      <IconButton icon="share" accessibilityLabel="Share" />
      <IconButton icon="search" accessibilityLabel="Search" />
      <IconButton icon="bookmark" accessibilityLabel="Bookmark" />
      <IconButton icon="back" variant="outline" size="md" accessibilityLabel="Back" />
    </View>
  </SectionCard>
)
