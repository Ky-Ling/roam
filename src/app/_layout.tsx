import { ClerkProvider } from "@clerk/expo"
import { tokenCache } from "@clerk/expo/token-cache"
import { PostHogProvider } from "posthog-react-native"
import "../../global.css"

import { AppNavigator } from "@/components/app-navigator"
import { posthog } from "@/lib/posthog"

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to .env.local and restart the dev server.")
}

// tokenCache keeps the session in expo-secure-store, so guests stay signed in across launches
const RootLayout = () => {
  const app = (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <AppNavigator />
    </ClerkProvider>
  )

  // Autocapture stays off: screen names would carry Search's ?q= (what guests type). Events are explicit.
  return posthog ? (
    <PostHogProvider client={posthog} autocapture={false}>
      {app}
    </PostHogProvider>
  ) : (
    app
  )
}

export default RootLayout
