import { formatTime, toParagraphs } from "@/lib/policy-text"
import type { StayDetails, StayPolicy } from "@/lib/sanity"
import { compact, isEmpty, isNil } from "@/lib/utils"

export type PolicySection = "all" | "cancellation"

export type PolicyBlock = {
  heading?: string
  paragraphs: string[]
  /** Renders the paragraphs as a bulleted list (house rules). */
  bullets?: boolean
}

export type PolicySectionView = {
  key: string
  title: string
  /** Where the text comes from. Answers always show their source. */
  source: string
  blocks: PolicyBlock[]
}

const toBlock = (policy: Pick<StayPolicy, "title" | "body">): PolicyBlock => ({
  heading: policy.title,
  paragraphs: toParagraphs(policy.body),
})

const cancellationSection = (stay: StayDetails): PolicySectionView[] =>
  isNil(stay.cancellationPolicy)
    ? []
    : [
        {
          key: "cancellation",
          title: "Cancellation",
          source: "This stay's cancellation policy",
          blocks: [toBlock(stay.cancellationPolicy)],
        },
      ]

/**
 * The full sheet's sections, every text word for word from Sanity: check-in times, house rules,
 * cancellation, the stay's own policies and the Roam-wide ones. Empty sections are left out.
 */
export const toSections = (stay: StayDetails): PolicySectionView[] => {
  const rules = stay.houseRules
  const times = isNil(rules)
    ? []
    : compact([
        `Check-in from ${formatTime(rules.checkInFrom)}`,
        `Check-out by ${formatTime(rules.checkOutBy)}`,
        isNil(rules.quietHours) ? null : `Quiet hours ${rules.quietHours}`,
      ])
  const houseRules = rules?.rules ?? []
  const stayPolicies = stay.policies ?? []

  return [
    ...(isEmpty(times)
      ? []
      : [{ key: "times", title: "Check-in and check-out", source: "This stay's house rules", blocks: [{ paragraphs: times }] }]),
    ...(isEmpty(houseRules)
      ? []
      : [{ key: "rules", title: "House rules", source: "This stay's house rules", blocks: [{ paragraphs: houseRules, bullets: true }] }]),
    ...cancellationSection(stay),
    ...(isEmpty(stayPolicies)
      ? []
      : [{ key: "stay", title: "This stay's policies", source: "Set for this stay", blocks: stayPolicies.map(toBlock) }]),
    ...(isEmpty(stay.roamPolicies)
      ? []
      : [{ key: "roam", title: "Roam policies", source: "Applies to every Roam stay", blocks: stay.roamPolicies.map(toBlock) }]),
  ]
}

export type CancellationView = {
  title: string
  summary: string
  /** One timeline step per body paragraph: the refund tiers, as written. */
  steps: string[]
  /** Roam-wide cancellation policies (Extenuating circumstances), shown after the stay's own. */
  roam: { title: string, paragraphs: string[] }[]
}

/** The cancellation sheet: the stay's policy as summary and refund steps, then Roam's. Null without a policy. */
export const toCancellationView = (stay: StayDetails): CancellationView | null =>
  isNil(stay.cancellationPolicy)
    ? null
    : {
        title: stay.cancellationPolicy.title,
        summary: stay.cancellationPolicy.summary,
        steps: toParagraphs(stay.cancellationPolicy.body),
        roam: stay.roamPolicies
          .filter((p) => p.category === "cancellation")
          .map((p) => ({ title: p.title, paragraphs: toParagraphs(p.body) })),
      }
