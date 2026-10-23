import { Text } from "react-native";

import { cx } from "@/lib/utils";

// PLACEHOLDER: the sheet's "roam" logo is a heavier custom face. Swap for the logo asset once provided.
// Tracking is about -4% of the size so the letters sit tight like the sheet's mark.
// lg spans about 70% of a phone-width card, as the mark does on the sheet.
const sizes = {
  sm: "text-[32px] leading-[36px] tracking-[-1.25px]",
  md: "text-[56px] leading-[60px] tracking-[-2.25px]",
  lg: "text-[96px] leading-[100px] tracking-[-4px]",
} as const;

export const Wordmark = ({ size = "md", className }: { size?: keyof typeof sizes; className?: string }) => (
  <Text
    accessibilityRole="header"
    accessibilityLabel="roam"
    className={cx("font-jakarta-bold text-ink", sizes[size], className)}
  >
    roam
  </Text>
);
