# Solo Web Dev Workflow: Figma → TanStack Start → Hosting (South Africa)

  

A repeatable, documentable pipeline for taking a client site from brief to live domain.

Companion to `scaffold.md`, which is the exact routine to run in Phase 4.

  

---

  

## Phase 0 — Reusable assets (build once, reuse every project)

  

These are what make the process repeatable instead of ad hoc. Set them up once, then

every project starts from them instead of from scratch.

  

1. **Figma team library** — a single "Design System" Figma file with:

   - Color styles matching the token names you'll use in `abstracts/_variables.scss`

     (e.g. `color-primary`, `color-bg`, `color-text`)

   - Type styles matching your typographic scale

   - Spacing/breakpoint variables (Figma variables, not just styles)

   - A base component set: buttons, cards, nav, forms, alerts — named to mirror the

     7-1 `components/` partial names (`_buttons.scss`, `_cards.scss`, etc.)

2. **Project template repo** containing:

   - This skill (or a link to it) — always run `scaffold.md` clean, no project-specific

     state left in it

   - `AGENTS.md` template (empty sections matching the headings in `scaffold.md`)

   - `CLIENT-HANDOVER.md` template

   - A `.env.example` and a domain/hosting checklist (Phase 6)

3. **Client intake form** — a short questionnaire (Google Form, Notion, or plain

   markdown) covering: business name, target domain, existing domain/hosting if any,

   number of pages, content readiness, brand assets, launch date.

  

Update these three assets whenever a project teaches you something new — that feedback

loop is what keeps the process improving instead of drifting project to project.

  

### Design inspiration resources (bookmark once, reuse every project)

  

Two separate habits, not one folder — use each for what it's actually good at:

  

**Real UI patterns (how to structure a component/flow)**

- [Mobbin](https://mobbin.com) — real screens from production apps (Airbnb, Uber,

  Dropbox, Notion), broken down by flow (onboarding, checkout, settings). The single

  most useful reference for "how do I actually build this."

