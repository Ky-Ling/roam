// Public identifiers for a public-read dataset, so they're constants rather than env vars.
// The app never sends a token: listing content is all it reads.
export const SANITY = {
  projectId: "vjn3nb8q",
  dataset: "roam-dataset",
  apiVersion: "2026-10-01",
} as const
