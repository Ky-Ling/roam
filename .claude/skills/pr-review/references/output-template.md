# Output Template

## Writing discipline

The reader should grasp each issue's severity in seconds, without opening the code.

| Rule | Description |
| --- | --- |
| **Title = conclusion** | The title is a complete conclusion sentence; priority is decidable from the title alone. |
| **Outcome only** | State what is wrong, why it matters, and how to fix it. Investigation steps stay internal. |
| **Decisive tone** | If it is an issue, state it plainly. If it is justified, omit it. |
| **Symptom first** | Lead with what the guest or the business sees, then one sentence of technical cause. |
| **Combine similar issues** | Same pattern in several files → one issue with several locations. |
| **Future pain** | When nothing is visible today, the Phenomenon is the maintenance cost, in one sentence. |
| **Tiered fix** | When a small and a deeper fix both work, give `A (recommended):` / `B:`, one line each. |
| **Counter** | Add one `**Counter**:` line only when you can predict the author's specific objection. |
| **Blank line between fields** | Separate every `**Field**:` line with a blank line; Markdown otherwise folds them into one paragraph. |

## Report skeleton

```markdown
## PR Review Report

This PR does two things:

- (A) ...
- (B) ...

### 🔴 CRITICAL (n) — Must fix

### 🟡 WARNING (n) — Recommended before merge

### 🟢 INFO (n) — Optional

### ✅ Passed checks

### 🔧 Next steps
```

Leave out a severity section that has no issues. Passed checks always lists the lint and typecheck results.

## Single issue (fixed order)

```markdown
### {index}. {one-sentence conclusion}

📍 `path/to/file.tsx:123`

**Code**: {optional, one line, root-cause hint}

**Phenomenon**: {symptom first, then mechanism; or the future maintenance cost}

**Recommendation**: {one sentence; or `A (recommended):` / `B:` on two lines}

**Counter**: {optional, one line}
```

Locations are plain `path:line` (clickable in Claude Code). Several locations: `a.tsx:12` | `b.tsx:40`.

Include **Code** only when location + phenomenon still leave the root cause unclear (e.g. a shared default changed and the blast radius isn't obvious). Skip it when the phenomenon is self-explanatory.

## Full example

```markdown
## PR Review Report

This PR does two things:

- (A) Adds the stay search API route that turns a guest's sentence into a GROQ query.
- (B) Adds the results screen that lists ranked stays.

### 🔴 CRITICAL (1) — Must fix

### 1. The search route runs queries for signed-out callers

📍 `src/app/api/search+api.ts:8`

**Phenomenon**: Anyone with the URL can query Roam's content and spend the TypeSafe quota without signing in.

**Recommendation**: Verify the Clerk session at the top of `POST` and return 401 before any other work.

### 🟡 WARNING (2) — Recommended before merge

### 2. The results screen shows a blank page when no stays match

📍 `src/app/results.tsx:34`

**Phenomenon**: A guest whose search has no matches sees an empty screen with no explanation.

**Recommendation**: Render an empty state with a prompt to broaden the search, as `.claude/CLAUDE.md` Checks require.

### 3. Card spacing and colors are hardcoded instead of tokens

📍 `src/components/stay-card.tsx:22` | `src/components/stay-card.tsx:41`

**Phenomenon**: The next theme change has to hunt down literal values, and the card already drifts from the design.

**Recommendation**: Replace the literals with `spacing` / `colors` tokens; propose a new token for any value without one.

### 🟢 INFO (1) — Optional

### 4. `isEmpty` is stored in state and synced by an effect

📍 `src/app/results.tsx:15`

**Phenomenon**: An extra sync layer adds a render and a place for bugs without changing behavior.

**Recommendation**: Derive it during render: `const isEmpty = stays.length === 0`.

### ✅ Passed checks

- `npx expo lint` and `npx tsc --noEmit` pass.
- GROQ values are passed as params; price and guest count are parsed in code.
- No secrets behind `EXPO_PUBLIC_` or imported outside `src/app/api/`.
- No test runner in `package.json`; no tests expected.

### 🔧 Next steps

Choose in the question panel: fix CRITICAL only / CRITICAL + WARNING / all / pick issue numbers.
```
