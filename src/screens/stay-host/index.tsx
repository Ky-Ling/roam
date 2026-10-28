import { ScrollView, View } from "react-native"

import { IconButton } from "@/components/ui/icon-button"
import { Text } from "@/components/ui/text"
import { isEmpty } from "@/lib/utils"

import { HostFacts, HostProfile, HostStatus, HostStayRow } from "./components"
import { useStayHost } from "./use-stay-host"

/** The stay's host: profile, facts, bio word for word, and their other stays. Presented as a form sheet. */
export const StayHostScreen = () => {
  const { host, ...vm } = useStayHost()

  return (
    // Same shape as the policies sheet: the scroll view is the sheet's only content (iOS gives a form
    // sheet's scroll view the whole sheet), with the close button as a sticky header inside it
    <ScrollView
      className="flex-1 bg-surface"
      stickyHeaderIndices={[0]}
      contentContainerStyle={{ paddingBottom: vm.bottomInset }}
    >
      {/* pt-5 clears the sheet's grabber */}
      <View className="flex-row justify-end bg-surface px-5 pb-1 pt-5">
        <IconButton icon="close" size="md" accessibilityLabel="Close" onPress={vm.close} />
      </View>
      <View className="gap-6 px-5">
        {host ? (
          <>
            <HostProfile name={host.name} photoUrl={host.photoUrl} superhost={host.superhost} />
            <HostFacts facts={host.facts} />
            {host.bio && (
              <View className="gap-2 border-t border-border pt-5">
                <Text variant="title" accessibilityRole="header">
                  About {host.name}
                </Text>
                <Text variant="body" tone="secondary">
                  {host.bio}
                </Text>
              </View>
            )}
            {!isEmpty(host.stays) && (
              <View className="gap-4 border-t border-border pt-5">
                <Text variant="title" accessibilityRole="header">
                  {`${host.name}'s other stays`}
                </Text>
                {host.stays.map(({ id, ...stay }) => (
                  <HostStayRow key={id} {...stay} onPress={() => vm.openStay(id)} />
                ))}
              </View>
            )}
          </>
        ) : (
          <HostStatus status={vm.status} onRetry={vm.retry} />
        )}
      </View>
    </ScrollView>
  )
}
