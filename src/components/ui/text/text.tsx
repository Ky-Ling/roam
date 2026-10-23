import { Text as RNText, type TextProps as RNTextProps } from "react-native";

import { cx } from "@/lib/utils";

const variants = {
  display: "type-display",
  hero: "type-hero",
  headline: "type-headline",
  heading: "type-heading",
  title: "type-title",
  body: "type-body",
  "body-medium": "type-body-medium",
  lead: "type-lead",
  caption: "type-caption",
  button: "type-button",
  label: "type-label",
} as const;

const tones = {
  ink: "text-ink",
  secondary: "text-ink-secondary",
  tertiary: "text-ink-tertiary",
  white: "text-white",
  indigo: "text-indigo",
  success: "text-success-ink",
  danger: "text-danger",
  info: "text-info-ink",
} as const;

export type TextVariant = keyof typeof variants;
export type TextTone = keyof typeof tones;

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
};

export const Text = ({ variant = "body", tone = "ink", className, ...props }: TextProps) => (
  <RNText className={cx(variants[variant], tones[tone], className)} {...props} />
);
