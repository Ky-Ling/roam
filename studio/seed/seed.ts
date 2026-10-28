// Seeds policies, hosts and stays. Safe to run more than once: every document is upserted by its
// slug (Sanity generates the _id on first create), images are reused by their Unsplash id, and
// nothing is ever deleted.
//
//   npm run seed               write to the dataset in sanity.cli.ts
//   npm run seed -- --dry-run  print what would be created or updated, write nothing

import {getCliClient} from 'sanity/cli'

import {AMENITIES} from '../schemaTypes/constants'
import {HOSTS} from './data/hosts'
import {POLICIES} from './data/policies'
import {STAYS} from './data/stays'
import type {SeedPhoto} from './types'

const client = getCliClient({apiVersion: '2026-10-01'})
const dryRun = process.argv.includes('--dry-run')
const UPLOAD_CONCURRENCY = 4

type SeedType = 'policy' | 'host' | 'property'
type Fields = Record<string, unknown>

const counts = {created: 0, updated: 0, uploaded: 0, reusedAssets: 0}

// --- checks -----------------------------------------------------------------------------------

const assertData = () => {
  const errors: string[] = []
  const unique = (label: string, values: string[]) => {
    const seen = new Set<string>()
    for (const v of values) {
      if (seen.has(v)) errors.push(`duplicate ${label}: ${v}`)
      seen.add(v)
    }
  }
  const amenityKeys = new Set<string>(AMENITIES.map((a) => a.value))
  const policySlugs = new Set(POLICIES.map((p) => p.slug))
  const hostSlugs = new Set(HOSTS.map((h) => h.slug))

  unique(
    'policy slug',
    POLICIES.map((p) => p.slug),
  )
  unique(
    'host slug',
    HOSTS.map((h) => h.slug),
  )
  unique(
    'stay slug',
    STAYS.map((s) => s.slug),
  )
  unique(
    'stay cover',
    STAYS.map((s) => s.photos[0].id),
  )

  for (const s of STAYS) {
    unique(
      `photo in ${s.slug}`,
      s.photos.map((p) => p.id),
    )
    unique(`amenity in ${s.slug}`, s.amenities)
    unique(`vibe in ${s.slug}`, s.vibes)
    if (s.vibes.length < 1 || s.vibes.length > 4) errors.push(`${s.slug}: needs 1-4 vibes`)
    s.amenities
      .filter((a) => !amenityKeys.has(a))
      .forEach((a) => errors.push(`${s.slug}: unknown amenity ${a}`))
    if (!hostSlugs.has(s.host)) errors.push(`${s.slug}: unknown host ${s.host}`)
    const cancellation = POLICIES.find((p) => p.slug === s.cancellationPolicy)
    if (cancellation?.category !== 'cancellation' || cancellation.appliesToAllStays)
      errors.push(`${s.slug}: ${s.cancellationPolicy} is not a per-stay cancellation policy`)
    for (const slug of s.policies) {
      const p = POLICIES.find((x) => x.slug === slug)
      if (!policySlugs.has(slug)) errors.push(`${s.slug}: unknown policy ${slug}`)
      else if (p?.appliesToAllStays || p?.category === 'cancellation')
        errors.push(`${s.slug}: ${slug} can't be a stay-specific policy`)
    }
    if (s.photos.length > 24) errors.push(`${s.slug}: more than 24 photos`)
  }

  if (errors.length > 0) throw new Error(`Seed data is invalid:\n  ${errors.join('\n  ')}`)
}

// --- helpers ----------------------------------------------------------------------------------

