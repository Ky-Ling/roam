import { PolicyCard } from "@/components/ui/policy-card";

import { SectionCard } from "./section-card";

export const PolicyCardSection = () => (
  <SectionCard title="08. Policy card">
    <PolicyCard
      icon="policyChat"
      title="Ask about policies"
      description="Cancellation, house rules, pets, check-in and more."
    />
    <PolicyCard icon="document" title="Free cancellation" description="Full refund up to 7 days before check-in." />
  </SectionCard>
);
