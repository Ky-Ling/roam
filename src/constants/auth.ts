// Shown when a session finishes but Clerk still requires a task (e.g. MFA enrollment) the app doesn't support yet
export const SESSION_TASK_MESSAGE = "Your account needs an extra setup step roam doesn't support yet. Contact support."

export const UNSUPPORTED_SIGN_IN_MESSAGE =
  "This account needs a sign-in method roam doesn't support yet. Contact support."

// Clerk Protect wants a bot challenge that only Clerk's web UI can run (native sign-ups aren't challenged)
export const PROTECT_CHECK_MESSAGE = "We couldn't verify this sign-up. Try again, or contact support if it keeps happening."
