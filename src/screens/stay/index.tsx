import { ScrollView, View } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

import { PolicyCard } from "@/components/ui/policy-card"
import { DURATION, EASE_OUT } from "@/constants/motion"

import {
  BookingBar,
  ComingSoonNote,
  GalleryControls,
  HighlightsRow,
  HostRow,
  PhotoCounter,
  PhotoGallery,
  StayHeader,
  StayPlaceholder,
  StayStatus,
} from "./components"
import { PANEL_OVERLAP } from "./constants"
import { useStay } from "./use-stay"

// The panel fades in when the stay lands. A fade only, so reduced motion keeps it as is.
const panelEntering = FadeIn.duration(DURATION.enter).easing(EASE_OUT)

// Inline rather than -mt-3/-mx-1, which no other screen proves on native
const panelOverlap = { marginTop: -PANEL_OVERLAP }
const widerRow = { marginHorizontal: -4 }

export const StayScreen = () => {
  const { view, ...vm } = useStay()

  if (vm.status !== "ready" || !view) {
    return (
      <View className="flex-1 bg-surface">
        {vm.status === "loading" ? (
          <StayPlaceholder />
        ) : (
          <StayStatus
            kind={vm.status === "missing" ? "missing" : "error"}
            topInset={vm.topInset}
            onRetry={vm.retry}
            onBack={vm.goBack}
          />
        )}
        <GalleryControls topInset={vm.topInset} onBack={vm.goBack} showActions={false} />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-surface">
      {/* The photos run under the status bar, so no automatic inset */}
      <ScrollView className="flex-1" contentInsetAdjustmentBehavior="never" showsVerticalScrollIndicator={false}>
        <View>
          <PhotoGallery photos={view.photos} width={vm.width} height={vm.galleryHeight} onScroll={vm.onGalleryScroll} />
          <GalleryControls
            topInset={vm.topInset}
            onBack={vm.goBack}
            showActions
            saved={vm.saved}
            onShare={vm.share}
            onToggleSave={vm.toggleSave}
          />
          {view.photos.length > 1 && <PhotoCounter index={vm.photoIndex} count={view.photos.length} />}
        </View>

        <Animated.View entering={panelEntering}>
          {/* Spacing follows the design: the panel barely overlaps the photo, cards and host sit 4 wider */}
          <View className="rounded-t-md bg-surface px-5 pb-2 pt-5" style={panelOverlap} onLayout={vm.onPanelLayout}>
            <StayHeader
              title={view.title}
              location={view.location}
              rating={view.rating}
              reviewCount={view.reviewCount}
            />
            <View className="mt-5 border-b border-border pb-4">
              <HighlightsRow highlights={view.highlights} />
            </View>
            <View className="mt-2 gap-2.5" style={widerRow}>
              <PolicyCard
                icon="policyChat"
                title="Ask about policies"
                description="Cancellation, house rules, pets, check-in and more."
                onPress={vm.openAsk}
              />
              {view.cancellation && (
                <PolicyCard
                  icon="document"
                  iconBox={false}
                  title={view.cancellation.title}
                  description={view.cancellation.summary}
                  onPress={() => vm.openPolicies("cancellation")}
                />
              )}
            </View>
            {view.host && (
              <View className="mt-2.5" style={widerRow}>
                <HostRow {...view.host} onPress={vm.openHost} />
              </View>
            )}
          </View>
        </Animated.View>
      </ScrollView>

      <View onLayout={vm.onBarLayout}>
        {vm.comingSoon && <ComingSoonNote />}
        <BookingBar price={view.price} total={view.total} bottomInset={vm.bottomInset} onBook={vm.book} />
      </View>
    </View>
  )
}
