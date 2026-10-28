import PostHog, { type PostHogCustomStorage } from "posthog-react-native"
import { Platform } from "react-native"

import { isEmpty, isNil } from "@/lib/utils"

// Public client key and host, inlined at build time like the Clerk publishable key
const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST
const configured = !isNil(projectToken) && !isEmpty(projectToken) && !isNil(host) && !isEmpty(host)

// Native persists through expo-file-system. On web the SDK finds no storage and throws at startup,
// so it gets localStorage, which can itself throw (private windows): fall back to not persisting.
const webStorage: PostHogCustomStorage = {
  getItem: (key) => {
    try {
      return globalThis.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key, value) => {
    try {
      globalThis.localStorage.setItem(key, value)
    } catch {
      // Not persisted this session; events still send
    }
  },
}

// Analytics never blocks the app: without config the client is undefined and every call is skipped
if (__DEV__ && !configured) {
  console.warn("PostHog is off: set EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN and EXPO_PUBLIC_POSTHOG_HOST in .env.local")
}

export const posthog = configured
  ? new PostHog(projectToken, {
      host,
      captureAppLifecycleEvents: true,
      ...(Platform.OS === "web" ? { customStorage: webStorage } : {}),
      errorTracking: {
        autocapture: { uncaughtExceptions: true, unhandledRejections: true, console: [] },
      },
    })
  : undefined
