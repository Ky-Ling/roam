# 12 · Ask about this stay

Status: done

## Goal
Tapping "Ask about policies" on a stay opens a full-screen "Ask about this stay" chat. A guest types a question, or taps a topic chip that sends one. Each reply is a set of answer cards, one per topic. Each card holds the stay's own Sanity text word for word and a label naming its source. No written paragraph is generated. There's no backend yet: code picks topics from keywords (standing in for Jev) and builds the cards from the stay data that's already loaded.

## Decisions
- **Answers to this round's questions:**
  - **Design:** no mockup exists. The screen is built from the design system's tokens and primitives, and the Result will say so.
  - **Entry point:** the "Ask about policies" card opens the chat. The cancellation card still opens the policies sheet at `?section=cancellation`. The sheet's full view (`section=all`) stays reachable from a "See all policies" button in the chat header.
  - **Answers:** built from the loaded `StayDetails` (the `fetchStay` session cache, so no new request). A keyword matcher in code picks topics. It sits behind one function, so a later Jev + Context API route can replace it without touching the screen.
  - **Presentation:** a full-screen push over the details screen (`headerShown: false`, back button in the screen).
- **Route:** `src/app/stay/[slug]/ask.tsx`, registered in `AppNavigator` inside the signed-in `Stack.Protected`, next to the policies sheet.
- **Answer module, `src/lib/ask/`** (the backend swap point):
  - `topics.ts`: `TOPICS`, each with `key`, `label` (chip), `question` (what a chip sends), `icon` and `keywords`.
  - `match.ts`: `matchTopics(question)` lowercases, matches whole words or phrases, and returns topic keys in `TOPICS` order.
  - `answer.ts`: `answerQuestion(stay, question): Promise<Reply>`. For now it resolves locally after `REPLY_DELAY_MS` (600) so the screen's "looking it up" state is real. `Reply = { cards: AnswerCard[], unanswered: boolean }`.
- **Topics.** Every text is word for word from Sanity. Sources are labeled as on the policies sheet:

  | Topic (chip) | Chip question | Keywords (examples) | Card content | Source label(s) |
  |---|---|---|---|---|
  | Check-in | "What are the check-in and check-out times?" | check-in, check in, checkout, arrive, arrival, leave, early, late, long stay | "Check-in from 3:00 PM", "Check-out by 11:00 AM"; `checkIn` policies | "This stay's house rules"; "Set for this stay" |
  | Cancellation | "What's the cancellation policy?" | cancel, refund, cancellation | cancellation policy title + body; Roam `cancellation` policies (Extenuating circumstances) | "This stay's cancellation policy"; "Applies to every Roam stay" |
  | Pets | "Can I bring my pet?" | pet, pets, dog, cat, animal | "Pets allowed: Yes/No" (from `petsAllowed`); `pets` policies | "This stay's details"; "Set for this stay" |
  | House rules | "What are the house rules?" | rule, rules, party, smoking, noise, quiet, guests | quiet hours; `rules[]` as bullets | "This stay's house rules" |
  | Payment | "How does payment work?" | pay, payment, charge, fee, deposit | Roam `payment` policies | "Applies to every Roam stay" |
  | Safety | "Is there safety info?" | safety, safe, hot tub, pool, kayak | `safety` policies | "Set for this stay" |
  | Damage | (no chip) | damage, broke, broken, incidental | Roam `damage` policies | "Applies to every Roam stay" |
  | Community | (no chip) | discrimination, community, standards | Roam `community` policies | "Applies to every Roam stay" |

  - One card per topic. A card can hold several entries, and **each entry carries its own source label**, so text from the stay and from Roam is never mixed under one label.
  - A question that matches several topics ("cancel if my dog gets sick?") gets several cards, in `TOPICS` order.
  - A matched topic with no text for this stay (e.g. Safety on a stay with no safety policy) is left out. If nothing is left, or nothing matched, the reply is one **no-answer card**: "Nothing in this stay's rules or Roam's policies answers that." with "Contact Roam support." as text only (no link yet, same as the sheet).
