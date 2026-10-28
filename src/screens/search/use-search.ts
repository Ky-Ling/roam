import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { ActionSheetIOS, Alert, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import type { SearchSort } from "@/lib/sanity"
import { constraintKey, constraintKinds, constraintLabel, parseQuery, toQueryParams } from "@/lib/search"
import { posthog } from "@/lib/posthog"
import { isEmpty, isNil } from "@/lib/utils"

import { SORT_OPTIONS } from "./constants"
import { usePlaces } from "./use-places"
import { useSearchResults } from "./use-search-results"
import { countLabel, toResult } from "./utils"

/**
 * Orchestrator for search. The submitted sentence lives in the `q` param (and where it came from in `src`);
 * the field holds a draft. Code parses the sentence once Sanity's place names are in, then the hard
 * constraints go to GROQ as params.
 */
export const useSearch = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { q = "", src = "link" } = useLocalSearchParams<{ q?: string, src?: string }>()
  const [draft, setDraft] = useState(q)
  const [lastQ, setLastQ] = useState(q)
  const [off, setOff] = useState<string[]>([])
  const [sort, setSort] = useState<SearchSort>("best")
  const [saved, setSaved] = useState<string[]>([])

  // A new sentence (from home, or submitted here) resets the field and turns every chip back on
  if (q !== lastQ) {
    setLastQ(q)
    setDraft(q)
    setOff([])
  }

  const placesState = usePlaces()
  const constraints = isNil(placesState.places) ? [] : parseQuery(q, placesState.places)
  const chips = constraints.map((c) => {
    const key = constraintKey(c)

    return { key, label: constraintLabel(c), selected: !off.includes(key) }
  })
  const active = constraints.filter((c) => !off.includes(constraintKey(c)))
  const params = toQueryParams(active)
  // Words but no recognized filter: every stay comes back, so the screen says so
  const understood = isEmpty(q.trim()) || !isEmpty(constraints)

  const results = useSearchResults(
    isNil(placesState.places) ? null : { q, params, sort, kinds: constraintKinds(active), source: src, understood },
  )
  const status = placesState.failed ? "error" : results.status

  const toggleChip = (key: string) => {
    const enabled = off.includes(key)
    posthog?.capture("search_constraint_toggled", { enabled })
    setOff((keys) => (keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]))
  }

  const toggleSave = (id: string) => {
    const isSaved = saved.includes(id)
    if (isSaved) {
      posthog?.capture("stay_unsaved", { stay_id: id })
    } else {
      posthog?.capture("stay_saved", { stay_id: id })
    }
    setSaved((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]))
  }

  const selectSort = (nextSort: SearchSort) => {
    posthog?.capture("search_sort_selected", { sort: nextSort })
    setSort(nextSort)
  }

  const clearFilters = () => {
    posthog?.capture("search_filters_cleared", { active_filter_count: active.length })
    setOff(constraints.map(constraintKey))
  }

  const submit = () => {
    posthog?.capture("search_submitted", { source: "search" })
    router.setParams({ q: draft.trim(), src: "search" })
  }

  const retry = () => {
    if (placesState.failed) placesState.retry()
    else results.retry()
  }

  const openSort = () => {
    const labels = SORT_OPTIONS.map((o) => o.label)
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { title: "Sort by", options: [...labels, "Cancel"], cancelButtonIndex: labels.length },
        (i) => {
          if (i < labels.length) selectSort(SORT_OPTIONS[i].key)
        },
      )

      return
    }
    // react-native-web's Alert is a no-op, so web steps through the options instead
    if (Platform.OS === "web") {
      const next = (SORT_OPTIONS.findIndex((o) => o.key === sort) + 1) % SORT_OPTIONS.length
      selectSort(SORT_OPTIONS[next].key)

      return
    }
    Alert.alert("Sort by", undefined, [
      ...SORT_OPTIONS.map((o) => ({ text: o.label, onPress: () => selectSort(o.key) })),
      { text: "Cancel", style: "cancel" as const },
    ])
  }

  return {
    // Web's native tabs float a bar over the top of the screen instead of sitting at the bottom
    topInset: Platform.OS === "web" ? 96 : insets.top + 8,
    draft,
    setDraft,
    submit,
    goHome: () => router.navigate("/home"),
    chips,
    showChips: !isEmpty(chips),
    toggleChip,
    status,
    retry,
    showUnmatchedNote: !isNil(placesState.places) && !understood && status === "ready",
    hasActiveFilters: !isEmpty(active),
    clearFilters,
    results: results.stays.map((stay) => ({ ...toResult(stay, params.amenities), saved: saved.includes(stay.id) })),
    countLabel: status === "ready" ? countLabel(results.stays.length) : "… stays",
    sortLabel: SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "",
    openSort,
    toggleSave,
    // Keys the results' fade-in: a new sentence fades the list in, chip toggles reflow it instead
    listKey: q,
  }
}
