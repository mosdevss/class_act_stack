# Scaffold: TanStack Start (Minimal, Static-Prerendered) + SCSS 7-1 + TODO.org

Run this in a fresh, empty project directory using your file and bash tools. This must
produce an identical, clean starting point every time — do not leave completion logs,
project-specific notes, or leftover state inside this file itself; put all of that in
the generated `AGENTS.md` instead.

## Primary directives

1. Execute the scaffold routine below exactly, writing all files to disk.
2. Generate a `TODO.org` file in the project root with granular checkboxes covering
   the entire rest of the project lifecycle (design, component building, testing,
   SA-specific deployment).

---

## 1. Initialize TanStack Start (Minimal)

- Run: `npx @tanstack/cli@latest create . --agent -y` (or the current non-interactive
  equivalent — check `--help` if the flag has changed).
- If the CLI generates the source folder as `app/` instead of `src/`, move all
  contents from `app/` to `src/` and update imports accordingly.
- **Remove every route file except `src/routes/index.tsx`** — delete any generated
  `about.tsx`, `contact.tsx`, `blog.tsx`, demo routes, etc. The scaffolded project must
  end this step with exactly one route: the index page.
- Remove any nav links or references in `__root.tsx` / layout components that point at
  the routes you just deleted, so nothing 404s against a link that no longer exists.
- Ensure `package.json` includes `"type": "module"` and the necessary dependencies
  (`@tanstack/react-start`, `@tanstack/react-router`, `react`, `react-dom`, `vite`, etc.).

## 2. Tailwind check & removal

- Inspect `package.json` and `vite.config.ts`. If `@tailwindcss/vite` or `tailwindcss`
  exists, remove them entirely:
  - Uninstall `@tailwindcss/vite`, `tailwindcss`, `autoprefixer`, and `postcss`.
  - Delete `tailwind.config.js` and `postcss.config.js` if present.
  - Remove the `tailwindcss()` plugin call from `vite.config.ts`.
  - Remove any `@import "tailwindcss";` from CSS files, and any Tailwind utility
    classes left in generated components (root layout body tag, NotFound component,
    etc.) — replace with plain elements for now; SCSS classes get wired in steps 3-4.
- If Tailwind is **not** found, skip to step 3 and note this in `AGENTS.md`.

## 3. Install Sass & create the 7-1 architecture

- Run: `npm install -D sass`
- Create the following directory structure inside `src/styles/`:
  `src/styles/{abstracts,vendors,base,layout,components,pages,themes}`
- **Index-based imports rule**: every folder must contain an `_index.scss` that
  `@forward`s every partial inside that folder. No file outside a folder may directly
  import a partial inside that folder (e.g., `layout/_header.scss` must never be
  referenced directly; always `layout/_index.scss`).
- File generation (create these with content):
  - **`abstracts/_variables.scss`**: Design Tokens (colors: `$color-primary-500:
#6366F1;`, spacing: `$spacing-md: 1rem;`, breakpoints: `$breakpoint-tablet: 768px;`,
    fonts).
  - **`abstracts/_mixins.scss`**: `respond-to($breakpoint)` and `flex-center`.
  - **`abstracts/_functions.scss`**: `rem($px)` and `em($px)` helpers.
  - **`abstracts/_placeholders.scss`**: `%card` and `%button-base`.
  - **`abstracts/_index.scss`**: Forward the four files above.
  - **`base/_reset.scss`**: A minimal CSS reset (or import a modern one).
  - **`base/_fonts.scss`**: `@font-face` declarations for every self-hosted font — see
    "Embed fonts" below before writing this file.
  - **`base/_index.scss`**: Forward `fonts`, `reset`, `typography`, `animations`
    (`fonts` first, since typography rules reference the font-family tokens it sets up;
    empty stubs are fine for `typography`/`animations` at scaffold time).
  - **`layout/_header.scss`, `_footer.scss`**: Placeholder classes.
  - **`layout/_index.scss`**: Forward all layout partials.
  - **`components/_buttons.scss`, `_cards.scss`, `_not-found.scss`**: Placeholder /
    BEM classes — `_not-found.scss` should style the default 404 page from step 5
    (`.not-found`, `.not-found__title`, `.not-found__message`, `.not-found__link`).
  - **`components/_index.scss`**: Forward all component partials.
  - **`pages/_home.scss`**: Placeholder.
  - **`pages/_index.scss`**: Forward home.
  - **`themes/_default.scss`**, **`themes/_light.scss`**, **`themes/_dark.scss`** (with
    the config caveat).
  - **`themes/_index.scss`**: Forward `default` and `light`. **Do not forward `dark`**
    — add a comment explaining that enabling it requires swapping configs to avoid the
    "module already loaded" error.
  - **`src/styles/styles.scss`**: The entry point. Must `@use` each folder's
    `_index.scss` in this order: `vendors`, `base`, `layout`, `components`, `pages`,
    `themes`.

