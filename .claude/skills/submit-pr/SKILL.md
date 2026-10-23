---
name: submit-pr
description: Commit, sync with master, push, and write the English commit message, PR title, and PR description for the current branch. Use when the user asks to write a commit message or PR text, or to submit / create a PR.
---

# Submit PR

- Repo: `Ky-Ling/roam` (`https://github.com/Ky-Ling/roam.git`). Pass `--repo Ky-Ling/roam` to every `gh` call.
- `BASE` is `master`, the repo's default branch. Every fetch, merge, diff, and PR targets `origin/master`.
- Branch names: `niko/<type>/<short-description>`, e.g. `niko/feat/trip-list-screen`.
- Expo app on npm (`package-lock.json`). App code is under `src/` (`src/app` routes, `src/app/api/*+api.ts` API routes); Sanity Studio is in `studio/`; feature plans are in `prompts/`.

## Step 1: Gather context

Run in parallel:

```bash
git branch --show-current
git status --short
git diff HEAD --stat
git log origin/master..HEAD --oneline
```

Done when you know the current branch, the uncommitted changes, and the unpushed commits.

## Step 2: Branch off master

If the current branch is `master`, move the work onto a feature branch (uncommitted changes and local commits come along):

```bash
git checkout -b niko/<type>/<short-description>
```

Infer `<type>` and `<short-description>` from the changes. Done when the current branch is a `niko/...` branch.

## Step 3: Verify

```bash
npx expo lint
npx tsc --noEmit
```

Both must pass. On failure, report the errors and stop; the user decides whether to fix or proceed.

## Step 4: Commit

If `git status --short` is non-empty:

1. Read the changes (`git diff HEAD`, plus the contents of untracked files).
2. Write the commit message (format below).
3. Stage by explicit path. `.gitignore` already covers `node_modules/`, `.expo/`, `/ios`, `/android`, and `.env*.local`; stage `.claude/` and `prompts/`. `.env` never gets committed (only `.env.example`, names without values). List any file that looks like a secret or build output to the user and leave it unstaged.
4. `git commit -m "<message>"`.

Done when `git status --short` is empty or shows only files you deliberately left out.

### Commit message format

Conventional Commits. `scope` is the most-changed area (`app`, `api`, `components`, `hooks`, `constants`, `assets`, `studio`, `prompts`, `config`, `claude`); omit it when changes span several.

```
type(scope): concise summary

- Key change 1
- Key change 2
```

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `perf`, `test`, `ci`, `build`.

## Step 5: Sync and push

```bash
git fetch origin master
git merge origin/master
```

On `CONFLICT`: run `git merge --abort`, list the conflicting files, and stop until the user resolves them.

On success:

```bash
git push -u origin HEAD
```

On push failure, report the error and stop. Done when `git log origin/<branch>..HEAD` is empty.

## Step 6: Write the PR text

Read the whole branch against master:

```bash
git log origin/master..HEAD --format="%s%n%b"
git diff origin/master...HEAD --stat
git diff origin/master...HEAD
```

Every commit on the branch is reflected in the description, not just the latest.

**PR title**: `type(scope): concise summary of the branch`, same rules as the commit message.

**PR description**:

```markdown
## Summary

1–2 sentence overview.

### New Features

- Change description

### Bug Fixes

- Change description

---

## Review Focus

- Lint and typecheck pass (`npx expo lint`, `npx tsc --noEmit`).
- Secret keys stay in API routes and local scripts; no new `EXPO_PUBLIC_` variable holds a secret.
- <Risks specific to this diff, e.g. API routes that must verify the Clerk session, Sanity schema changes that need a Studio redeploy, `app.json` or native dependency changes that need a new development build, platform files (`*.web.tsx`, `*.ios.tsx`).>
```

Use only the categories that apply (New Features, Improvements, Bug Fixes, Refactoring, Docs, Tests, Chores).

## Step 7: Output and ask

Show the commit message (if Step 4 made one), PR title, and PR description, each in its own fenced code block. Then ask how to proceed through the question panel (AskUserQuestion), recommended option first:

- **Auto-create PR**: run `gh pr create` (below) and return the PR URL.
- **Output gh command**: print the command below, filled in.
- **Just the text**: done.

### Creating the PR

Write the description to a temp file in the scratchpad, then:

```bash
gh pr create --repo Ky-Ling/roam --base master --head <branch> --title "<PR title>" --body-file <path-to-body.md>
```

If a PR for the branch already exists, `gh` says so: report its URL instead.

### Fallback

If push, `gh`, or auth fails, give the user:

1. The failure reason, in one short paragraph.
2. The compare link: `https://github.com/Ky-Ling/roam/compare/master...<branch>?expand=1`
3. The PR title and description in fenced blocks.
