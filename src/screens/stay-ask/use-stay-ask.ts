import { useLocalSearchParams, useRouter } from "expo-router"
import { useRef, useState } from "react"
import type { LayoutChangeEvent, ScrollView } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useStayDetails } from "@/hooks/use-stay-details"
import { answerQuestion, TOPICS } from "@/lib/ask"
import { posthog } from "@/lib/posthog"
import { compact, isEmpty, isNil, isUndefined } from "@/lib/utils"

import type { ThreadMessage } from "./types"

type QuestionInput = "chip" | "typed"

// The topics with a chip, and the question each one sends
const CHIPS = compact(
  TOPICS.map((topic) =>
    isUndefined(topic.chipQuestion) ? null : { key: topic.key, label: topic.label, question: topic.chipQuestion },
  ),
)

/**
 * Orchestrator for the Ask about this stay chat. Answers come from `answerQuestion` (local for now),
 * built from the stay the details screen already loaded. The thread lives only for this visit.
 */
export const useStayAsk = () => {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { slug = "" } = useLocalSearchParams<{ slug: string }>()
  const { stay, status, retry } = useStayDetails(slug)
  const [messages, setMessages] = useState<ThreadMessage[]>([])
  const [draft, setDraft] = useState("")
  const [pending, setPending] = useState(false)
  const scrollRef = useRef<ScrollView>(null)
  // Where the latest question sits in the thread, so its reply opens from the top, question in view
  const questionY = useRef(0)

  const ask = async (text: string, input: QuestionInput) => {
    const question = text.trim()
    if (isEmpty(question) || pending || isNil(stay)) return
    // Sending is blocked while a reply is pending, so a timestamp is unique within the thread
    const id = String(Date.now())
    setMessages((m) => [...m, { id: `q${id}`, kind: "question", text: question }])
    if (input === "typed") setDraft("")
    setPending(true)
    try {
      const reply = await answerQuestion(stay, question)
      setMessages((m) => [...m, { id: `r${id}`, kind: "reply", reply }])
      // Never the question itself: guests' typed text stays out of analytics
      posthog?.capture("stay_question_asked", {
        stay_id: slug,
        input,
        topics: reply.topics,
        answered: !isEmpty(reply.cards),
      })
    } finally {
      setPending(false)
    }
  }

  const close = () => {
    if (router.canGoBack()) router.back()
    else router.replace({ pathname: "/stay/[slug]", params: { slug } })
  }

  const openAllPolicies = () => {
    posthog?.capture("stay_policies_opened", { stay_id: slug, section: "all" })
    router.push({ pathname: "/stay/[slug]/policies", params: { slug, section: "all" } })
  }

  return {
    scrollRef,
    status,
    retry,
    close,
    openAllPolicies,
    stayTitle: stay?.title ?? "",
    messages,
    pending,
    draft,
    setDraft,
    canSend: !pending && !isEmpty(draft.trim()),
    send: () => ask(draft, "typed"),
    chips: CHIPS,
    askChip: (question: string) => ask(question, "chip"),
    onQuestionLayout: (event: LayoutChangeEvent) => {
      questionY.current = event.nativeEvent.layout.y
    },
    // A new question or the pending row follows the end. A reply scrolls to its question instead, so a
    // long card is read from its start (the scroll view stops at the end when the reply is short).
    onThreadSizeChange: () => {
      if (messages.at(-1)?.kind === "reply") {
        scrollRef.current?.scrollTo({ y: Math.max(questionY.current - 16, 0), animated: true })
      } else {
        scrollRef.current?.scrollToEnd({ animated: true })
      }
    },
    topInset: insets.top,
    // Math.max: es-toolkit's clamp needs an upper bound and there is none here
    bottomInset: Math.max(insets.bottom, 12),
  }
}
