import { useAuth } from "@clerk/expo"
import { useEffect, useRef } from "react"

import { posthog } from "@/lib/posthog"
import { isNil } from "@/lib/utils"

/** Identifies the signed-in guest to PostHog by Clerk user id only (no email or name), once per session. */
export const usePostHogIdentity = () => {
  const { isSignedIn, userId } = useAuth()
  const identified = useRef<string | null>(null)

  useEffect(() => {
    if (!isSignedIn || isNil(userId)) {
      identified.current = null

      return
    }
    if (isNil(posthog) || identified.current === userId) return
    posthog.identify(userId)
    identified.current = userId
  }, [isSignedIn, userId])
}
