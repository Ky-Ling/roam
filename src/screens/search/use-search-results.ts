import { useEffect, useRef, useState } from "react"

import { posthog } from "@/lib/posthog"
import { sanityFetch, searchStaysQuery, type SearchSort, type SearchStay } from "@/lib/sanity"
import { isEmpty, isNil } from "@/lib/utils"
import type { SearchParams } from "@/lib/search"

export type ResultsStatus = "loading" | "error" | "ready"

/** Everything one request depends on. Serialized as the effect's key, so it only refetches on a real change. */
type Request = {
  q: string
  params: SearchParams
  sort: SearchSort
  /** For the analytics event only: which constraint kinds were on, and where the sentence came from. */
  kinds: string[]
  source: string
  /** False when the sentence had words but nothing the parser recognized, so every stay came back. */
  understood: boolean
  attempt: number
}

type Loaded = { key: string, q: string, stays: SearchStay[] }

/**
 * Live search results from Sanity. `request` is null until the parser can run (place names loading).
 * A chip or sort change keeps the previous list on screen until the new one lands, so rows reflow
 * instead of flashing; only a new sentence shows the loading state.
 */
export const useSearchResults = (request: Omit<Request, "attempt"> | null) => {
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState<Loaded | null>(null)
  // The request that failed, so an old failure never shows on a newer request
  const [failedKey, setFailedKey] = useState<string | null>(null)
  // The sentence `search_completed` was last sent for: once per sentence, not per chip or sort change
  const reportedQ = useRef<string | null>(null)

  const key = isNil(request) ? null : JSON.stringify({ ...request, attempt })

  useEffect(() => {
    if (isNil(key)) return

    const { q, params, sort, kinds, source, understood } = JSON.parse(key) as Request
    const controller = new AbortController()

    sanityFetch<SearchStay[]>(searchStaysQuery(sort), params, controller.signal)
      .then((stays) => {
        setLoaded({ key, q, stays })
        
        // An empty sentence is browsing (the Search tab opened bare), not a search
        if (reportedQ.current === q || isEmpty(q.trim())) return
        reportedQ.current = q
        posthog?.capture("search_completed", {
          result_count: stays.length,
          has_results: !isEmpty(stays),
          constraint_kinds: kinds,
          source,
          understood,
        })
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailedKey(key)
      })

    return () => controller.abort()
  }, [key])

  const current = loaded?.key === key
  // Same sentence, different chips or sort: the old list stays up while the new one loads
  const sameSentence = !isNil(loaded) && !isNil(request) && loaded.q === request.q
  const status: ResultsStatus = current ? "ready" : !isNil(key) && failedKey === key ? "error" : sameSentence ? "ready" : "loading"

  return {
    stays: status === "ready" ? (loaded?.stays ?? []) : [],
    status,
    retry: () => setAttempt((n) => n + 1),
  }
}