- [Land-book](https://land-book.com) — curated SaaS/startup landing pages, filterable

  by section (pricing block, feature comparison, hero, etc.)

- [Lapa Ninja](https://www.lapa.ninja) / [One Page Love](https://onepagelove.com) —

  landing-page and single-page reference, useful for client sites shipped one page

  at a time

  

**Reusable component libraries (inspiration you can ship directly)**

- [shadcn/ui](https://ui.shadcn.com) — accessible, unstyled-by-default components,

  fast to restyle with the 7-1 SCSS tokens. Pairs naturally with TanStack Start's

  React components.

- [Magic UI](https://magicui.design) — animated/marketing-site components

  

**Visual/creative direction (what it should feel like)**

- [Awwwards](https://www.awwwards.com) — panel-judged, cutting-edge visual craft;

  strong for creative direction, weaker for UX reference (often prioritizes visual

  spectacle over usability)

- [Godly](https://godly.website) / [CSS Design Awards](https://www.cssdesignawards.com)

  — same tier as Awwwards

- [Dribbble](https://dribbble.com) / [Behance](https://www.behance.net) — broad mood-

  board sources; treat shots as mood pieces, not finished UX

  

Workflow tip: pull structure/pattern references before Phase 2 wireframing (Mobbin,

Land-book), and visual/mood references during hi-fi design (Awwwards, Dribbble) —

mixing the two too early tends to pull layouts toward "looks impressive" before

"works well" is settled.

  

---

  

## Phase 1 — Discovery & scoping

  

- Fill in the client intake form.

- Draft a one-page **sitemap** (list of routes, not wireframes yet).

- Check domain availability:

  - `.co.za` → **domains.co.za** (ZADNA-regulated; typically cheaper, local support,

    faster local DNS propagation)

  - `.com` / international TLDs → **GoDaddy** (broader TLD selection, useful if the

    client wants a global brand presence)

- Decide the hosting model early, since it affects both the domain choice and the

  TanStack Start build target (Phase 4/`scaffold.md`). Unlike a purely static

  generator, TanStack Start is **SSR by default** — static output only happens if

  prerendering is explicitly enabled for every route. Confirm the model before design

  starts:

  - **Static hosting** (Netlify, Cloudflare Pages, Vercel, or cPanel shared hosting)

    + domain pointed via DNS — requires the project's `vite.config.ts` to have

    `prerender.enabled: true` and every route to be prerenderable (no server-only

    logic that can't be expressed as a static server function). This is the default

    assumption for this workflow — see Phases 4/6.

  - **Node/SSR hosting** (a host that runs a persistent Node process, or a platform

    with native TanStack Start / Nitro support) — needed if the site has genuinely

    dynamic, per-request server logic (auth, live data, personalization) that can't

    be prerendered. This changes Phase 6/7 significantly (no plain cPanel upload) —

    flag this at scoping time, not at deploy time.

  - **Traditional shared hosting** (cPanel via domains.co.za or GoDaddy) — only

    viable with prerendering enabled; treat the build output as a static site once

    it's on disk (same deploy mechanics as any static export).

- Output: a short scope document (1 page) the client signs off on before design starts,

  including which hosting model was chosen and why.

  

---

  

## Phase 2 — Design in Figma

  

- Wireframes (low-fi) → review → mid-fi layout → hi-fi visual design.

- Build every screen from the Phase 0 component library — don't create one-off

  components inside a client file unless the pattern is genuinely unique to that project.

  If it is unique, promote it back into the shared library afterward if it's reusable.

- Confirm responsive behavior at your three core breakpoints (should match

  `abstracts/_variables.scss` breakpoint values exactly).

- Client sign-off checkpoint before moving to development — this is the single most

  effective place to prevent expensive rework later.

  

---

  

## Phase 3 — Design → dev handoff

  

- Use Figma's **Dev Mode** to inspect exact values (spacing, color hex, font sizes).

- Transcribe tokens into `abstracts/_variables.scss` as `!default` values — this is the

  one place Figma values get hand-copied; everything downstream references the variable,

  never a raw hex/px value again.

- Build a simple mapping table (component name in Figma → SCSS partial → route

  component) so nothing gets lost:

  

  | Figma component | SCSS partial | TanStack Start component |

  |---|---|---|

  | Primary button | `components/_buttons.scss` | `src/components/Button.tsx` |

  | Nav bar | `layout/_header.scss` | `src/components/Header.tsx` |

  

- Export any raster/vector assets (logo, icons, images) into `public/`, and confirm

  the brand font file(s) and their license from the client or the Figma library —

  these get self-hosted from `public/fonts/` in Phase 4 rather than pulled from a

  font CDN (see `scaffold.md`'s "Embed fonts" step).

  

---

  

## Phase 4 — Development (TanStack Start)

  

Run `scaffold.md` verbatim in a fresh, empty project directory — it should produce an

identical clean starting point every time, with no leftover state or completion notes

carried over from a previous run. It handles, in order:

  

1. Scaffolding with the TanStack CLI, keeping only `src/routes/index.tsx`

2. Checking for / removing Tailwind if a starter template included it

3. Setting up the Sass 7-1 architecture with index-based imports only

4. Wiring `styles.scss` through the single shared root route (`src/routes/__root.tsx`)

5. Adding a default 404 via the root route's `notFoundComponent`

6. Enabling static prerendering in `vite.config.ts` (only if the hosting model chosen

   in Phase 1 is static — skip and note in `AGENTS.md` if this project needs SSR)

7. Writing `AGENTS.md` with the technical decisions made

8. Verifying with `npm run dev` and `npm run build`

  

Once scaffolding is done:

  

- Populate the SCSS partials using the tokens and component map from Phase 3.

- Build each page from the Phase 1 sitemap as a new file under `src/routes/`, routed

  through the shared root route.

- Keep content (copy, images) in a format the client can review before launch —

  a shared doc or CMS export, not just hardcoded in markup, if the client will want to

  edit it later.

- As new routes are added, re-check the prerender config (`scaffold.md`, step 6) —

  routes added after scaffolding aren't automatically covered unless `crawlLinks`

  picks them up from an internal link, or they're added explicitly to the

  `prerender.routes` list.

  

---

  

## Phase 5 — QA & testing

  

- Compare every breakpoint against the Figma frames.

- Run Lighthouse (performance, accessibility, SEO, best practices) — fix anything below

  ~90 before launch where reasonably possible.

- Cross-browser check (at minimum: Chrome, Safari, Firefox, and mobile Safari/Chrome).

- Run `npm run build`, not just `npm run dev` — some bundler/plugin issues only appear

  at build time. If this is a static-hosted project, this is also where you confirm

  prerendering actually produced a static HTML file for **every** route, including the

  404 page — a route quietly falling back to client-side-only rendering is easy to miss

  until it's live on a host with no Node runtime.

- Check all forms, links, and any third-party embeds (maps, booking widgets) actually

  work against production-like output (`npm run start` / `npm run preview`, whichever

  the scaffolded `package.json` defines).

  

---

  

## Phase 6 — Domain & hosting setup

  

Checklist to run once the domain/registrar decision from Phase 1 is confirmed:

  

- [ ] Domain registered (domains.co.za for `.co.za`, GoDaddy for other TLDs)

- [ ] WHOIS/registrant contact details set correctly (client's business, not yours,

      unless you've agreed to manage it long-term)

- [ ] Nameservers pointed at the hosting target:

  - Static host (prerendered build): point NS or A/CNAME records at the platform's

    provided values (e.g. Netlify/Cloudflare Pages DNS instructions), or at the

    shared-hosting IP if using cPanel

  - SSR/Node host: point at whatever the platform's SSR-capable deployment target

    requires — confirm the platform actually supports TanStack Start's server

    runtime (Nitro-based) before committing to it

- [ ] SSL certificate active (automatic on Netlify/Cloudflare Pages/Vercel; via

      AutoSSL/Let's Encrypt on cPanel hosts)

- [ ] MX records configured if the client wants email on the domain (note: email hosting

      is often a separate product/add-on from web hosting on both domains.co.za and

      GoDaddy — confirm before assuming it's included)

- [ ] Renewal dates for domain and hosting logged somewhere with a reminder (see

      Phase 9) — the most common way a solo dev workflow breaks down is a lapsed

      renewal nobody caught

  

---

  

## Phase 7 — Deploy

  

- Static host (prerendered build): connect the repo (or build locally), set the build

  command (`npm run build`) and output directory. **Confirm the exact static output

  folder from your own build log and record it in `AGENTS.md`** — TanStack Start's

  prerendered output location can differ by version/config, so don't assume a folder

  name without checking. Trigger a deploy, confirm the custom domain resolves over HTTPS.

- Traditional cPanel host (prerendered build only): build locally (`npm run build`),

  upload the contents of the confirmed static output folder via SFTP/File Manager to

  the correct web root. Do not attempt this for an SSR/Node-target project without a

  Node-capable host — a plain cPanel shared account will not run the server process.

- Post-deploy smoke test: load every page on the live domain, check console for errors,

  confirm the 404 page renders for a bad URL, re-run Lighthouse against the live URL

  (results can differ from local preview).

  

---

  

## Phase 8 — Documentation & handover

  

Two documents, two audiences:

  

- **`AGENTS.md`** (technical, from `scaffold.md` step 7) — CLI command used, Tailwind

  removal notes if applicable, the index-based SCSS import convention, the dark-theme

  configuration caveat, which route the stylesheet is wired into, the

  `notFoundComponent` implementation, whether prerendering is enabled and the exact

  static output folder, env vars, deployment notes, known gotchas.

- **`CLIENT-HANDOVER.md`** (non-technical, for the client) — login details for

  domain/hosting accounts, how to request content changes, renewal dates and costs,

  who to contact for what.

  

Archive the Figma file link and the repo link in both documents so anyone (including

future-you) can trace design back to code back to hosting.

  

---

  

## Phase 9 — Maintenance & repeat

  

- Set calendar reminders ahead of domain and hosting renewal dates (both domains.co.za

  and GoDaddy will email renewal notices, but a personal reminder catches the case where

  a client's payment method on file has expired).

- After each project, fold anything you'd do differently back into the Phase 0 assets

  (Figma library, project template, `AGENTS.md` template, `scaffold.md`) — this is what

  keeps the process actually repeatable rather than each project drifting further from

  the last. If a project needed an SSR host instead of static, note what triggered that

  so future scoping calls (Phase 1) catch it earlier.

  

---

  

## Quick-reference checklist

  

- [ ] Client intake form completed

- [ ] Sitemap drafted and approved

- [ ] Domain availability checked (domains.co.za / GoDaddy)

- [ ] Hosting model decided (static/prerendered vs SSR/Node vs traditional cPanel)

- [ ] Figma design built from shared component library, signed off

- [ ] Tokens transcribed into `abstracts/_variables.scss`

- [ ] TanStack Start scaffolded via `scaffold.md`, only `index.tsx` + default 404

      present at scaffold time

- [ ] Routes built, routed through single root route

- [ ] Prerendering enabled and verified to cover every route (if static hosting)

- [ ] `npm run build` passes clean

- [ ] Lighthouse pass on staging

- [ ] Domain registered, DNS pointed, SSL active

- [ ] Deployed and smoke-tested on live domain, including the 404 page

- [ ] `AGENTS.md` and `CLIENT-HANDOVER.md` written

- [ ] Renewal reminders set