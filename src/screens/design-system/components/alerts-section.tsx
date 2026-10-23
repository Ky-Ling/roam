import { Button } from "@/components/ui/button"
import { StatusBanner } from "@/components/ui/status-banner"

import type { BannerTone } from "../constants"
import { SectionCard } from "./section-card"

type AlertsSectionProps = {
  banners: Record<BannerTone, boolean>
  onDismiss: (tone: BannerTone) => void
  onShowAll: () => void
}

export const AlertsSection = ({ banners, onDismiss, onShowAll }: AlertsSectionProps) => (
  <SectionCard title="14. Status / Alerts">
    {banners.success && (
      <StatusBanner tone="success" message="Account created successfully" onDismiss={() => onDismiss("success")} />
    )}
    {banners.error && (
      <StatusBanner
        tone="error"
        message="Something went wrong. Please try again."
        onDismiss={() => onDismiss("error")}
      />
    )}
    {!banners.success && !banners.error && (
      <Button title="Show banners" variant="secondary" size="sm" onPress={onShowAll} />
    )}
  </SectionCard>
)
