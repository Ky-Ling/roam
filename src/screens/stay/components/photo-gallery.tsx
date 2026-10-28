import { Image } from "expo-image"
import { FlatList, View, type NativeScrollEvent, type NativeSyntheticEvent } from "react-native"

type PhotoGalleryProps = {
  photos: { url: string, alt?: string }[]
  width: number
  height: number
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

/** Full-width photos, one page per swipe. Photos are cropped to the tallest gallery and cover shorter ones. */
export const PhotoGallery = ({ photos, width, height, onScroll }: PhotoGalleryProps) => (
  <FlatList
    data={photos}
    keyExtractor={(photo) => photo.url}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    onScroll={onScroll}
    scrollEventThrottle={16}
    style={{ height }}
    renderItem={({ item }) => (
      <View className="bg-surface-muted" style={{ width, height }}>
        <Image
          source={{ uri: item.url }}
          accessibilityLabel={item.alt}
          style={{ width, height }}
          contentFit="cover"
          transition={200}
        />
      </View>
    )}
  />
)
