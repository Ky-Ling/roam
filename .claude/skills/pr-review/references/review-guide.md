# Review Guide

Anti-patterns and examples for each review dimension, in Roam's stack (Expo Router, React Native, Clerk, Sanity/GROQ, Jev).

## Over-engineering

```
Wrapper adding no value:
  export const getStay = (id: string) => sanity.fetch(STAY_QUERY, { id })
  // called from one place
  → Call sanity.fetch at the call site

Factory for one product:
  createButton("primary")  // only ever called with "primary"
  → Use the primary variant directly

Config object for a single value:
  const config = { retryCount: 3 }
  → Use a constant

Generic with one instantiation:
  function rank<T extends Stay>(items: T[]) { ... }  // T is always Stay
  → Use Stay directly
```

## Simplification

```typescript
// BEFORE: nested conditions
if (stay) {
  if (stay.petsAllowed) {
    if (stay.price <= maxPrice) showStay(stay)
  }
}

// AFTER: guard clause
if (!stay?.petsAllowed || stay.price > maxPrice) return
showStay(stay)
```

```typescript
// BEFORE: repeated conditionals
if (status === 'confirmed') return colors.success
if (status === 'pending') return colors.warning
if (status === 'cancelled') return colors.danger

// AFTER: lookup map
const colorByStatus = { confirmed: colors.success, pending: colors.warning, cancelled: colors.danger }
return colorByStatus[status]
```

Derived state: a value computable from props/state is computed during render, not stored in state and synced by an effect.

## Robustness

```typescript
// BAD: no error path; the screen spins forever on failure
const res = await fetch('/api/search', { method: 'POST', body })
setStays(await res.json())

// GOOD: check the response and surface an error state
const res = await fetch('/api/search', { method: 'POST', body })
if (!res.ok) return setError('Search failed. Try again.')
setStays(await res.json())
```

```typescript
// BAD: subscription never removed
useEffect(() => {
  AppState.addEventListener('change', onChange)
}, [])

// GOOD: return the cleanup
useEffect(() => {
  const sub = AppState.addEventListener('change', onChange)
  return () => sub.remove()
}, [])
```

```typescript
// BAD: stale response overwrites a newer query when the guest types again
useEffect(() => {
  search(query).then(setResults)
}, [query])

// GOOD: abort the previous request
useEffect(() => {
  const controller = new AbortController()
  search(query, { signal: controller.signal }).then(setResults).catch(ignoreAbort)
  return () => controller.abort()
}, [query])
```

```typescript
// BAD: analytics failure breaks the booking flow
await posthog.capture('booking_started')
router.push('/checkout')

// GOOD: fire and forget; PostHog never blocks the app
void Promise.resolve(posthog.capture('booking_started')).catch(() => {})
router.push('/checkout')
```

Screens that load data render loading, error, and empty states; a screen with only the success state is a Robustness finding.

## Consistency

```typescript
// BAD: mixed handler naming in one component
const handleSubmit = () => {}
const onCancel = () => {}
const clickDelete = () => {}

// GOOD: one convention
const handleSubmit = () => {}
const handleCancel = () => {}
const handleDelete = () => {}
```

```tsx
// BAD: hardcoded values beside token-based siblings
<View style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 10 }} />

// GOOD: design-system tokens, as the rest of the screen uses
<View style={{ padding: spacing.md, backgroundColor: colors.surface, borderRadius: radii.md }} />
```

**Justified divergence (omit)**: code that bypasses a shared helper because the helper genuinely doesn't cover its case is not an inconsistency. Self-check: "Could this code use the existing pattern without hacks?" If no, omit.

## Behavioral regression

```typescript
// Default changed in a shared hook for one screen's needs
export function useStaySearch(limit = 10) {}   // before
export function useStaySearch(limit = 20) {}   // after
// PROBLEM: every caller without an argument now gets 20 results.
// FIX: pass 20 at the one call site.
```

```typescript
// Debounce raised "for performance"
useDebouncedValue(query, 300) → useDebouncedValue(query, 800)
// PROBLEM: search feels laggy; a UX regression outside the PR's goal.
```

```tsx
// Only one platform file updated
// stay-card.tsx changed to show the nightly price; stay-card.web.tsx not
// PROBLEM: web shows the old layout.
```

Self-check: "Would a guest notice this even though it wasn't the PR's goal?" If yes, it is an Impact finding.

## Security

```typescript
// CRITICAL: secret bundled into the app
const client = createClient({ token: process.env.EXPO_PUBLIC_SANITY_WRITE_TOKEN })

// GOOD: secret read only inside an API route
// src/app/api/seed+api.ts
const client = createClient({ token: process.env.SANITY_WRITE_TOKEN })
```

```typescript
// CRITICAL: API route does work before checking the session
export async function POST(req: Request) {
  const body = await req.json()
  return Response.json(await searchStays(body))
}

// GOOD: verify the Clerk session first, then validate the body
```

```typescript
// CRITICAL: guest text interpolated into GROQ
sanity.fetch(`*[_type == "property" && city == "${city}"]`)

// GOOD: params
sanity.fetch(`*[_type == "property" && city == $city]`, { city })
```

```typescript
// CRITICAL: upstream error (may contain tokens or internals) returned to the client
catch (err) { return Response.json({ error: String(err) }, { status: 500 }) }

// GOOD: generic client message; details stay server-side
catch { return Response.json({ error: 'Search failed' }, { status: 500 }) }
```

```typescript
// CRITICAL: guest input or personal data in analytics
posthog.capture('search', { query: text, email: user.email })

// GOOD: shape-only properties
posthog.capture('search', { filters: Object.keys(filters) })
```

Also CRITICAL: tokens in route params or deep links, and deep-link params used without validation.

## Architecture

Each responsibility belongs to one tool (`.claude/CLAUDE.md` "Who owns what"). Report a responsibility moved to a different tool:

```typescript
// BAD: Jev asked to produce a value code must parse
const maxPrice = await jev.score('What is the guest’s max nightly price?')

// GOOD: code parses the price; Jev only chooses between candidates code found
const maxPrice = parsePrice(text)
```

```typescript
// BAD: hard constraint enforced by embedding similarity
score(text::semanticSimilarity("pet friendly"))

// GOOD: pets is a GROQ filter; embeddings only rank soft intent ("quiet", "cozy")
*[_type == "property" && petsAllowed == true] | score(text::semanticSimilarity($vibe))
```

```tsx
// BAD: generated or paraphrased policy answer
<Text>{summarize(policy.text)}</Text>

// GOOD: exact policy text with its source
<Text>{policy.text}</Text>
<Text>Source: {policy.title}</Text>
```

**Omit** from the report:

- **Precedent**: the project already uses the same approach elsewhere.
- **Scaffold stage**: thin hooks, placeholder screens, and minimal wiring during incremental plan delivery.
- **Speculation**: "if future requirements add X, this will need rewriting."

## Testing

Applies only when `package.json` defines a test runner; follow whatever the project uses.

- A bug fix includes a test that would have caught the bug.
- Tests assert what the guest sees or what a function returns, not internal calls (`expect(setState).toHaveBeenCalled()` breaks on refactor).
- Mocks include failure and empty responses, not only the happy path.
- Deleted or skipped tests come with a reason.