### Embed fonts

Self-host fonts rather than pulling from Google Fonts or another CDN — it removes a
third-party render-blocking request, which matters for the Lighthouse pass in Phase 5
of `workflow.md`, and it means the site still works if the CDN has an outage.

- **Files go in `public/fonts/`, not `src/assets/`.** Anything in `public/` is served
  at a stable, predictable path (e.g. `/fonts/inter-variable.woff2`) and copied as-is
  into the static output during prerendering — no Vite asset-hashing to chase down
  later when you write the `<link rel="preload">` tag in step 4. Put font files under
  `src/assets/` only if the project has a reason to run them through Vite's asset
  pipeline; for fonts, the stable path is worth more than the hashing.
- **Prefer a variable font file** if the client's brand typeface has one (most modern
  type families do) — one `.woff2` file covers the whole weight range instead of a
  separate request per weight, which keeps the font budget small.
- **`.woff2` only, unless the client specifically needs older-browser support.** woff2
  has near-universal modern support and is meaningfully smaller than `.woff`/`.ttf`;
  don't ship a fallback format unless there's a stated reason to.
- Write the `@font-face` rules in `base/_fonts.scss`, referencing the public path
  directly and setting `font-display: swap` so text stays visible while the font
  loads instead of invisible (avoids a Lighthouse "invisible text" flag):
  ```scss
  @font-face {
    font-family: "Inter";
    src: url("/fonts/inter-variable.woff2") format("woff2-variations");
    font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }
  ```
  Adjust `font-weight` to a fixed value (not a range) and drop `-variations` from the
  format string if the client's font isn't a variable font.
- Add the resulting font-family name as a token in `abstracts/_variables.scss` (e.g.
  `$font-primary: 'Inter', sans-serif;`) — every other partial should reference this
  variable, never the raw font name, same rule as the color/spacing tokens.
- Note in `AGENTS.md`: which fonts are embedded, their license (self-hosting requires
  a license that permits it — most Google Fonts do, but confirm for anything sourced
  elsewhere), and the exact file(s) under `public/fonts/`.

## 4. Wire stylesheets to the root route

- Locate the root route file: `src/routes/__root.tsx`.
- At the top of the file, add `import '../styles/styles.scss';` (relative path may
  vary; adjust accordingly).
- Ensure the root route renders `<Outlet />` and includes standard `<html>`, `<head>`,
  `<body>` tags with a responsive viewport meta tag.
