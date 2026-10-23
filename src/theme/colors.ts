// Mirrors the --color-* tokens in global.css, for props that can't take a className
// (icon color, Switch track, placeholderTextColor, ActivityIndicator). Keep both in sync.
export const colors = {
  primary: "#FFC629",
  primarySubtle: "#FEF5DD",
  lavender: "#C9B4FF",
  lavenderStrong: "#A48AFE",
  lavenderSubtle: "#EEEDFE",
  lavenderMuted: "#E4E1FF",
  indigo: "#4B2EE8",
  ink: "#0B0B1A",
  inkSecondary: "#6B7280",
  inkTertiary: "#9CA3AF",
  surface: "#FFFFFF",
  surfaceMuted: "#F4F4F7",
  border: "#E5E7EB",
  glass: "rgba(255, 255, 255, 0.7)",
  scrim: "rgba(11, 11, 26, 0.45)",
  rating: "#FCB500",
  success: "#15834B",
  successSubtle: "#E4F4EC",
  successInk: "#1B6B44",
  danger: "#E03A46",
  dangerSubtle: "#FEE4EC",
  infoSubtle: "#E9EFFE",
  infoInk: "#2747C8",
  white: "#FFFFFF",
} as const;

export type ColorToken = keyof typeof colors;
