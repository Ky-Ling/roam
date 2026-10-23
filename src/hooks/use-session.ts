import { useAuth, useUser } from "@clerk/expo";

export type SessionUser = { name?: string; email: string };

/** The signed-in guest, from Clerk. isLoaded turns true once Clerk restores the session from the token cache. */
export const useSession = () => {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  
  const user: SessionUser | null = clerkUser
    ? {
        name: clerkUser.fullName ?? undefined,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
      }
    : null;

  return { isLoaded, isSignedIn: !!isSignedIn, user, signOut: () => signOut() };
};
