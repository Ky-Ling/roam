import { Platform, Switch, type SwitchProps } from "react-native";

import { colors } from "@/theme";

/** The platform switch in Roam's colors. Structure and behavior stay native. */
export const Toggle = (props: Omit<SwitchProps, "trackColor" | "thumbColor" | "ios_backgroundColor">) => (
  <Switch
    trackColor={{ false: colors.border, true: colors.primary }}
    thumbColor={colors.white}
    ios_backgroundColor={colors.border}
    // react-native-web ignores thumbColor when on and needs its own prop
    {...(Platform.OS === "web" ? ({ activeThumbColor: colors.white } as object) : null)}
    {...props}
  />
);
