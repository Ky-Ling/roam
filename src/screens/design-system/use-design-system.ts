import { useState } from "react"

import type { BannerTone, TabKey, ViewMode } from "./constants"

/** Orchestrator for the design-system gallery: owns every sample's interactive state. */
export const useDesignSystem = () => {
  const [filter, setFilter] = useState("Cabins")
  const [category, setCategory] = useState("All Stays")
  const [saved, setSaved] = useState(false)
  const [view, setView] = useState<ViewMode>("list")
  const [tab, setTab] = useState<TabKey>("home")
  const [instantBook, setInstantBook] = useState(true)
  const [guests, setGuests] = useState(1)
  const [name, setName] = useState("Joanna Smith")
  const [banners, setBanners] = useState<Record<BannerTone, boolean>>({ success: true, error: true })

  const toggleSaved = () => setSaved((s) => !s)
  const dismissBanner = (tone: BannerTone) => setBanners((b) => ({ ...b, [tone]: false }))
  const showBanners = () => setBanners({ success: true, error: true })

  return {
    filter,
    setFilter,
    category,
    setCategory,
    saved,
    toggleSaved,
    view,
    setView,
    tab,
    setTab,
    instantBook,
    setInstantBook,
    guests,
    setGuests,
    name,
    setName,
    banners,
    dismissBanner,
    showBanners,
  }
}
