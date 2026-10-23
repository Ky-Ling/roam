// Imports es-toolkit directly: this file feeds the @/lib/utils barrel.
import { compact } from "es-toolkit"

/** Joins class names, skipping falsy values. Caller classes go last so they win. */
export const cx = (...classes: (string | false | null | undefined)[]) => compact(classes).join(" ")
