# Roam

A rental app built with Expo. Guests describe a stay in one sentence, like *"quiet pet friendly cabin with a hot tub under $300 a night"*, and get ranked stays back. They can then ask booking and policy questions about a stay. Every answer quotes Roam's own content word for word, with its source.

## What's in the app

- **Onboarding and auth.** Custom sign-up, sign-in and email verification screens backed by Clerk, plus Google sign-in.
- **Home.** Featured stays and categories, read live from Sanity.
- **Search.** One sentence in, ranked stays out. Exact constraints (price, guests, bedrooms, type, amenities, pets, place) are parsed in code and sent as GROQ filters. Softer words (quiet, cozy) rank results.
- **Stay details.** Photo gallery, highlights, cancellation policy, host, and the nightly price with a minimum-stay total.
- **Ask about this stay.** A chat where each reply is one answer card per topic (check-in, cancellation, pets, house rules, payment, safety, …). Each card quotes the stay's data or Roam's policies with a source label. Topic chips send a question in one tap. Answers come from a local matcher for now (`src/lib/ask`); a backend will replace it later.
- **Policy and host sheets.** All house rules and policies, the cancellation policy as a refund timeline, and the host's profile, bio and other stays.
- **Analytics.** Explicit PostHog events only. No autocapture, and nothing a guest types is ever sent.

Trips and Profile are placeholders, and booking shows "coming soon".

## Stack

| Area | Tool |
|---|---|
| App | Expo SDK 57, React Native, Expo Router (file-based routes, native tabs, form sheets) |
| Styling | NativeWind v5 (Tailwind CSS v4). Design tokens live in `global.css` |
| Auth | Clerk (`@clerk/expo`) |
| Content | Sanity: project `vjn3nb8q`, dataset `roam-dataset`. The Studio is in `studio/` |
| Analytics | PostHog |
| Motion | Reanimated |

## Getting started

### 1. Install

```bash
npm install
```

When you add a package, use `npx expo install <package>` so you get a version that works with SDK 57.

### 2. Environment

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | What it is |
|---|---|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (public) |
| `CLERK_SECRET_KEY` | Clerk secret key. Only for API routes and local scripts |
| `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` | PostHog project token (public) |
| `EXPO_PUBLIC_POSTHOG_HOST` | PostHog host |

Anything prefixed `EXPO_PUBLIC_` is bundled into the app, so never put a secret behind it. Never commit `.env` or `.env.local`.

Sanity content is read from the public CDN, so the app needs no Sanity token.

### 3. Run

```bash
npx expo start      # then press i (iOS), a (Android) or w (web)
```

The app runs in Expo Go, on iOS, Android and web. Deep links use the `roam://` scheme, e.g. `roam://stay/lakeside-boathouse`.

**Signing in during development:** use an email containing `+clerk_test` (e.g. `you+clerk_test@example.com`), with verification code `424242`.

## Sanity Studio

The Studio is a standalone app in `studio/`, hosted at `roam-vjn3nb8q`.

```bash
cd studio
npm install
npm run dev                  # Studio on localhost:3333
npm run seed                 # upsert seed/data by slug (safe to rerun, never deletes)
npm run copy                 # write stay summaries/descriptions with Agent Actions, as drafts
npx sanity schema deploy     # after schema changes
npx sanity deploy            # redeploy the hosted Studio
```

`seed` and `copy` take `-- --dry-run` to preview. `copy` also takes `--slug <slug>`.

## Project layout

```
src/
  app/          routes only: (auth), (tabs), stay/[slug]/{index,ask,policies,host}
  screens/      one folder per screen: index.tsx + use-<name>.ts orchestrator + components/
  components/   ui/ primitives (design system), shared feature components, app navigator
  hooks/        app-wide hooks
  lib/          sanity client and queries, search parsing, ask matcher, posthog, utils
  constants/    shared constants (amenities, motion)
  theme/        colors for props that can't take a className
studio/         Sanity Studio: schema, seed data, copy generation
prompts/        feature plans (NN-feature-name.md), one per feature, as history
```

Preview every design-system primitive at `/design-system` (dev only).

## Checks

```bash
npx expo lint        # lint, including the project's code-structure rules
npx tsc --noEmit     # type check
npx expo-doctor      # dependency and config health
```

Both lint and type check must pass before a change is done.

## Working on Roam

`.claude/CLAUDE.md` is the project's memory. It covers which tool owns what (Clerk, Sanity, PostHog), the code-structure rules (no semicolons, page orchestrator hooks, one component per file, es-toolkit through `@/lib/utils`), and how features are built: understand → ask → plan in `prompts/` → approve → build → verify. Read it before changing anything substantial.

## License

[MIT](LICENSE)
