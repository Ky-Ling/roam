import {randomUUID} from 'node:crypto'
import {PostHog} from 'posthog-node'

const projectToken = process.env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.EXPO_PUBLIC_POSTHOG_HOST

// Analytics never blocks a copy run: without config the client is undefined and nothing is sent.
// Inputs and outputs are public listing facts and generated copy, never guest data.
if (!projectToken || !host) {
  console.warn(
    'PostHog is off: set EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN and EXPO_PUBLIC_POSTHOG_HOST in studio/.env.local',
  )
}

const posthog =
  projectToken && host ? new PostHog(projectToken, {host, privacyMode: false}) : undefined

const sessionId = `sanity-copy-${randomUUID()}`

const stringify = (value: unknown) => {
  try {
    return JSON.stringify(value) ?? String(value)
  } catch {
    return '[unserializable]'
  }
}

type Generation = {
  traceId: string
  name: string
  input: unknown
  output?: unknown
  temperature: number
  startedAt: number
  error?: unknown
}

export const createAiTraceId = () => randomUUID()

export const captureAiGeneration = ({
  traceId,
  name,
  input,
  output,
  temperature,
  startedAt,
  error,
}: Generation) => {
  posthog?.capture({
    // The CLI has no authenticated end user. This per-run session id is an anonymous stable id.
    distinctId: sessionId,
    event: '$ai_generation',
    properties: {
      $ai_trace_id: traceId,
      $ai_session_id: sessionId,
      $ai_span_id: randomUUID(),
      $ai_span_name: name,
      // Sanity Agent Actions does not expose its underlying model identifier.
      $ai_provider: 'sanity',
      $ai_input: [{role: 'user', content: stringify(input)}],
      ...(output === undefined
        ? {}
        : {$ai_output_choices: [{role: 'assistant', content: stringify(output)}]}),
      $ai_temperature: temperature,
      $ai_latency: (Date.now() - startedAt) / 1000,
      ...(error === undefined
        ? {}
        : {
            $ai_is_error: true,
            $ai_error: error instanceof Error ? error.name : 'UnknownError',
          }),
    },
  })
}

/** Flushes queued events; a failed flush is logged, never thrown. */
export const shutdownPostHogAi = async () => {
  try {
    await posthog?.shutdown()
  } catch (error) {
    console.warn(`PostHog flush failed: ${String(error)}`)
  }
}
