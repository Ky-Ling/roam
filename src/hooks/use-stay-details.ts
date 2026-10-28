import { useEffect, useState } from "react"

import { fetchStay, type StayDetails } from "@/lib/sanity"
import { isNil, isNull } from "@/lib/utils"

export type StayStatus = "loading" | "error" | "missing" | "ready"

type Loaded = { slug: string, stay: StayDetails | null }

/**
 * A published stay by slug, shared by the details screen and its policies sheet through `fetchStay`'s
 * session cache. `missing` means no published stay has the slug.
 */
export const useStayDetails = (slug: string) => {
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  const [attempt, setAttempt] = useState(0)
  // The request that failed, so an old failure never shows on a newer request
  const [failedKey, setFailedKey] = useState<string | null>(null)

  const requestKey = `${slug}:${attempt}`

  useEffect(() => {
    // The fetch is shared through the cache, so a replaced request is ignored rather than aborted
    let active = true
    fetchStay(slug)
      .then((stay) => {
        if (active) setLoaded({ slug, stay })
      })
      .catch(() => {
        if (active) setFailedKey(`${slug}:${attempt}`)
      })

    return () => {
      active = false
    }
  }, [slug, attempt])

  const current = loaded?.slug === slug ? loaded : null
  const status: StayStatus = !isNil(current)
    ? isNull(current.stay)
      ? "missing"
      : "ready"
    : failedKey === requestKey
      ? "error"
      : "loading"

  return {
    stay: current?.stay ?? null,
    status,
    retry: () => setAttempt((n) => n + 1),
  }
}
