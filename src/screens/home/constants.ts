import type { IconName } from "@/components/ui/icon"
import { STAY_TYPE_META } from "@/constants/stays"
import type { StayType } from "@/lib/sanity"

export type Category = "all" | StayType

export const CATEGORIES: { key: Category, label: string, icon: IconName }[] = [
  { key: "all", label: "All Stays", icon: "home" },
  { key: "cabin", ...STAY_TYPE_META.cabin },
  { key: "beach", ...STAY_TYPE_META.beach },
  { key: "city", ...STAY_TYPE_META.city },
  { key: "villa", ...STAY_TYPE_META.villa },
]

/** Shown in the empty search bar, and searched as-is when the guest submits without typing. */
export const SEARCH_EXAMPLE = "quiet pet friendly cabin with hot tub"
