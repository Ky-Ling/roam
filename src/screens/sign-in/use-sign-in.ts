import { useSignIn as useClerkSignIn } from "@clerk/expo"
import type { SetActiveNavigate } from "@clerk/expo/types"
import { useRouter } from "expo-router"
import { useRef, useState } from "react"
import { Alert, type TextInput } from "react-native"

import { SESSION_TASK_MESSAGE, UNSUPPORTED_SIGN_IN_MESSAGE } from "@/constants/auth"
import { useOAuthSignIn } from "@/hooks/use-oauth-sign-in"
import { clerkErrorMessage, fieldMessage, pendingCodeFlow } from "@/lib/auth/clerk"
import { normalizeEmail, validateEmail } from "@/lib/auth/validation"

/** Orchestrator for Sign in: the form, its validation, and the ways out of it. */
export const useSignIn = () => {
  const router = useRouter()
  const oauth = useOAuthSignIn()
  const { signIn, errors: clerkErrors, fetchStatus } = useClerkSignIn()
  const passwordRef = useRef<TextInput>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // Errors stay hidden until the first submit, then follow every keystroke.
  const [submitted, setSubmitted] = useState(false)
  const [requestError, setRequestError] = useState<string>()

  // Both fields are checked on the device first; Clerk only sees a valid form
  const errors = { email: validateEmail(email), password: password ? undefined : "Enter your password." }
  const isValid = !errors.email && !errors.password

  // The root layout's guard moves the guest to /home once the session is active, so no navigation here.
  const navigate: SetActiveNavigate = ({ session }) => {
    if (session?.currentTask) setRequestError(SESSION_TASK_MESSAGE)
  }

  const submit = async () => {
    setSubmitted(true)
    if (!isValid) return
    setRequestError(undefined)
    oauth.clearOAuthError()
    const { error } = await signIn.password({ emailAddress: normalizeEmail(email), password })
    // A wrong password or unknown email comes back through clerkErrors.fields
    if (error) return
    if (signIn.status === "complete") {
      await signIn.finalize({ navigate })

      return
    }
    // A new device (client trust) or an email second factor: Clerk wants a code from the guest's inbox
    if (pendingCodeFlow(signIn, null)?.kind !== "sign-in") {
      setRequestError(UNSUPPORTED_SIGN_IN_MESSAGE)

      return
    }
    const sent = await signIn.mfa.sendEmailCode()
    if (!sent.error) router.push("/verify-email")
  }

  const forgotPassword = () => Alert.alert("Password reset", "Password reset is coming soon.")

  const serverErrors = {
    email: fieldMessage(clerkErrors.fields.identifier),
    password: fieldMessage(clerkErrors.fields.password),
  }
  const globalError = clerkErrors.global ? clerkErrorMessage(clerkErrors.global[0]) : undefined
  const loading = fetchStatus === "fetching"

  return {
    refs: { password: passwordRef },
    email,
    password,
    emailError: submitted ? (errors.email ?? serverErrors.email) : undefined,
    passwordError: submitted ? (errors.password ?? serverErrors.password) : undefined,
    setEmail,
    setPassword,
    focusPassword: () => passwordRef.current?.focus(),
    loading,
    oauthLoading: oauth.oauthLoading,
    busy: loading || !!oauth.oauthLoading,
    error: requestError ?? globalError ?? oauth.oauthError,
    submit,
    forgotPassword,
    continueWith: oauth.continueWith,
    goToSignUp: () => router.replace("/sign-up"),
    goBack: router.back,
  }
}
