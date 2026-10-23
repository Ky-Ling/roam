import { ListGroup } from "@/components/ui/list-group";
import { ListRow } from "@/components/ui/list-row";

import { SectionCard } from "./section-card";

export const ProfileRowSection = () => (
  <SectionCard title="09. Profile row">
    <ListGroup>
      <ListRow icon="user" label="Personal info" />
      <ListRow icon="card" label="Payment methods" />
      <ListRow icon="trips" label="Trips" />
    </ListGroup>
  </SectionCard>
);
