---
name: tanstack-scss-scaffold
description: Solo web dev workflow for taking a client site from Figma brief to a live domain on a TanStack Start + SCSS 7-1 stack, with South Africa-specific domain/hosting steps (domains.co.za, GoDaddy, cPanel). Use this whenever the user wants to scaffold a new TanStack Start client project, asks to follow "the workflow" or "the scaffold prompt" for a client site, needs the Figma-to-dev handoff process, or is planning domain registration, DNS, or cPanel deployment for a small business/client website. Trigger even if they just say "start a new client site" or "scaffold a new project" without naming TanStack Start explicitly, if the context is a solo freelance/agency web build.
---

# Solo Web Dev Workflow (TanStack Start)

A repeatable pipeline for taking a client site from brief to live domain, built around
TanStack Start + Sass 7-1. Two reference files hold the actual content — read whichever
one matches what the user is asking for. Don't load both unless the task genuinely
spans planning and building.

## When to read which file

- **`references/workflow.md`** — the end-to-end process: discovery, Figma design,
  design-to-dev handoff, QA, domain/hosting decisions, deployment, documentation,
  and maintenance (Phases 0–9). Read this when the user is scoping a project, asking
  "what's next" at some stage of a client build, or wants domain/hosting/deployment
  guidance for South Africa (domains.co.za vs GoDaddy, cPanel, static vs SSR hosting).
- **`references/scaffold.md`** — the literal step-by-step scaffold routine and the
  `TODO.org` generator. Read this when the user asks to scaffold, initialize, or set
  up a new TanStack Start project, or says something like "run the scaffold" / "start
  a new client site."

## Core things to hold in mind regardless of which file you read

- **TanStack Start is SSR by default.** Static hosting (cPanel, Netlify static, etc.)
  only works if prerendering is explicitly enabled in `vite.config.ts` and every route
  is actually prerenderable. Don't assume a static deploy will work without checking
  this — it's the single biggest way this stack differs from a plain static-site
  generator.
- **Every scaffold run should be clean.** `references/scaffold.md` must never
  accumulate a completion log or project-specific notes across runs — that
  information belongs in the generated `AGENTS.md`, not in the skill itself. If you
  notice yourself wanting to record "what happened last time" anywhere other than
  `AGENTS.md`, stop and put it there instead.
- **One route at scaffold time.** A fresh scaffold should end with exactly
  `src/routes/index.tsx` plus the default not-found route — no leftover demo routes,
  no dead nav links pointing at deleted pages.
- **Confirm the static output folder from the actual build log**, not from memory —
  it can differ by TanStack Start version/config, and hardcoding it wrongly breaks the
  deployment steps later.

## Working with the user

- If they're at the very start of a project, orient them in `workflow.md`'s phase
  list first, then move to `scaffold.md` when they're ready to actually run Phase 4.
- If they just want the project scaffolded, go straight to `scaffold.md` — don't make
  them sit through the whole workflow explanation first.
- When generating `AGENTS.md`, `CLIENT-HANDOVER.md`, or `TODO.org`, follow the exact
  structures described in the reference files rather than improvising a different
  format — the whole point of this skill is consistency project to project.