- **Preload the embedded fonts** so the browser fetches them immediately instead of
  discovering them only after CSS parses. Add a `<link rel="preload" as="font"
type="font/woff2" crossorigin>` for each font file actually used above the fold, via
  whatever head-management API the scaffolded TanStack Start version provides on the
  root route (commonly a `head: () => ({ links: [...] })` option paired with a
  `<HeadContent />` render, but confirm the exact shape against the installed
  version's docs rather than assuming — this API has moved before):
  ```tsx
  export const Route = createRootRoute({
    head: () => ({
      links: [
        {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: "/fonts/inter-variable.woff2",
          crossOrigin: "anonymous",
        },
      ],
    }),
    // ...component, notFoundComponent (step 5)
  });
  ```
  Only preload fonts genuinely needed for first paint (e.g. body + heading weights) —
  preloading everything defeats the purpose and can itself slow the initial load.

## 5. Add the default not-found route

- Create `src/components/NotFound.tsx` — a simple component using the `.not-found`
  BEM classes from step 3, with a heading, a short message, and a link back to `/`.
- Wire it as the default 404 via the root route's `notFoundComponent` option in
  `src/routes/__root.tsx`:
  ```tsx
  export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: NotFound,
  });
  ```
- If the project also defines its router explicitly (commonly `src/router.tsx`), also
  set `defaultNotFoundComponent: NotFound` on the router instance, so any route without
  its own `notFoundComponent` falls back to the same page. Check whichever file
  actually calls `createRouter()` in the scaffolded project.
- Do **not** add a catch-all `$.tsx` splat route for this — the root route's
  `notFoundComponent` is the single source of truth for 404s in this setup.

## 6. Configure static prerendering

- In `vite.config.ts`, enable prerendering on the `tanstackStart` plugin:

  ```ts
  import { tanstackStart } from "@tanstack/react-start/plugin/vite";

  export default defineConfig({
    plugins: [
      tanstackStart({
        prerender: {
          enabled: true,
          crawlLinks: true,
        },
      }),
      // ...other plugins
    ],
  });
  ```

- `crawlLinks: true` means any route linked from `/` gets picked up automatically as
  routes are added later — but confirm new routes actually appear in the prerendered
  output as they're built (see `workflow.md`, Phase 5), don't assume it silently.
- If this particular project has been scoped for SSR/Node hosting instead of static
  hosting (see `workflow.md`, Phase 1), skip this step and record that decision — and
  the reason — in `AGENTS.md` instead.

## 7. Write AGENTS.md

Document: the exact CLI command used, Tailwind removal notes (or confirmation none
was present), the index-based SCSS import convention, the dark-theme caveat, which
route the stylesheet is wired into, which fonts are embedded (files, license,
preloaded weights) per step 3's "Embed fonts", the `notFoundComponent` implementation
and where it's registered, whether prerendering is enabled and — once step 8 is run —
the exact static output folder name observed in the build log.

## 8. Verify build

- Run `npm run build`. Ensure the command completes with zero errors.
- Note the exact output folder(s) produced (this can vary by version/config) and
  record it in `AGENTS.md` rather than assuming a folder name.
- If prerendering is enabled, confirm the output folder contains a static HTML file
  for `/` and for the not-found page, not just JS bundles.
- If the build fails due to missing imports, correct them by double-checking the
  `_index.scss` forwarding paths.

---

## Generate TODO.org (master checklist)

Immediately after the scaffold is verified, create a file named `TODO.org` in the
project root.

**Structure requirements**:

- Use `*` for top-level Phases.
- Use `**` for Milestones.
- Use `*** [ ]` for every actionable, granular checkbox.
- The checklist must be exhaustive, covering everything the scaffold does NOT cover.

**Include these exact sections with these specific checkboxes:**

### \* PHASE 0: FIGMA DESIGN & TOKEN HANDSHAKE

- [ ] Create Figma file with Pages named per the approved sitemap (e.g. `index`,
      `about`, `contact`, `blog`).
- [ ] Set up Figma Local Variables using the **Slash Naming Convention**:
  - `color/primary/500`, `color/neutral/100`, `font/size/body`, `spacing/md`,
    `radius/lg`, `breakpoint/tablet`.
- [ ] Copy these Figma token values into `src/styles/abstracts/_variables.scss` to
      match exactly.
- [ ] Build Figma Components with forward-slash naming (e.g., `Button/Primary`,
      `Card/Feature`, `Navigation/Desktop`).
- [ ] Define Figma Variants for States (Default, Hover, Disabled) to map to SCSS
      `&:hover`.
- [ ] Export optimized SVGs/PNGs from Figma into `/public/images/`.
- [ ] Confirm brand font file(s) and license from the client/Figma library, and place
      them in `/public/fonts/` per the "Embed fonts" step of the scaffold.

### \* PHASE 1: TANSTACK REACT COMPONENT IMPLEMENTATION

- [ ] Create `src/components/Button.tsx` — map `variant` prop to CSS classes
      (`.button--primary`).
- [ ] Create `src/components/Card.tsx` — match Figma `Card/Default` component.
- [ ] Create `src/components/Nav.tsx` — build desktop and mobile variants.
- [ ] Extend `src/routes/__root.tsx` with the shared layout (header, footer, nav).
- [ ] Build `src/routes/index.tsx` matching `pages/_home.scss` and the Figma `index`
      frame.
- [ ] Add new routes as new files under `src/routes/` per the approved sitemap (e.g.
      `about.tsx`, `contact.tsx`, `blog/$slug.tsx`).
- [ ] Confirm each new route is covered by the prerender config (step 6 above) —
      either via `crawlLinks` picking it up or an explicit entry.
- [ ] Set up TanStack Query for data fetching if needed (create `src/lib/api.ts` and
      hooks).

### \* PHASE 2: STYLING POLISH (SCSS)

- [ ] Implement all `layout/` partials (`_header`, `_footer`, `_grid`).
- [ ] Implement all `components/` partials (`_buttons`, `_cards`, `_modals`).
- [ ] Add responsive breakpoints using `respond-to(tablet)` mixin across all partials.
- [ ] Ensure `themes/_dark.scss` is configured but commented out in `_index.scss` —
      document the swap method in `AGENTS.md`.

### \* PHASE 3: ASSET & PERFORMANCE OPTIMIZATION

- [ ] Convert all raster images to WebP/AVIF format.
- [ ] Confirm embedded fonts are `.woff2`, self-hosted from `/public/fonts/`, and
      preloaded only for above-the-fold weights (see scaffold step 4).
- [ ] Add sitemap generation — produce `sitemap.xml` covering every prerendered route.
- [ ] Run Lighthouse on "Slow 4G" throttle — score must be ≥90 for Performance,
      Accessibility, SEO.
- [ ] Use `<img>` with lazy loading and proper aspect ratios (or an image optimisation
      component).

### \* PHASE 4: GIT & VERSION CONTROL

- [ ] Initialize `git init` and create `.gitignore` (include `node_modules`, `.env`,
      the static build output folder, `.vercel`, `.vinxi`, `.output`).
- [ ] Commit scaffold: `git add . && git commit -m "feat: scaffold TanStack Start +
    SCSS 7-1, static prerendering, default 404"`.
- [ ] Create `dev` branch: `git checkout -b dev`.
- [ ] Push to GitHub/GitLab private repo.

### \* PHASE 5: DEPLOYMENT (STATIC / cPANEL / DOMAINS.CO.ZA)

- [ ] Confirm the hosting model is still "static/prerendered" per `workflow.md`,
      Phase 1 — if it changed to SSR/Node during build-out, stop and re-scope Phase
      5/6/7 rather than force a static deploy.
- [ ] Purchase domain via Domains.co.za (or GoDaddy).
- [ ] Run `npm run build` locally and confirm the static output folder from
      `AGENTS.md` (verify it still matches — this can shift between framework
      versions).
- [ ] Zip the contents of that static output folder into `public.zip`.
- [ ] Log into cPanel → File Manager → upload `public.zip` to `public_html`.
- [ ] Extract `public.zip` and move all contents from the extracted folder to the
      root (`public_html`).
- [ ] Delete the empty extracted folder and `public.zip` after moving.
- [ ] Create `.htaccess` with:
  - Gzip compression (`mod_deflate`).
  - Cache-Control headers for static assets (1-year cache).
  - `ErrorDocument 404 /<not-found-page>.html` pointing at the prerendered 404 page.
- [ ] Enable AutoSSL (cPanel → SSL/TLS → Run AutoSSL).
- [ ] Test live URL (`https://yourdomain.co.za`) in Incognito mode, including a
      deliberately broken URL to confirm the 404 page serves correctly.

### \* PHASE 6: DEPLOYMENT AUTOMATION (REPEATABLE)

- [ ] Create FTP account in cPanel (user: `deploy@domain.co.za`).
- [ ] Write `deploy.sh` using `lftp` mirror (or `rsync` over SSH) against the confirmed
      static output folder.
- [ ] Store FTP password in local `.env` (do not commit).
- [ ] Run `./deploy.sh` and verify push works without errors.

### \* PHASE 7: FINAL DOCUMENTATION & HANDOVER

- [ ] Update `AGENTS.md` with:
  - Link to Figma file.
  - Exact static output folder name and cPanel upload steps (ZIP → Extract → Move).
  - Environment variables required.
  - Notes on the `themes/dark` SCSS caveat.
  - Deployment script usage instructions.
- [ ] Write/update `CLIENT-HANDOVER.md` per `workflow.md`, Phase 8.
- [ ] Mark the project as "Main" branch and tag the release (`git tag v1.0.0`).

---

## Execution note

Run the steps above now, in order, using your available file and bash tools. Do not
stop early — carry the scaffold through to a verified `npm run build` and a written
`TODO.org` in one pass. Do not write a completion log into this file; any run-specific
notes belong in the generated `AGENTS.md`.
