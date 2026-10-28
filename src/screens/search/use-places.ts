import { useEffect, useState } from "react"

import { fetchPlaces } from "@/lib/sanity"

/** Place names the parser can recognize. Null until loaded; `failed` when the request didn't land. */
export const usePlaces = () => {
  const [places, setPlaces] = useState<string[] | null>(null)
  const [failedAttempt, setFailedAttempt] = useState<number | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (places) return
    let active = true
    fetchPlaces()
      .then((result) => {
        if (active) setPlaces(result)
      })
      .catch(() => {
        if (active) setFailedAttempt(attempt)
      })

    return () => {
      active = false
    }
  }, [places, attempt])

  return {
    places,
    failed: failedAttempt === attempt,
    retry: () => setAttempt((n) => n + 1),
  }
}
