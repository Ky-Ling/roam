import { useLocalSearchParams, useRouter } from "expo-router"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useStayDetails } from "@/hooks/use-stay-details"
import { isNil } from "@/lib/utils"

import { toCancellationView, toSections, type PolicySection } from "./utils"

/** Orchestrator for the policies sheet. Reads the stay from the details screen's session cache. */
export const useStayPolicies = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { slug = "", section = "all" } = useLocalSearchParams<{ slug: string, section?: PolicySection }>()
  const { stay, status, retry } = useStayDetails(slug)
  const isCancellation = section === "cancellation"

  return {
    // The cancellation sheet is titled by the policy itself ("Free cancellation"), as on the details card
    title: isCancellation ? (stay?.cancellationPolicy?.title ?? "Cancellation policy") : "House rules and policies",
    isCancellation,
    // The last line clears the home indicator
    bottomInset: insets.bottom + 24,
    status,
    retry,
    sections: isNil(stay) || isCancellation ? [] : toSections(stay),
    cancellation: isNil(stay) || !isCancellation ? null : toCancellationView(stay),
    close: () => {
      if (router.canGoBack()) router.back()
      else router.replace({ pathname: "/stay/[slug]", params: { slug } })
    },
  }
}
