import { useAuth, useUser } from "@clerk/expo";

export type SessionUser = { name?: string; firstName?: string; email: string; imageUrl?: string };

/** The signed-in guest, from Clerk. isLoaded turns true once Clerk restores the session from the token cache. */
export const useSession = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user: clerkUser } = useUser();

  const user: SessionUser | null = clerkUser
    ? {
        name: clerkUser.fullName ?? undefined,
        firstName: clerkUser.firstName ?? undefined,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        // Clerk hands out a generated avatar when there's no photo; we show an initial instead
        imageUrl: clerkUser.hasImage ? clerkUser.imageUrl : undefined,
      }
    : null;

  return { isLoaded, isSignedIn: !!isSignedIn, user, signOut: () => signOut() };
};
