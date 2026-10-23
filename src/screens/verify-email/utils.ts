/** 29 → "0:29". */
export const formatCountdown = (seconds: number) =>
  // Native padStart: es-toolkit's main build only has pad (both sides).
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`

/** Keeps only digits, up to the code length. */
export const sanitizeCode = (value: string, length: number) => value.replace(/\D/g, "").slice(0, length)
