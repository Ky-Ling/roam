import { SegmentedControl } from "@/components/ui/segmented-control"

import type { ViewMode } from "../constants"
import { SectionCard } from "./section-card"

type SegmentedControlSectionProps = {
  view: ViewMode
  onChangeView: (view: ViewMode) => void
}

export const SegmentedControlSection = ({ view, onChangeView }: SegmentedControlSectionProps) => (
  <SectionCard title="12. Segmented control">
    <SegmentedControl
      options={[
        { value: "list", label: "List", icon: "list" },
        { value: "map", label: "Map", icon: "map" },
      ]}
      value={view}
      onChange={onChangeView}
    />
  </SectionCard>
)
