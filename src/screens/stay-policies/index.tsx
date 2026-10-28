import { ScrollView, View } from "react-native"

import { Button } from "@/components/ui/button"
import { IconButton } from "@/components/ui/icon-button"
import { StatusBanner } from "@/components/ui/status-banner"
import { Text } from "@/components/ui/text"

import { CancellationView, PolicySection } from "./components"
import { useStayPolicies } from "./use-stay-policies"

/** House rules and every policy that applies to a stay, word for word. Presented as a form sheet. */
export const StayPoliciesScreen = () => {
  const vm = useStayPolicies()

  return (
    // The scroll view is the sheet's only child: iOS gives a form sheet's scroll view the whole sheet, so a
    // sibling header gets drawn over. The title is a sticky header inside it instead.
    <ScrollView
      className="flex-1 bg-surface"
      stickyHeaderIndices={[0]}
      contentContainerStyle={{ paddingBottom: vm.bottomInset }}
    >
      {/* pt-7 clears the sheet's grabber */}
      <View className="flex-row items-center gap-3 bg-surface px-5 pb-3 pt-7">
        <Text variant="heading" accessibilityRole="header" className="flex-1">
          {vm.title}
        </Text>
        <IconButton icon="close" size="md" accessibilityLabel="Close" onPress={vm.close} />
      </View>
      <View className="gap-5 px-5 pt-2">
        {vm.status === "error" && (
          <View className="gap-3">
            <StatusBanner tone="error" message="Couldn't load this stay's policies." />
            <Button title="Try again" variant="secondary" onPress={vm.retry} />
          </View>
        )}
        {vm.status === "missing" && <Text variant="body">{"This stay isn't available anymore."}</Text>}
        {vm.cancellation && (
          <CancellationView summary={vm.cancellation.summary} steps={vm.cancellation.steps} roam={vm.cancellation.roam} />
        )}
        {vm.status === "ready" && vm.isCancellation && !vm.cancellation && (
          <Text variant="body">This stay has no cancellation policy yet.</Text>
        )}
        {vm.sections.map(({ key, ...section }) => (
          <PolicySection key={key} {...section} />
        ))}
        {vm.status === "ready" && (
          <Text variant="caption" tone="secondary">
            {"Can't find what you're looking for? Contact Roam support."}
          </Text>
        )}
      </View>
    </ScrollView>
  )
}
