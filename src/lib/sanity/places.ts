import { sanityFetch } from "./client"

/** Every city, region code and region name a published stay sits in. */
const SEARCH_PLACES_QUERY = `array::unique(*[_type == "property"]{
  "p": [location.city, location.region, location.regionName]
}.p[])`

let cached: Promise<string[]> | null = null

/** Place names for the search parser, fetched once per session. A failure clears the cache so a retry refetches. */
export const fetchPlaces = () => {
  cached ??= sanityFetch<string[]>(SEARCH_PLACES_QUERY).catch((error: unknown) => {
    cached = null
    throw error
  })

  return cached
}
