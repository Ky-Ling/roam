import { useEffect, useState } from "react"

import { FEATURED_STAYS_QUERY, sanityFetch, type FeaturedStay } from "@/lib/sanity"

import type { Category } from "./constants"

export type FeaturedStatus = "loading" | "error" | "ready"

/**
 * Live featured stays for a category. Each category is fetched once and kept, so switching back
 * is instant; a category change aborts the request it replaces.
 */
export const useFeaturedStays = (category: Category) => {
  const [byCategory, setByCategory] = useState<Partial<Record<Category, FeaturedStay[]>>>({})
  const [attempt, setAttempt] = useState(0)
  // The request that failed, so an old failure never shows on a newer request
  const [failedKey, setFailedKey] = useState<string | null>(null)

  const stays = byCategory[category]
  const requestKey = `${category}:${attempt}`

  useEffect(() => {
    if (stays) return
    const controller = new AbortController()
    sanityFetch<FeaturedStay[]>(FEATURED_STAYS_QUERY, { type: category }, controller.signal)
      .then((result) => setByCategory((prev) => ({ ...prev, [category]: result })))
      .catch(() => {
        if (!controller.signal.aborted) setFailedKey(`${category}:${attempt}`)
      })

    return () => controller.abort()
  }, [category, attempt, stays])

  const status: FeaturedStatus = stays ? "ready" : failedKey === requestKey ? "error" : "loading"

  return {
    stays: stays ?? [],
    status,
    retry: () => setAttempt((n) => n + 1),
  }
}
