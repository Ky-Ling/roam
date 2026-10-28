// Layer 2 of the copy check: an Agent Actions Prompt lists claims the facts don't support.

import type {SanityClient} from 'sanity'

import type {Copy} from './checks'
import {factsJson, type StayRecord} from './facts'
import {CHECK_INSTRUCTION} from './instructions'
import {captureAiGeneration} from './posthog-ai'

type Unsupported = {unsupported?: {claim: string; reason: string}[]}

/** Reasons the copy fails layer 2. Empty means every claim is backed by the facts. */
export const factCheck = async (
  client: SanityClient,
  stay: StayRecord,
  copy: Copy,
  traceId: string,
) => {
  const startedAt = Date.now()
  const input = {
    instruction: CHECK_INSTRUCTION,
    facts: factsJson(stay),
    copy,
  }

  try {
    const raw = await client.agent.action.prompt({
      instruction: CHECK_INSTRUCTION,
      instructionParams: {
        facts: {type: 'constant', value: factsJson(stay)},
        copy: {
          type: 'constant',
          value: `Summary: ${copy.summary}\n\nDescription:\n${copy.description}`,
        },
      },
      format: 'json',
      temperature: 0,
    })
    const parsed = (typeof raw === 'string' ? JSON.parse(raw) : raw) as Unsupported
    if (!Array.isArray(parsed.unsupported))
      throw new Error(`unexpected check response: ${JSON.stringify(raw)}`)

    const unsupported = parsed.unsupported.map((u) => `unsupported: "${u.claim}" (${u.reason})`)
    captureAiGeneration({
      traceId,
      name: 'sanity_agent_fact_check',
      input,
      output: unsupported,
      temperature: 0,
      startedAt,
    })

    return unsupported
  } catch (error) {
    captureAiGeneration({
      traceId,
      name: 'sanity_agent_fact_check',
      input,
      temperature: 0,
      startedAt,
      error,
    })
    throw error
  }
}
