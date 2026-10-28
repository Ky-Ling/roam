import type { Reply } from "@/lib/ask"

export type ThreadMessage =
  | { id: string, kind: "question", text: string }
  | { id: string, kind: "reply", reply: Reply }
