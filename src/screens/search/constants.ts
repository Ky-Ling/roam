import type { SortKey } from "@/lib/search"

export const SORT_OPTIONS: { key: SortKey, label: string }[] = [
  { key: "best", label: "Best match" },
  { key: "price", label: "Price: low to high" },
  { key: "rating", label: "Top rated" },
]
