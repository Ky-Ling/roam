// Writes each stay's summary and description with Agent Actions, using only the stay's own fields,
// then checks the result twice (code rules, then an Agent Actions Prompt). Copy that passes goes to
// a draft for review in the Studio; nothing is ever published here.
//
//   npm run copy                       every published stay
//   npm run copy -- --slug <slug>      one stay
//   npm run copy -- --dry-run          generate and check, write nothing

import {getCliClient} from 'sanity/cli'

import {checkCopy, type Copy} from './checks'
import {factCheck} from './fact-check'
import {factsJson, fetchStays, type StayRecord} from './facts'
import {avoidText, GENERATE_INSTRUCTION} from './instructions'
import {captureAiGeneration, createAiTraceId, shutdownPostHogAi} from './posthog-ai'

// Agent Actions are experimental and only served on API version vX
const client = getCliClient({apiVersion: 'vX'})
const SCHEMA_ID = '_.schemas.default'
const ATTEMPTS = 2

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const slugArg = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null

type Result =
  | {slug: string; status: 'written' | 'checked'; copy: Copy; attempts: number}
  | {slug: string; status: 'failed'; failures: string[]; copy?: Copy}
  | {slug: string; status: 'skipped'; reason: string}

const generate = async (stay: StayRecord, failures: string[], traceId: string): Promise<Copy> => {
  const startedAt = Date.now()
  const input = {
    instruction: GENERATE_INSTRUCTION,
    facts: factsJson(stay),
    avoid: avoidText(failures),
  }

  try {
    const doc = await client.agent.action.generate({
      schemaId: SCHEMA_ID,
      documentId: stay._id,
      noWrite: true,
      temperature: 0.3,
      instruction: GENERATE_INSTRUCTION,
      instructionParams: {
        facts: {type: 'constant', value: factsJson(stay)},
        avoid: {type: 'constant', value: avoidText(failures)},
      },
      target: {include: ['summary', 'description']},
    })
    const copy = {
      summary: String(doc.summary ?? '').trim(),
      description: String(doc.description ?? '').trim(),
    }
    captureAiGeneration({
      traceId,
      name: 'sanity_agent_generate',
      input,
      output: copy,
      temperature: 0.3,
      startedAt,
    })

    return copy
  } catch (error) {
    captureAiGeneration({
      traceId,
      name: 'sanity_agent_generate',
      input,
      temperature: 0.3,
      startedAt,
      error,
    })
    throw error
  }
}

const writeDraft = async (stay: StayRecord, copy: Copy) => {
  const published = await client.getDocument(stay._id)
  if (!published) throw new Error(`${stay._id} disappeared`)
  const {_rev, _createdAt, _updatedAt, ...fields} = published
  await client.createOrReplace({...fields, _id: `drafts.${stay._id}`, ...copy})
}

const run = async (stay: StayRecord): Promise<Result> => {
  const hasDraft = await client.fetch<boolean>(`defined(*[_id == $id][0]._id)`, {
    id: `drafts.${stay._id}`,
  })
  if (hasDraft && !dryRun)
    return {slug: stay.slug, status: 'skipped', reason: 'a draft already exists'}

  const traceId = createAiTraceId()
  let failures: string[] = []
  let copy: Copy | undefined
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    copy = await generate(stay, failures, traceId)
    failures = checkCopy(copy, stay)
    // Layer 2 only runs on copy that already passes the cheap rules
    if (failures.length === 0) failures = await factCheck(client, stay, copy, traceId)
    if (failures.length === 0) {
      if (!dryRun) await writeDraft(stay, copy)

      return {slug: stay.slug, status: dryRun ? 'checked' : 'written', copy, attempts: attempt}
    }
    if (attempt < ATTEMPTS)
      console.log(`  ${stay.slug} attempt ${attempt} rejected: ${failures.join('; ')}`)
  }

  return {slug: stay.slug, status: 'failed', failures, copy}
}

const print = (r: Result) => {
  if (r.status === 'skipped') return console.log(`- ${r.slug}: skipped, ${r.reason}`)
  if (r.status === 'failed') {
    console.log(`✗ ${r.slug}: failed after ${ATTEMPTS} attempts`)
    r.failures.forEach((f) => console.log(`    ${f}`))
    if (r.copy) console.log(`    last summary: ${r.copy.summary}`)

    return
  }
  console.log(`✓ ${r.slug}: ${r.status}${r.attempts > 1 ? ' (on retry)' : ''}`)
  console.log(`    ${r.copy.summary}`)
  r.copy.description.split('\n').forEach((line) => console.log(`    ${line}`))
}

const main = async () => {
  const {projectId, dataset} = client.config()
  const stays = await fetchStays(client, slugArg)
  if (stays.length === 0) throw new Error(slugArg ? `No published stay "${slugArg}"` : 'No stays')
  console.log(
    `${dryRun ? 'Dry run' : 'Writing drafts'}: ${stays.length} stays in ${projectId}/${dataset}\n`,
  )

  const results: Result[] = []
  for (const stay of stays) {
    const result = await run(stay).catch((error: unknown): Result => ({
      slug: stay.slug,
      status: 'failed',
      failures: [String(error)],
    }))
    print(result)
    results.push(result)
  }

  const count = (s: Result['status']) => results.filter((r) => r.status === s).length
  console.log(
    `\n${count('written') + count('checked')} passed, ${count('failed')} failed, ${count('skipped')} skipped.`,
  )
  if (count('failed') > 0) process.exitCode = 1
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(shutdownPostHogAi)
