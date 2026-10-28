import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native"

import { AskComposer, AskHeader, AskStatus, IntroMessage, PendingRow, ThreadItem } from "./components"
import { useStayAsk } from "./use-stay-ask"

/** Ask about this stay: questions in, one quoted answer card per topic out. */
export const StayAskScreen = () => {
  const { scrollRef, ...vm } = useStayAsk()
  const ready = vm.status === "ready"

  return (
    <View className="flex-1 bg-surface">
      <AskHeader
        stayTitle={vm.stayTitle}
        topInset={vm.topInset}
        onBack={vm.close}
        onOpenPolicies={ready ? vm.openAllPolicies : undefined}
      />
      {vm.status !== "ready" ? (
        <AskStatus status={vm.status} onRetry={vm.retry} onBack={vm.close} />
      ) : (
        // Android resizes the window for the keyboard on its own
        <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView
            ref={scrollRef}
            className="flex-1"
            contentContainerClassName="gap-4 px-5 py-4"
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={vm.onThreadSizeChange}
          >
            <IntroMessage />
            {vm.messages.map((message) => (
              <ThreadItem
                key={message.id}
                message={message}
                onLayout={message.kind === "question" ? vm.onQuestionLayout : undefined}
              />
            ))}
            {vm.pending && <PendingRow />}
          </ScrollView>
          <AskComposer
            chips={vm.chips}
            draft={vm.draft}
            pending={vm.pending}
            canSend={vm.canSend}
            bottomInset={vm.bottomInset}
            onChangeDraft={vm.setDraft}
            onSend={vm.send}
            onAskChip={vm.askChip}
          />
        </KeyboardAvoidingView>
      )}
    </View>
  )
}
