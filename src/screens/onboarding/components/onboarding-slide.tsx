import { Image } from "expo-image"
import { StyleSheet, View } from "react-native"

import { GlassPill } from "@/components/ui/glass-pill"
import { Text } from "@/components/ui/text"

import type { Slide } from "../constants"
import { SheetCurve } from "./sheet-curve"

export type OnboardingSlideProps = {
  slide: Slide
  width: number
  height: number
  bottomInset: number
}

/**
 * One page: photo, location pill, and the sheet with its text. The spacers above and below
 * the text match the fixed progress bars and buttons drawn over every page by the screen.
 */
export const OnboardingSlide = ({ slide, width, height, bottomInset }: OnboardingSlideProps) => (
  <View style={{ width, height }}>
    {/* The photo runs 56 under the sheet so it shows through the curve's lower corners. */}
    <View className="flex-1 justify-end">
      <Image
        source={{ uri: slide.image }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        contentPosition={slide.focus}
        transition={200}
      />
      {/* 68 = 56 curve overlap + 12 gap above the sheet's peak */}
      <GlassPill label={slide.location} icon="pin" tone="dark" size="sm" className="mb-17 ml-6 self-start" />
    </View>
    <View className="-mt-14">
      <SheetCurve />
      <View className="absolute inset-x-0 top-14 bottom-0 bg-surface" />
      {/* 34 = bars' 30 offset from the sheet's peak + their 4 height */}
      <View className="px-6 pt-8.5" style={{ paddingBottom: bottomInset }}>
        <View className="mt-5 h-41 gap-2">
          {/* No numberOfLines: its overflow clip cuts descenders at this tight line height. */}
          <Text variant="hero">{slide.title}</Text>
          <Text variant="lead" tone="secondary" numberOfLines={3}>
            {slide.body}
          </Text>
        </View>
        {/* Room for the footer: 56 + 12 + 56 buttons, then 12 + 4 + 20 for the Sign in link */}
        <View className="mt-4 h-40" />
      </View>
    </View>
  </View>
)
