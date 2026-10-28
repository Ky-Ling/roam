import { useLocalSearchParams, useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useStayDetails } from "@/hooks/use-stay-details"
import { isNil } from "@/lib/utils"

import { toHostView } from "./utils"

/** Orchestrator for the host sheet. Reads the host from the details screen's session cache. */
export const useStayHost = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { slug = "" } = useLocalSearchParams<{ slug: string }>()
  const { stay, status, retry } = useStayDetails(slug)

  return {
    status,
    retry,
    // The last stay clears the home indicator
    bottomInset: insets.bottom + 24,
    host: isNil(stay?.host) ? null : toHostView(stay.host),
    close: () => {
      if (router.canGoBack()) router.back()
      else router.replace({ pathname: "/stay/[slug]", params: { slug } })
    },
    // Replacing the sheet pops it and pushes the stay in one step, so Back returns to the first stay
    openStay: (id: string) => router.replace({ pathname: "/stay/[slug]", params: { slug: id, src: "host" } }),
  }
}
