import { escapeRegExp } from "@/lib/utils"

import { TOPICS } from "./topics"
import type { TopicKey } from "./types"

// "Check-in?" → " check in ": punctuation and hyphens become spaces so phrases match across them
const normalize = (text: string) => ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `

const hasKeyword = (text: string, keyword: string) => new RegExp(` ${escapeRegExp(keyword)}s? `).test(text)

/**
 * The topics a question is about, in `TOPICS` order. A keyword stand-in for Jev's topic choice:
 * swap this for the API route's answer, not the screen.
 */
export const matchTopics = (question: string): TopicKey[] => {
  const text = normalize(question)

  return TOPICS.filter((topic) => topic.keywords.some((keyword) => hasKeyword(text, keyword))).map(
    (topic) => topic.key,
  )
}
