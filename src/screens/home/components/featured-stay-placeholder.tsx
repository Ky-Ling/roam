import { View } from "react-native"

/** Holds a card's space while stays load. Static on purpose: the load is short. */
export const FeaturedStayPlaceholder = () => (
  <View accessibilityElementsHidden className="h-70 rounded-2xl bg-surface-muted corner-squircle" />
)
