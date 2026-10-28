import { NativeTabs } from "expo-router/unstable-native-tabs"

import { colors } from "@/theme"

// The platform's own tab bar: liquid glass on iOS 26, Material on Android. Tab switches never animate.
// iOS can't draw the design's yellow pill, so selection is ink there; Android's indicator takes the yellow.
// iOS 18 and earlier make the bar transparent at a scroll edge, and on any screen where it can't find the
// scroll view (Search's nested FlatList, static Trips/Profile), so keep it solid everywhere. iOS 26 ignores it.
export const AppTabs = () => (
  <NativeTabs
    disableTransparentOnScrollEdge
    tintColor={colors.ink}
    iconColor={{ default: colors.inkSecondary, selected: colors.ink }}
    indicatorColor={colors.primary}
    labelStyle={{ fontFamily: "PlusJakartaSans-Medium", fontSize: 12 }}
  >
    <NativeTabs.Trigger name="home">
      <NativeTabs.Trigger.Icon sf={{ default: "house", selected: "house.fill" }} md="home" />
      <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
    </NativeTabs.Trigger>
    {/* Not role="search": iOS 26 would swap it for a system search field that duplicates ours */}
    <NativeTabs.Trigger name="search">
      <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
      <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="trips">
      <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
      <NativeTabs.Trigger.Label>Trips</NativeTabs.Trigger.Label>
    </NativeTabs.Trigger>
    <NativeTabs.Trigger name="profile">
      <NativeTabs.Trigger.Icon sf={{ default: "person", selected: "person.fill" }} md="person" />
      <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
    </NativeTabs.Trigger>
  </NativeTabs>
)
