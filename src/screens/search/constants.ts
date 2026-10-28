import type { SearchSort } from "@/lib/sanity"

export const SORT_OPTIONS: { key: SearchSort, label: string }[] = [
  { key: "best", label: "Best match" },
  { key: "price", label: "Price: low to high" },
  { key: "rating", label: "Top rated" },
]
