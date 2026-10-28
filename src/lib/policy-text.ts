import { compact } from "@/lib/utils"

/** "15:00" → "3:00 PM". Formatting only: the stored time is unchanged. */
export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  const suffix = hours < 12 ? "AM" : "PM"

  return `${hours % 12 === 0 ? 12 : hours % 12}:${String(minutes).padStart(2, "0")} ${suffix}`
}

/** Policy bodies separate paragraphs with a blank line. */
export const toParagraphs = (body: string) => compact(body.split(/\n\s*\n/).map((p) => p.trim()))
