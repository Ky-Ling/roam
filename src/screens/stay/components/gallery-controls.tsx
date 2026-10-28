import { View } from "react-native"

import { IconButton } from "@/components/ui/icon-button"

type GalleryControlsProps = {
  topInset: number
  onBack: () => void
  /** Share and save show only once the stay has loaded. */
  showActions: boolean
  saved?: boolean
  onShare?: () => void
  onToggleSave?: () => void
}

// Explicit left/right rather than inset-x: native drops the calc() Tailwind compiles inset-x-5 to,
// which collapsed the row and pulled share and save next to Back
const row = { left: 20, right: 20 }

/** Back on the left, share and save on the right, over the photos. Siblings of the gallery, never inside a Pressable. */
export const GalleryControls = ({ topInset, onBack, showActions, saved, onShare, onToggleSave }: GalleryControlsProps) => (
  <View
    className="absolute flex-row items-center justify-between"
    style={[row, { top: topInset }]}
    pointerEvents="box-none"
  >
    <IconButton icon="back" variant="surface" accessibilityLabel="Back" onPress={onBack} />
    {showActions && (
      <View className="flex-row gap-2.5">
        <IconButton icon="share" variant="surface" accessibilityLabel="Share stay" onPress={onShare} />
        <IconButton
          icon="heart"
          variant="surface"
          active={saved}
          accessibilityLabel={saved ? "Remove from saved" : "Save stay"}
          onPress={onToggleSave}
        />
      </View>
    )}
  </View>
)
