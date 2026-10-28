import { fetch } from "expo/fetch"

import { SANITY } from "./config"

const QUERY_URL = `https://${SANITY.projectId}.apicdn.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}`

type QueryResponse<T> = { result: T } | { error: { description?: string } }

// Built by hand because React Native's URLSearchParams is incomplete
const toSearch = (entries: [string, string][]) =>
  entries.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&")

/** Runs a GROQ query against published content. Params are JSON-encoded, never spliced into the query. */
export const sanityFetch = async <T>(query: string, params: Record<string, unknown> = {}, signal?: AbortSignal) => {
  const search = toSearch([
    ["query", query],
    ["perspective", "published"],
    ...Object.entries(params).map(([key, value]): [string, string] => [`$${key}`, JSON.stringify(value)]),
  ])
  const response = await fetch(`${QUERY_URL}?${search}`, { signal })
  const body = (await response.json()) as QueryResponse<T>
  if (!response.ok || "error" in body) {
    throw new Error("error" in body ? body.error.description : `Sanity query failed with ${response.status}`)
  }

  return body.result
}
