import { Icon } from "@/components/ui/icon";
import { TextField } from "@/components/ui/text-field";

import { SectionCard } from "./section-card";

type InputFieldsSectionProps = {
  name: string;
  onChangeName: (name: string) => void;
};

export const InputFieldsSection = ({ name, onChangeName }: InputFieldsSectionProps) => (
  <SectionCard title="05. Input fields">
    <TextField
      icon="search"
      defaultValue="Cabins in California"
      accessibilityLabel="Search"
      trailing={<Icon name="filters" />}
    />
    <TextField icon="user" placeholder="Enter your name" accessibilityLabel="Name" />
    <TextField icon="user" value={name} onChangeText={onChangeName} accessibilityLabel="Full name" />
    <TextField icon="lock" secureTextEntry defaultValue="password12" accessibilityLabel="Password" />
  </SectionCard>
);
