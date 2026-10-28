import { useAuth, useUser } from "@clerk/expo"

import { posthog } from "@/lib/posthog"

export type SessionUser = { name?: string, firstName?: string, email: string, imageUrl?: string }

/** The signed-in guest, from Clerk. isLoaded turns true once Clerk restores the session from the token cache. */
export const useSession = () => {
  const { isLoaded, isSignedIn, signOut: clerkSignOut } = useAuth()
  const { user: clerkUser } = useUser()

  const user: SessionUser | null = clerkUser
    ? {
        name: clerkUser.fullName ?? undefined,
        firstName: clerkUser.firstName ?? undefined,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        // Clerk hands out a generated avatar when there's no photo; we show an initial instead
        imageUrl: clerkUser.hasImage ? clerkUser.imageUrl : undefined,
      }
    : null

  const signOut = async () => {
    posthog?.reset()
    await clerkSignOut()
  }

  return { isLoaded, isSignedIn: !!isSignedIn, user, signOut }
}
