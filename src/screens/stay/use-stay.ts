import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import {
  Alert,
  Platform,
  Share,
  useWindowDimensions,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useStayDetails } from "@/hooks/use-stay-details"
import { posthog } from "@/lib/posthog"
import { clamp, isNil, round } from "@/lib/utils"

import { GALLERY_HEIGHT, GALLERY_MIN_HEIGHT, PANEL_OVERLAP } from "./constants"
import { toStayView } from "./utils"

// How long the web-only "coming soon" note stays up
const COMING_SOON_MS = 3000

/**
 * Orchestrator for a stay's details. The slug is the route; `src` says where the guest opened it from
 * (home, search, or a link), for `stay_viewed`.
 */
export const useStay = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { width, height } = useWindowDimensions()
  const { slug = "", src = "link" } = useLocalSearchParams<{ slug: string, src?: string }>()
  const { stay, status, retry } = useStayDetails(slug)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [saved, setSaved] = useState(false)
  const [comingSoon, setComingSoon] = useState(false)
  // Measured so the gallery can give up height until the whole panel, host row included, shows above the bar
  const [panelHeight, setPanelHeight] = useState(0)
  const [barHeight, setBarHeight] = useState(0)
  // Once per screen: a retry or a re-render never sends a second view
  const reported = useRef(false)

  useEffect(() => {
    if (status !== "ready" || reported.current) return
    reported.current = true
    posthog?.capture("stay_viewed", { stay_id: slug, source: src })
  }, [status, slug, src])

  useEffect(() => {
    if (!comingSoon) return
    const timer = setTimeout(() => setComingSoon(false), COMING_SOON_MS)

    return () => clearTimeout(timer)
  }, [comingSoon])

  const goBack = () => {
    if (router.canGoBack()) router.back()
    else router.replace("/home")
  }

  const toggleSave = () => {
    posthog?.capture(saved ? "stay_unsaved" : "stay_saved", { stay_id: slug })
    setSaved((s) => !s)
  }

  const share = async () => {
    if (isNil(stay)) return
    posthog?.capture("stay_shared", { stay_id: slug })
    try {
      await Share.share({ message: `${stay.title} in ${stay.city}, ${stay.region} on Roam` })
    } catch {
      // Dismissed, or no share target (some web browsers): nothing to recover
    }
  }

  const book = () => {
    posthog?.capture("stay_book_tapped", { stay_id: slug })
    // react-native-web's Alert is a no-op, so web shows an inline note instead
    if (Platform.OS === "web") {
      setComingSoon(true)

      return
    }
    Alert.alert("Booking is coming soon", "You'll be able to book stays in Roam soon.")
  }

  const openAsk = () => {
    posthog?.capture("stay_ask_opened", { stay_id: slug })
    router.push({ pathname: "/stay/[slug]/ask", params: { slug } })
  }

  const openHost = () => {
    posthog?.capture("stay_host_opened", { stay_id: slug })
    router.push({ pathname: "/stay/[slug]/host", params: { slug } })
  }

  const openPolicies = (section: "all" | "cancellation") => {
    posthog?.capture("stay_policies_opened", { stay_id: slug, section })
    router.push({ pathname: "/stay/[slug]/policies", params: { slug, section } })
  }

  // Paging snaps to whole photos, so the nearest page is the one showing
  const onGalleryScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setPhotoIndex(round(event.nativeEvent.contentOffset.x / width))
  }

  const measured = panelHeight > 0 && barHeight > 0
  const galleryHeight = measured
    ? clamp(height - barHeight - panelHeight + PANEL_OVERLAP, GALLERY_MIN_HEIGHT, GALLERY_HEIGHT)
    : GALLERY_HEIGHT

  return {
    status,
    retry,
    view: isNil(stay) ? null : toStayView(stay, width),
    width,
    galleryHeight,
    onPanelLayout: (event: LayoutChangeEvent) => setPanelHeight(round(event.nativeEvent.layout.height)),
    onBarLayout: (event: LayoutChangeEvent) => setBarHeight(round(event.nativeEvent.layout.height)),
    topInset: insets.top + 8,
    // The design ends the button ~20 above the screen edge, inside the home-indicator area
    bottomInset: clamp(insets.bottom - 12, 16, 40),
    photoIndex,
    onGalleryScroll,
    saved,
    toggleSave,
    share,
    goBack,
    book,
    comingSoon,
    openAsk,
    openHost,
    openPolicies,
  }
}