const unsplashUrl = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1600&q=80&auto=format&fit=crop`

const describe = (error: unknown): string =>
  error instanceof Error
    ? `${error.message}${error.cause ? ` (${describe(error.cause)})` : ''}`
    : String(error)

/** Network calls flake on long runs; retry a few times with backoff before failing the seed. */
const withRetry = async <T>(label: string, fn: () => Promise<T>, attempts = 4): Promise<T> => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt >= attempts)
        throw new Error(`${label} failed: ${describe(error)}`, {cause: error})
      console.warn(`  ! ${label} failed (${describe(error)}), retrying`)
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt))
    }
  }
}

const mapLimit = async <T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) => {
  const results: R[] = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const i = next++
      results[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({length: Math.min(limit, items.length)}, worker))

  return results
}

/** Published _id for a slug, or null. Warns if someone left a Studio draft of it. */
const findId = async (type: SeedType, slug: string) => {
  const ids = await client.fetch<string[]>(
    `*[_type == $type && slug.current == $slug]._id`,
    {type, slug},
    {perspective: 'raw'},
  )
  const draft = ids.find((id) => id.startsWith('drafts.') || id.startsWith('versions.'))
  if (draft)
    console.warn(`  ! ${type} "${slug}" has an unpublished draft (${draft}); left untouched`)

  return ids.find((id) => !id.includes('.')) ?? null
}

const requireId = async (type: SeedType, slug: string) => {
  const id = await findId(type, slug)
  if (!id && !dryRun) throw new Error(`Missing ${type} "${slug}"`)

  return id ?? `dry-run:${type}:${slug}`
}

/** `createOnly` fields are written on create and never overwritten by later runs. */
const upsert = async (type: SeedType, slug: string, fields: Fields, createOnly: Fields = {}) => {
  const id = await findId(type, slug)
  const doc = {...fields, slug: {_type: 'slug', current: slug}}

  if (id) {
    counts.updated++
    if (!dryRun) await client.patch(id).set(doc).commit()
    console.log(`  updated ${type} ${slug}`)

    return id
  }

  counts.created++
  if (dryRun) {
    console.log(`  would create ${type} ${slug}`)

    return `dry-run:${type}:${slug}`
  }
  const created = await client.create({_type: type, ...createOnly, ...doc})
  console.log(`  created ${type} ${slug}`)

  return created._id
}

const assetIds = new Map<string, string>()

/** Asset _id for an Unsplash photo, uploading it only the first time it's seen. */
const assetFor = async (photoId: string) => {
  const cached = assetIds.get(photoId)
  if (cached) return cached

  const existing = await client.fetch<string | null>(
    `*[_type == "sanity.imageAsset" && source.name == "unsplash" && source.id == $id][0]._id`,
    {id: photoId},
  )
  if (existing) {
    counts.reusedAssets++
    assetIds.set(photoId, existing)

    return existing
  }
  if (dryRun) {
    counts.uploaded++
    assetIds.set(photoId, `dry-run:asset:${photoId}`)

    return `dry-run:asset:${photoId}`
  }

  const bytes = await withRetry(`download ${photoId}`, async () => {
    const res = await fetch(unsplashUrl(photoId))
    if (!res.ok) throw new Error(`returned ${res.status}`)

    return Buffer.from(await res.arrayBuffer())
  })
  const asset = await withRetry(`upload ${photoId}`, () =>
    client.assets.upload('image', bytes, {
      filename: `unsplash-${photoId}.jpg`,
      source: {name: 'unsplash', id: photoId, url: `https://unsplash.com/photos/${photoId}`},
    }),
  )
  counts.uploaded++
  assetIds.set(photoId, asset._id)

  return asset._id
}

const imageField = async (photo: SeedPhoto) => ({
  _type: 'image',
  asset: {_type: 'reference', _ref: await assetFor(photo.id)},
  alt: photo.alt,
})

const ref = (id: string) => ({_type: 'reference', _ref: id})

// --- seed -------------------------------------------------------------------------------------

const seedPolicies = async () => {
  console.log(`Policies (${POLICIES.length})`)
  for (const {slug, ...fields} of POLICIES) await upsert('policy', slug, fields)
}

const seedHosts = async () => {
  console.log(`Hosts (${HOSTS.length})`)
  for (const {slug, photo, ...fields} of HOSTS) {
    await upsert('host', slug, {...fields, photo: await imageField(photo)})
  }
}

const seedStays = async () => {
  console.log(`Stays (${STAYS.length})`)
  for (const stay of STAYS) {
    const {
      slug,
      summary,
      description,
      location,
      photos,
      host,
      cancellationPolicy,
      policies,
      houseRules,
      ...fields
    } = stay
    // Fetch every photo before writing, so a dead URL fails the stay before anything changes.
    const images = await mapLimit(photos, UPLOAD_CONCURRENCY, imageField)
    const {lat, lng, ...place} = location

    await upsert(
      'property',
      slug,
      {
        ...fields,
        location: {...place, coordinates: {_type: 'geopoint', lat, lng}},
        // Keys come from content, so reruns don't churn them
        photos: images.map((image, i) => ({...image, _key: `photo-${photos[i].id}`})),
        host: ref(await requireId('host', host)),
        cancellationPolicy: ref(await requireId('policy', cancellationPolicy)),
        policies: await Promise.all(
          policies.map(async (p) => ({...ref(await requireId('policy', p)), _key: p})),
        ),
        houseRules,
      },
      {summary, description},
    )
  }
}

const main = async () => {
  const {projectId, dataset} = client.config()
  console.log(`${dryRun ? 'Dry run against' : 'Seeding'} ${projectId}/${dataset}\n`)

  assertData()
  await seedPolicies()
  await seedHosts()
  await seedStays()

  console.log(
    `\n${dryRun ? 'Would create' : 'Created'} ${counts.created}, ${dryRun ? 'would update' : 'updated'} ${counts.updated}. ` +
      `Images: ${counts.uploaded} ${dryRun ? 'to upload' : 'uploaded'}, ${counts.reusedAssets} reused.`,
  )
}

main().catch((error) => {
  console.error(describe(error))
  process.exit(1)
})
