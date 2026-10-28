export type TopicKey =
  | "checkIn"
  | "cancellation"
  | "pets"
  | "houseRules"
  | "payment"
  | "safety"
  | "damage"
  | "community"

export type Topic = {
  key: TopicKey
  /** Card heading, and the chip's label for topics that have one. */
  label: string
  /** What the topic's chip sends. Topics without one are matched from typed questions only. */
  chipQuestion?: string
  /** Lowercase words and phrases, matched whole (a trailing "s" also matches). */
  keywords: string[]
}

/** One piece of text, word for word from the stay's data or Roam's policies, with where it comes from. */
export type AnswerEntry = {
  heading?: string
  paragraphs: string[]
  /** Renders the paragraphs as a bulleted list (house rules). */
  bullets?: boolean
  source: string
}

export type AnswerCard = {
  topic: TopicKey
  label: string
  entries: AnswerEntry[]
}

export type Reply = {
  /** Every topic the question matched, including ones this stay has no text for. */
  topics: TopicKey[]
  /** One card per matched topic that has text. Empty means nothing answers the question. */
  cards: AnswerCard[]
}
