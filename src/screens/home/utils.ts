import type { SessionUser } from "@/hooks/use-session"

/** First name for the greeting, falling back to the email's local part. */
export const greetingName = (user: SessionUser | null) => user?.firstName ?? user?.email.split("@")[0] ?? ""
