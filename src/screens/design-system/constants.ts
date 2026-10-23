import type { TabItem } from "@/components/ui/glass-tab-bar";

export const TABS = [
  { key: "home", label: "Home", icon: "home" },
  { key: "search", label: "Search", icon: "search" },
  { key: "trips", label: "Trips", icon: "calendar" },
  { key: "profile", label: "Profile", icon: "user" },
] as const satisfies readonly TabItem<string>[];

export type TabKey = (typeof TABS)[number]["key"];

export type ViewMode = "list" | "map";

export type BannerTone = "success" | "error";
