import { View, type LayoutChangeEvent } from "react-native"
import Animated, { FadeIn } from "react-native-reanimated"

import { DURATION, EASE_OUT } from "@/constants/motion"
import { isEmpty } from "@/lib/utils"

import type { ThreadMessage } from "../types"
import { AnswerCard } from "./answer-card"
import { NoAnswerCard } from "./no-answer-card"
import { QuestionBubble } from "./question-bubble"

// A fade only, so reduced motion keeps it as is. The thread isn't virtualized, so `entering` is safe.
const itemEntering = FadeIn.duration(DURATION.enter).easing(EASE_OUT)

/** A guest question, or Roam's reply as one card per topic. */
type ThreadItemProps = {
  message: ThreadMessage
  onLayout?: (event: LayoutChangeEvent) => void
}

export const ThreadItem = ({ message, onLayout }: ThreadItemProps) => (
  <Animated.View entering={itemEntering} onLayout={onLayout}>
    {message.kind === "question" ? (
      <QuestionBubble text={message.text} />
    ) : (
      <View className="gap-3">
        {isEmpty(message.reply.cards) ? (
          <NoAnswerCard />
        ) : (
          message.reply.cards.map((card) => <AnswerCard key={card.topic} {...card} />)
        )}
      </View>
    )}
  </Animated.View>
)
