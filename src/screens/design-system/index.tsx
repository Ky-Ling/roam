import { ScrollView } from "react-native"

import {
  AlertsSection,
  BadgesSection,
  BrandSection,
  ButtonsSection,
  FilterChipsSection,
  IconographySection,
  InputFieldsSection,
  ListingCardSection,
  PaletteSection,
  PolicyCardSection,
  ProfileRowSection,
  SegmentedControlSection,
  TabBarSection,
  TogglesSection,
  TypographySection,
} from "./components"
import { useDesignSystem } from "./use-design-system"

/** Gallery of the design sheet's 15 sections, for comparing against the design. */
export const DesignSystemScreen = () => {
  const vm = useDesignSystem()

  return (
    <ScrollView className="flex-1 bg-surface-muted" contentContainerClassName="gap-4 p-5 pb-12">
      <BrandSection />
      <PaletteSection />
      <TypographySection />
      <ButtonsSection />
      <InputFieldsSection name={vm.name} onChangeName={vm.setName} />
      <FilterChipsSection
        filter={vm.filter}
        onSelectFilter={vm.setFilter}
        category={vm.category}
        onSelectCategory={vm.setCategory}
      />
      <ListingCardSection saved={vm.saved} onToggleSave={vm.toggleSaved} />
      <PolicyCardSection />
      <ProfileRowSection />
      <TabBarSection tab={vm.tab} onSelectTab={vm.setTab} />
      <IconographySection />
      <SegmentedControlSection view={vm.view} onChangeView={vm.setView} />
      <TogglesSection
        instantBook={vm.instantBook}
        onChangeInstantBook={vm.setInstantBook}
        guests={vm.guests}
        onChangeGuests={vm.setGuests}
      />
      <AlertsSection banners={vm.banners} onDismiss={vm.dismissBanner} onShowAll={vm.showBanners} />
      <BadgesSection />
    </ScrollView>
  )
}
