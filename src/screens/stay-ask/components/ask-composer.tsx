import { View } from "react-native"

import { IconButton } from "@/components/ui/icon-button"
import { TextField } from "@/components/ui/text-field"

import { TopicChips } from "./topic-chips"

type AskComposerProps = {
  chips: { key: string, label: string, question: string }[]
  draft: string
  pending: boolean
  canSend: boolean
  bottomInset: number
  onChangeDraft: (text: string) => void
  onSend: () => void
  onAskChip: (question: string) => void
}

/** Topic chips over the question field, pinned above the keyboard. */
export const AskComposer = ({
  chips,
  draft,
  pending,
  canSend,
  bottomInset,
  onChangeDraft,
  onSend,
  onAskChip,
}: AskComposerProps) => (
  <View className="gap-3 border-t border-border bg-surface px-5 pt-3" style={{ paddingBottom: bottomInset }}>
    <TopicChips chips={chips} disabled={pending} onAsk={onAskChip} />
    <TextField
      icon="message"
      placeholder="Ask about this stay"
      accessibilityLabel="Your question"
      value={draft}
      onChangeText={onChangeDraft}
      returnKeyType="send"
      submitBehavior="submit"
      onSubmitEditing={onSend}
      trailing={
        <IconButton
          icon="send"
          variant="primary"
          size="sm"
          accessibilityLabel="Send question"
          disabled={!canSend}
          onPress={onSend}
        />
      }
    />
  </View>
)
