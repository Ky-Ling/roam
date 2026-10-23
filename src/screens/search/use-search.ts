import { useLocalSearchParams, useRouter } from "expo-router"
import { useState } from "react"
import { ActionSheetIOS, Alert, Platform } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { STAYS } from "@/data/stays"
import { constraintKey, constraintLabel, parseQuery, searchStays, type SortKey } from "@/lib/search"
import { isEmpty } from "@/lib/utils"

import { SORT_OPTIONS } from "./constants"
import { toListing } from "./utils"

/**
 * Orchestrator for search. The submitted sentence lives in the `q` param; the field holds a draft.
 * Data is local and synchronous, so there's no loading or error state yet (Sanity brings both).
 */
export const useSearch = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { q = "" } = useLocalSearchParams<{ q?: string }>()
  const [draft, setDraft] = useState(q)
  const [lastQ, setLastQ] = useState(q)
  const [off, setOff] = useState<string[]>([])
  const [sort, setSort] = useState<SortKey>("best")
  const [saved, setSaved] = useState<string[]>([])

  // A new sentence (from home, or submitted here) resets the field and turns every chip back on
  if (q !== lastQ) {
    setLastQ(q)
    setDraft(q)
    setOff([])
  }

  const constraints = parseQuery(q, STAYS)
  const chips = constraints.map((c) => {
    const key = constraintKey(c)

    return { key, label: constraintLabel(c), selected: !off.includes(key) }
  })
  const active = constraints.filter((c) => !off.includes(constraintKey(c)))
  const results = searchStays(STAYS, active, sort).map(toListing)

  const toggleChip = (key: string) =>
    setOff((keys) => (keys.includes(key) ? keys.filter((k) => k !== key) : [...keys, key]))

  const toggleSave = (id: string) => setSaved((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]))

  const openSort = () => {
    const labels = SORT_OPTIONS.map((o) => o.label)
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        { title: "Sort by", options: [...labels, "Cancel"], cancelButtonIndex: labels.length },
        (i) => {
          if (i < labels.length) setSort(SORT_OPTIONS[i].key)
        },
      )

      return
    }
    // react-native-web's Alert is a no-op, so web steps through the options instead
    if (Platform.OS === "web") {
      const next = (SORT_OPTIONS.findIndex((o) => o.key === sort) + 1) % SORT_OPTIONS.length
      setSort(SORT_OPTIONS[next].key)

      return
    }
    Alert.alert("Sort by", undefined, [
      ...SORT_OPTIONS.map((o) => ({ text: o.label, onPress: () => setSort(o.key) })),
      { text: "Cancel", style: "cancel" as const },
    ])
  }

  return {
    // Web's native tabs float a bar over the top of the screen instead of sitting at the bottom
    topInset: Platform.OS === "web" ? 96 : insets.top + 8,
    draft,
    setDraft,
    submit: () => router.setParams({ q: draft.trim() }),
    goHome: () => router.navigate("/home"),
    chips,
    showChips: !isEmpty(chips),
    toggleChip,
    hasActiveFilters: !isEmpty(active),
    clearFilters: () => setOff(constraints.map(constraintKey)),
    results: results.map((r) => ({ ...r, saved: saved.includes(r.id) })),
    countLabel: `${results.length} ${results.length === 1 ? "stay" : "stays"}`,
    sortLabel: SORT_OPTIONS.find((o) => o.key === sort)?.label ?? "",
    openSort,
    toggleSave,
    // Keys the results' fade-in: a new sentence fades the list in, chip toggles reflow it instead
    listKey: q,
  }
}