- **Shared text helpers:** `formatTime` and `toParagraphs` move from `screens/stay-policies/utils.ts` to `src/lib/policy-text.ts`, since the sheet and `lib/ask` both use them.
- **Conversation:** in-memory per screen visit, not persisted. The thread opens with one intro message from Roam: "Ask about check-in, pets, cancellation and more. Answers are quoted from this stay's rules and Roam's policies." While a reply is pending, a "Looking that up…" row shows and sending is disabled (chips and send button).
- **Topic chips:** a horizontal row above the input with the six chip topics, always visible. Tapping one sends its `question` as the guest's message, the same as typing it.
- **Input:** `TextField` with the new `message` icon (lucide `MessageCircle`), placeholder "Ask about this stay", `returnKeyType="send"`. The trailing send button is an `IconButton` (new `send` icon, lucide `ArrowUp`), primary, disabled while the trimmed text is empty or a reply is pending. Sending clears the field.
- **Keyboard:** React Native's `KeyboardAvoidingView` (`behavior="padding"` on iOS, none on Android, which resizes). No new dependency. The thread scrolls to the end when content grows and dismisses the keyboard on drag.
- **Layout and tokens** (no design, so these are proposed from the design system):
  - Screen `bg-surface`, safe-area top. Header `px-5 pb-3`: `IconButton icon="back" size="md"`, then a column with "Ask about this stay" (`type-title`) and the stay title (`type-caption`, secondary, 1 line), then `IconButton icon="document" size="md"` with accessibility label "See all policies".
  - Thread: `ScrollView`, `px-5 py-4 gap-4`, hairline `border-t border-border` under the header.
  - Intro message: left aligned, max 85% width, `bg-surface-muted rounded-xl corner-squircle px-4 py-3`, `type-body`.
  - Guest question: right aligned, max 85% width, `bg-lavender-muted rounded-xl corner-squircle px-4 py-3`, `type-body` ink.
  - Answer card: full width, `bg-lavender-subtle rounded-xl corner-squircle p-4 gap-3`. Header row: topic icon 20 `colors.indigo` + topic label `type-body-medium font-jakarta-semibold`. Each entry: optional heading (`body-medium` semibold), paragraphs `type-body` secondary or bullets (reuse `RuleList`, moved to `src/components/policy/rule-list/` since two screens use it), then its source as `type-caption` tertiary with the `document` icon at 14 (`colors.inkTertiary`).
  - No-answer card: the same card on `bg-surface-muted`, with the `search` icon and the label "No answer found".
  - Pending row: `type-caption` tertiary, "Looking that up…".
  - Composer: `border-t border-border bg-surface px-5 pt-3` + safe-area bottom (min 12). Chips `Chip size="sm"` `gap-2` in a horizontal `ScrollView`, then the field 12 below.
  - New tokens: none. New icons: `message: MessageCircle`, `send: ArrowUp`, `safety: ShieldCheck`, `damage: Wrench`, `community: UsersRound` (all confirmed in the installed lucide at build time).
- **Motion:** new messages and cards fade in (`FadeIn`, `DURATION.enter`, `EASE_OUT`). The thread is a plain `ScrollView`, not virtualized, so `entering` is allowed. Reduced motion keeps the fade.
- **States:** loading shows the header and "Loading this stay…". Error shows `StatusBanner` "Couldn't load this stay." with a secondary "Try again" button. Missing shows "This stay isn't available anymore." The composer is hidden unless the stay is ready.
- **PostHog:**
  - `stay_ask_opened` `{ stay_id }` from the Ask card. It replaces `stay_policies_opened` with `section: "all"` there. "See all policies" in the chat sends `stay_policies_opened` `{ section: "all" }`.
  - `stay_question_asked` `{ stay_id, input: "chip" | "typed", topics: string[], answered: boolean }` once per reply. No question text is ever sent.

## Out of scope
- Jev, the Context endpoint, and the API route with Clerk session checks. `answerQuestion` is the seam.
- Persisting conversations, and support contact links.
- Schema changes. None are needed.

## Steps
### 1. Answer module and shared helpers
- Move `formatTime`/`toParagraphs` to `src/lib/policy-text.ts` and update `screens/stay-policies/utils.ts`.
- Add `src/lib/ask/` (`topics.ts`, `match.ts`, `answer.ts`, `types.ts`, `index.ts`) as described.
- Done when lint and type check pass and a scratch run of `answerQuestion` against the live `lakeside-boathouse` data gives: "cancel?" → Cancellation card (Free/Flexible/… policy + Extenuating circumstances, two source labels); "can I bring my dog" → Pets card with "Pets allowed: No"; "is there a gym" → the no-answer card.

### 2. Icons and shared rule list
- Add the five icons to `ui/icon`. Move `RuleList` to `src/components/policy/rule-list/` and import it from the sheet.

