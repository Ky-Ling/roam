import { formatTime, toParagraphs } from "@/lib/policy-text"
import type { StayDetails, StayPolicy } from "@/lib/sanity"
import { compact, delay, isEmpty, isNil } from "@/lib/utils"

import { matchTopics } from "./match"
import { TOPICS } from "./topics"
import type { AnswerCard, AnswerEntry, Reply, TopicKey } from "./types"

// Answers resolve locally for now. The pause keeps the screen's pending state real until the API route lands.
const REPLY_DELAY_MS = 600

const HOUSE_RULES = "This stay's house rules"

const policyEntry = (policy: Pick<StayPolicy, "title" | "body">, source: string): AnswerEntry => ({
  heading: policy.title,
  paragraphs: toParagraphs(policy.body),
  source,
})

/** The stay's own policies in a category, then the Roam-wide ones. */
const policiesFor = (stay: StayDetails, category: string): AnswerEntry[] => [
  ...(stay.policies ?? []).filter((p) => p.category === category).map((p) => policyEntry(p, "Set for this stay")),
  ...stay.roamPolicies.filter((p) => p.category === category).map((p) => policyEntry(p, "Applies to every Roam stay")),
]

const timesEntry = (stay: StayDetails): AnswerEntry[] =>
  isNil(stay.houseRules)
    ? []
    : [
        {
          paragraphs: [
            `Check-in from ${formatTime(stay.houseRules.checkInFrom)}`,
            `Check-out by ${formatTime(stay.houseRules.checkOutBy)}`,
          ],
          source: HOUSE_RULES,
        },
      ]

const rulesEntry = (stay: StayDetails): AnswerEntry[] => {
  const rules = compact([
    isNil(stay.houseRules?.quietHours) ? null : `Quiet hours ${stay.houseRules.quietHours}`,
    ...(stay.houseRules?.rules ?? []),
  ])

  return isEmpty(rules) ? [] : [{ paragraphs: rules, bullets: true, source: HOUSE_RULES }]
}

const cancellationEntry = (stay: StayDetails): AnswerEntry[] =>
  isNil(stay.cancellationPolicy) ? [] : [policyEntry(stay.cancellationPolicy, "This stay's cancellation policy")]

/** Every entry for a topic, each word for word from the stay or Roam's policies. */
const entriesFor = (stay: StayDetails, topic: TopicKey): AnswerEntry[] => {
  switch (topic) {
    case "checkIn":
      return [...timesEntry(stay), ...policiesFor(stay, "checkIn")]
    case "cancellation":
      return [...cancellationEntry(stay), ...policiesFor(stay, "cancellation")]
    case "pets":
      return [
        { paragraphs: [`Pets allowed: ${stay.petsAllowed ? "Yes" : "No"}`], source: "This stay's details" },
        ...policiesFor(stay, "pets"),
      ]
    case "houseRules":
      return rulesEntry(stay)
    default:
      return policiesFor(stay, topic)
  }
}

/** One card per matched topic that has text for this stay, in `TOPICS` order. */
export const buildReply = (stay: StayDetails, question: string): Reply => {
  const topics = matchTopics(question)
  const cards: AnswerCard[] = TOPICS.filter((topic) => topics.includes(topic.key))
    .map((topic) => ({ topic: topic.key, label: topic.label, entries: entriesFor(stay, topic.key) }))
    .filter((card) => !isEmpty(card.entries))

  return { topics, cards }
}

/**
 * Answers a question about a stay. Local for now: the backend (Jev + Context through an API route)
 * replaces this function, and the screen keeps calling it.
 */
export const answerQuestion = async (stay: StayDetails, question: string): Promise<Reply> => {
  await delay(REPLY_DELAY_MS)

  return buildReply(stay, question)
}
