import { useRouter } from "expo-router"
import { useState } from "react"
import { useReducedMotion } from "react-native-reanimated"

import { STAY_TYPE_META } from "@/constants/stays"
import { useSession } from "@/hooks/use-session"

import { SEARCH_EXAMPLE, type Category } from "./constants"
import { useFeaturedStays } from "./use-featured-stays"
import { greetingName } from "./utils"

/** Orchestrator for home: the guest, the search sentence, and the category's featured stays. */
export const useHome = () => {
  const router = useRouter()
  const { user } = useSession()
  const reducedMotion = useReducedMotion()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<Category>("all")

  const featured = useFeaturedStays(category)

  const name = greetingName(user)

  const submitSearch = () => {
    // An empty submit searches the example the bar is showing
    const q = query.trim() || SEARCH_EXAMPLE
    router.navigate({ pathname: "/search", params: { q } })
    setQuery("")
  }

  return {
    name,
    initial: name.charAt(0).toUpperCase(),
    avatarUrl: user?.imageUrl,
    query,
    setQuery,
    submitSearch,
    openSearch: () => router.navigate({ pathname: "/search", params: { q: "" } }),
    category,
    setCategory,
    featured: featured.stays,
    featuredStatus: featured.status,
    retryFeatured: featured.retry,
    emptyMessage: category === "all" ? "No stays yet." : `Nothing in ${STAY_TYPE_META[category].label} yet.`,
    reducedMotion,
  }
}