### 3. Chat screen
- `src/app/stay/[slug]/ask.tsx` + `AppNavigator` entry.
- `src/screens/stay-ask/`: `index.tsx`, `use-stay-ask.ts` (params, `useStayDetails`, messages, draft, pending, send, chip send, events, navigation, scroll ref returned under `refs`), `constants.ts` (intro copy), `components/` with `ask-header.tsx`, `intro-message.tsx`, `question-bubble.tsx`, `answer-card.tsx`, `answer-entry.tsx`, `no-answer-card.tsx`, `pending-row.tsx`, `topic-chips.tsx`, `ask-composer.tsx`, `ask-status.tsx`.
- Wire the details screen's Ask card to `/stay/[slug]/ask` with `stay_ask_opened`.

### 4. Look check
Open `roam://stay/lakeside-boathouse/ask` in the iOS simulator (or web at 393×852 if no simulator is available, as in plan 11). Screenshot the empty thread, a chip reply, a multi-topic reply, a no-answer reply and the keyboard-open state. Check them against the design system (spacing, type, tokens), fix, and repeat.

## Verification
- `npx expo lint` and `npx tsc --noEmit` are clean.
- Flows:
  1. Details → "Ask about policies" opens the chat with the intro message, six chips and an empty input with the message icon.
  2. Tap "Cancellation". The question bubble shows "What's the cancellation policy?", then "Looking that up…", then one Cancellation card whose text matches Studio word for word, each part with its source label.
  3. Type "Can I bring my dog, and can I cancel?" and send. Two cards: Cancellation, then Pets (`TOPICS` order).
  4. Type "Is there a gym?". The no-answer card shows.
  5. While a reply is pending, the chips and send button do nothing.
  6. The keyboard doesn't cover the input. The thread scrolls to the newest reply.
  7. "See all policies" opens the sheet with every section. The cancellation card on details still opens the cancellation-only sheet.
  8. `roam://stay/not-a-stay/ask` shows the missing state.
- PostHog (MCP SQL): `stay_ask_opened` once per open; `stay_question_asked` with `input`, `topics`, `answered` and no question text.

## AGENTS.md updates
- **Expo / routes:** `/stay/[slug]/ask` (full-screen chat, opened by the Ask card) is in the signed-in guard.
- **Policy knowledge:** until Jev + Context land, the chat answers locally through `src/lib/ask` (`answerQuestion`, keyword topics). Replies are one card per topic, each entry word for word with its source. Replace the matcher behind `answerQuestion`, not the screen.
- **Analytics:** `stay_ask_opened` (`stay_id`), `stay_question_asked` (`input`, `topics`, `answered`, never the text). `stay_policies_opened` `section: "all"` now comes from the chat header.
- **Design system:** icons `message`, `send`, `safety`, `damage`, `community`. `RuleList` lives in `components/policy/`.

## Result
Built as planned. Lint and type check are clean. There's no iOS Simulator on this Mac (no Xcode), so it was checked on web at 393×852 through Playwright, signed in as the dev test user with a Clerk sign-in token. Not yet seen on iOS or Android, so `KeyboardAvoidingView` and the keyboard-open layout are untested on device.
- **Answers against live data** (`buildReply` on `lakeside-boathouse`): "cancel?" → Cancellation with Free cancellation and Extenuating circumstances, each with its own source. The dog + cancel question → Cancellation and Pets ("Pets allowed: No"). Check-in, House rules, Safety, Payment and "I broke a lamp" (Damage) are all right. "is there a gym" → the no-answer card.
- **Changes during the build:**
  - A reply scrolls the thread to its question, not to the end, so a long card is read from its start. The question's position comes from `onLayout`.
  - `IconButton` got `variant="primary"` (yellow) for the send button. It's shown on `/design-system`.
  - The chip row bleeds to the screen edges with an inline `marginHorizontal: -20` (not `-mx-5`, for native).
  - The thread types (`ThreadMessage`) live in `screens/stay-ask/types.ts`.
  - The details screen's `openPolicies("all")` is unused now: the Ask card calls `openAsk`, and only the cancellation card opens the sheet from details.
- **PostHog (MCP SQL):** `stay_ask_opened` arrived with the slug. `stay_question_asked` arrived with `input` `chip`/`typed`, `topics` and `answered`, and no question text. In the scripted run, the last chip question and the chat's `stay_policies_opened` didn't arrive. The script reloads the page right after them, which drops PostHog's unsent batch, so those two are unconfirmed rather than failing.
- **No design:** the layout uses the design system only. Swap it in when a mockup exists.
