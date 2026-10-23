import { isClerkAPIResponseError } from "@clerk/expo"
import type { SignInFutureResource, SignUpFutureResource } from "@clerk/expo/types"

import { isEmpty } from "../utils"

type MessageSource = { message: string, longMessage?: string } | null | undefined

/** "Joanna Van Smith" → { firstName: "Joanna", lastName: "Van Smith" }; blank parts are left out. */
export const splitFullName = (fullName: string) => {
  // Native split: es-toolkit's words() also breaks on apostrophes and hyphens ("O'Brien", "Jean-Luc")
  const [first, ...rest] = fullName.trim().split(/\s+/)
  const lastName = rest.join(" ")

  return { firstName: isEmpty(first) ? undefined : first, lastName: isEmpty(lastName) ? undefined : lastName }
}

/** Readable text for a Clerk field error, e.g. errors.fields.password. */
export const fieldMessage = (error: MessageSource) => (error ? (error.longMessage ?? error.message) : undefined)

/** Readable text for an error returned by a Clerk method or thrown by a Clerk call. */
export const clerkErrorMessage = (error: unknown) => {
  // A ClerkAPIResponseError's own message is a formatted dev string; the API's first error reads better
  if (isClerkAPIResponseError(error)) return fieldMessage(error.errors[0]) ?? error.message
  if (error instanceof Error) return error.message

  return "Something went wrong. Try again."
}

export type CodeFlow = { kind: "sign-up" | "sign-in", email: string }

/**
 * Which flow is waiting for an emailed code: a sign-up confirming its email, or a sign-in from a new
 * device (client trust) or with an email second factor. Undefined when neither is.
 */
export const pendingCodeFlow = (
  signIn: SignInFutureResource,
  signUp: SignUpFutureResource | null,
): CodeFlow | undefined => {
  const signInNeedsCode =
    (signIn.status === "needs_client_trust" || signIn.status === "needs_second_factor") &&
    signIn.supportedSecondFactors.some((f) => f.strategy === "email_code")
  if (signInNeedsCode && signIn.identifier) return { kind: "sign-in", email: signIn.identifier }
  if (signUp?.status === "missing_requirements" && signUp.unverifiedFields.includes("email_address") && signUp.emailAddress) {
    return { kind: "sign-up", email: signUp.emailAddress }
  }

  return undefined
}
