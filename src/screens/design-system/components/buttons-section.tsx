import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";

import { GoogleLogoPlaceholder } from "./google-logo-placeholder";
import { SectionCard } from "./section-card";

export const ButtonsSection = () => (
  <SectionCard title="04. Buttons">
    <Button title="Book this stay" trailingIcon="arrowRight" />
    <Button title="Continue with Google" variant="secondary" leading={<GoogleLogoPlaceholder />} />
    <Button title="Book this stay" loading />
    <Button title="Book this stay" disabled />
    <View className="flex-row gap-4">
      <IconButton icon="heart" accessibilityLabel="Save stay" />
      <IconButton icon="share" accessibilityLabel="Share" />
      <IconButton icon="search" accessibilityLabel="Search" />
      <IconButton icon="bookmark" accessibilityLabel="Bookmark" />
    </View>
  </SectionCard>
);
