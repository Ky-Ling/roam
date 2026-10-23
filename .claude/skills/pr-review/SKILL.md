---
name: pr-review
description: >-
  Review a PR, branch diff, or uncommitted changes in Roam for correctness,
  project-rule compliance, regressions, security, simplicity, and tests.
  Use when the user asks to review a PR or check changes before merge.
compatibility: Requires git CLI. Works best with gh CLI for GitHub PRs.
---

# PR Review

Review the change as a senior engineer on Roam (Expo / React Native, Expo Router, Clerk, Sanity, Jev). The review is **read-only**: report findings, change nothing (no file edits, no add/commit/push), and wait for the user to choose what to fix.

## Step 1: Get the diff

Base is `origin/master` unless the user names another branch or a PR number.

```bash
git fetch origin master
git diff origin/master...HEAD --stat
git diff origin/master...HEAD
```

PR number: `gh pr diff <number> --repo Ky-Ling/roam` and `gh pr view <number> --repo Ky-Ling/roam`.

If the branch diff is empty, review uncommitted work instead: `git diff HEAD` plus the contents of each file from `git ls-files --others --exclude-standard`, and tell the user "No committed diff against master; reviewing uncommitted changes." If that is empty too, say there is nothing to review and stop.

Done when you have every changed file and have read each one in full, not just its hunks.

## Step 2: Load the project rules

Read these; they are the source of truth for the Convention dimension:

- `.claude/CLAUDE.md`: architecture ("Who owns what"), Rules, Checks, Building from designs.
- `AGENTS.md`: Expo workflow rules.
- `prompts/NN-*.md`: if the PR implements a plan, the plan it implements; the diff is checked against its scope and Verification.
- `.claude/skills/*/SKILL.md`: any skill whose area the diff touches (e.g. `expo-router` for routes/layouts, `expo-data-fetching` for network code, `expo-design-system` for tokens/components, `submit-pr` for branch and commit format).
- `package.json`, `tsconfig.json`, `eslint.config.js`, `app.json`: when the diff touches config, dependencies, or native behavior.

Run the project checks and record the results for the report:

```bash
npx expo lint
npx tsc --noEmit
```

Done when every rule in `.claude/CLAUDE.md` Rules and Checks has been held against the diff.

## Step 3: Review

Hold the diff against each dimension. They are an internal matrix; issue titles state conclusions, not dimension names.

| Dimension | Question |
| --- | --- |
| **Convention** | Does the diff follow every applicable rule from Step 2? |
| **Logic** | Is it correct in every scenario: edge cases, null/empty input, race conditions, state transitions? |
| **Impact** | Does it break callers or change user-visible behavior outside the PR's stated scope? |
| **Over-engineering** | Is there an abstraction, option, or layer that can go without losing behavior? |
| **Simplicity** | Is this the smallest clear implementation? |
| **Robustness** | Does it fail gracefully: network/API errors, unmount during async work, missing data? |
| **Consistency** | Do naming and patterns match the PR's own code and the surrounding files? |
| **Architecture** | Does it keep each responsibility with the tool that owns it (`.claude/CLAUDE.md` "Who owns what")? |
| **Security** | Can secrets, tokens, or guest data leak, or untrusted input reach a query or sink? |
| **Testing** | Is new logic covered by tests where the project has a test runner, and do bug fixes add a regression test? |

### Roam-specific checks

These are the rules most likely to be broken; each is a finding when violated.

- **Secrets**: Clerk secret key, TypeSafe key, Sanity tokens live only in `src/app/api/**` and local scripts. Any secret behind `EXPO_PUBLIC_`, imported into a screen/component, logged, or returned in an error response is CRITICAL. `.env` is never committed; new variable names go in `.env.example`.
- **API routes** (`src/app/api/*+api.ts`): verify the Clerk session before any work; validate the request body; return generic errors to the client.
- **GROQ**: values are always passed as params, never interpolated into the query string. Hard constraints (price, guests, type, amenities, pets, place) are filters; embeddings only rank.
- **Jev**: answers typed questions only. It never writes GROQ, calls tools, generates text, or produces prices, guest counts, or dates; code parses those.
- **Answers**: policy and stay answers show source text word for word with its source. No LLM-generated answer text in the app. No match → say so and point to support.
- **PostHog**: failures never block the app; events never carry what guests type, tokens, or personal data.
- **Sanity**: Sanity generates document IDs; relationships are references; schema changes note the Studio redeploy.
- **Dependencies**: added with `npx expo install`; prefer Expo modules; a new native module means a new development build (call it out); `ai` and `@ai-sdk/typesafe-ai` pinned to exact versions.
- **Native config**: no hand edits to `ios/` or `android/`; native behavior goes through `app.json` / config plugins.
- **Screens**: data-loading screens handle loading, error, and empty states; colors, spacing, type, and radii come from design-system tokens; layout respects safe areas.
- **Routing**: files in `src/app/` are routes only; components, hooks, and utils live outside it.

### Impact procedure

When the diff deletes or renames an export, changes a signature, a shared type, a shared hook/util's behavior, or an API route's request/response shape, find every reference (prefer `codegraph_callers` / `codegraph_impact`; grep for literal strings) and confirm each still works. Also check for unintended user-visible changes: changed defaults, sort/filter order, timing (debounce, animation), copy, and platform-specific files (`*.ios.tsx`, `*.android.tsx`, `*.web.tsx`) that diverge from their siblings.

### Filters before reporting

- **Precedent**: if the project already does the same thing elsewhere, it is not an architecture or consistency issue.
- **Present risk only**: drop concerns that start with "if requirements change later".
- **Justified divergence**: if the shared pattern genuinely doesn't cover the case, drop it.
- **Scaffold stage**: thin placeholders and minimal wiring during incremental plan delivery are expected.
- **Tests**: omit the Testing dimension for docs/config/style-only changes, and when `package.json` has no test runner, mention the gap once under Passed checks rather than per file.

Anti-pattern examples for each dimension: [references/review-guide.md](references/review-guide.md).

Done when every changed file has been checked against every dimension and every Roam-specific check that applies to it.

## Step 4: Report

Write the report using [references/output-template.md](references/output-template.md). Severity:

- **CRITICAL**: must fix: bugs, logic errors, any security issue, broken Roam rule on secrets/auth/answers.
- **WARNING**: fix before merge: convention violations, regressions, avoidable complexity.
- **INFO**: optional: minor simplifications and style.

Also check the PR itself (when reviewing a branch or PR): Conventional Commits title and messages, `niko/<type>/<description>` branch name, a single purpose with no unrelated changes or leftover debug code, and screenshots for UI changes.

## Step 5: Ask what to fix

Ask through the question panel (AskUserQuestion), recommended option first: fix CRITICAL only / fix CRITICAL + WARNING / fix all / pick issue numbers. Make no changes until the user answers.
