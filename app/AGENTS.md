# VolMe

This repository is the VolMe rewrite, not a fresh template checkout. Before doing
anything here, read `docs/decisions/0001-rewrite-volme-on-this-template.md` — it
records the ground rules, the most important of which is that **there is no
backward compatibility with VolMe v1**: the old database is not migrated, old
accounts and sessions are not preserved, and v1 field names and endpoints are
historical reference only, never a contract to satisfy.

The v1 code still sits at `../frontend` and `../backend` as a reference. It is
deleted, and `app/` is promoted to the repository root, at the end of the migration.

Migration progress is tracked on a board outside this repository:
https://claude.ai/code/artifact/935dc9ea-94b9-402c-9168-7fc3c6da137d

**Read that board before starting migration work, and tick tasks off after
finishing them.** Its state lives in the artifact's own database — one document,
`progress/board`, shaped `{"done": {"p0-2": true, …}, "updated": "…"}`, where the
keys are the task ids printed on the board (`p0-1` … `p6-6`). Writing it replaces
the whole document, so read it, merge, then write — otherwise other people's ticks
are lost. Reference those task ids in commit messages and `docs/todos/` entries.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Using this template

`README.md` documents this project's tech stack, directory structure, a step-by-step "remove the template, build your app" checklist, scripts, and CI/CD setup. Unlike this file, it is **not** injected into context automatically — it goes unread unless you open it yourself.

- Whenever a change makes something `README.md` documents go stale — tech stack, directory structure, `package.json` scripts, the CI stage list/diagram, Docker instructions — update `README.md` in the same change. It has parallel 中文 and English sections covering the same content; keep both in sync.

# Roles and permissions

Every authorization check in this project answers to
[`docs/roles.md`](docs/roles.md) — two platform roles (`USER`, `ADMIN`) on the user,
two organization roles (`OWNER`, `MEMBER`) on a membership, and "is an organiser"
derived from having a membership rather than stored. **Read it before writing any
Server Action, Route Handler or page that reads or writes someone else's data**, and
update it in the same change as any code that adds a capability or moves who holds
it. Two rules that are easy to get wrong: take the actor from the Auth.js session,
never from the request body, and query membership per request rather than caching it
in the session.

# Decisions, research & deferred work

Agent sessions don't share memory — a non-obvious decision made in one session, or work someone deliberately left for later, is invisible to the next session unless it's written where that session will actually look, _and_ unless the next session actually goes looking. Both halves are mandatory, not optional judgment calls:

- **Before starting non-trivial work, and always when investigating something that doesn't make sense from the code alone** (a confusing bug, a surprising failure, a "why on earth is this done this way") — read [`docs/decisions/README.md`](docs/decisions/README.md) and [`docs/todos/README.md`](docs/todos/README.md) first. [`docs/research/README.md`](docs/research/README.md) holds dated, point-in-time notes on things outside the codebase (market, funding, competitors) that fed those decisions — read an entry when a decision cites it, and treat its figures as stale until re-checked. The explanation, or the reason nobody's fixed it yet, may already be recorded there — check before spending time re-deriving it from scratch.
- **The moment something takes real digging to understand, or you make a call that isn't obvious from the resulting code, is the signal to record it** — once resolved, add an entry to `docs/decisions/` in the same change, before treating the task as done. Entries are append-only — a changed decision gets a _new_ entry, and the old one is marked superseded, never edited away.
- **Before ending a task that leaves something unfinished or explicitly out of scope**, add an entry to `docs/todos/` in the same change — don't just mention it in the final response and let it evaporate when the session ends. When you resolve an existing todo, delete its file and its index row in the same change — a stale todo left behind is worse than none.
- **Whenever a decision or todo is tied to a specific place in the code, add a short comment there pointing back with the entry's relative path**. The doc linking to the code isn't enough by itself — the code has to link back, because that's the only breadcrumb visible to someone who's already staring at the confusing line with no reason to go browsing `docs/`.

# Material UI (this template's design system)

This project uses **MUI v9** for all UI. Do not introduce Tailwind, plain CSS modules, or other styling systems — style with MUI's `sx` prop, `styled()`, or the theme.

- **Styling:** use the `sx` prop or `styled()`. In MUI v9, `Typography` (and other components) no longer accept system shortcut props like `fontWeight={600}` — put them in `sx={{ fontWeight: 600 }}`.
- **Theme:** defined in `src/theme.ts` (CSS variables + light/dark `colorSchemes`). It's a `"use client"` module. Change palette/typography there, not in CSS.
- **SSR:** the root layout (`src/app/layout.tsx`) sets up `AppRouterCacheProvider` (from `@mui/material-nextjs/v16-appRouter`) → `ThemeProvider` → `CssBaseline`. Keep that order. Don't add a second `CssBaseline`.
- **Dark mode:** handled by `InitColorSchemeScript` + `useColorScheme()`. `html` has `suppressHydrationWarning` for this reason — keep it.
- **Client vs server:** MUI X components (DataGrid, charts, pickers, tree view) and any hook usage (`useColorScheme`, `useState`) require `"use client"` at the top of the file.
- **Date pickers:** wrap in `LocalizationProvider` with `AdapterDayjs` (dayjs is the chosen date lib).
- **Icons:** import individually, e.g. `import DarkModeIcon from "@mui/icons-material/DarkMode"`.
- **Grid:** use the v2 API — `<Grid size={{ xs: 12, md: 6 }}>`, not the old `item`/`xs` props.

# Internationalization (next-intl v4)

This project uses **next-intl** for i18n. All pages live under `src/app/[locale]/`. Do not add pages directly under `src/app/` (except layouts, not-found, and error boundaries).

- **Routing config:** `src/i18n/routing.ts` — defines supported locales (`en`, `de`, `zh-CN`) and default locale.
- **Navigation:** import `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/navigation` (not from `next/navigation` or `next/link`). These are locale-aware wrappers.
- **Server translations:** use `getTranslations` from `next-intl/server` in Server Components. Call `setRequestLocale(locale)` at the top of every layout/page for static rendering support.
- **Client translations:** use `useTranslations` from `next-intl` in Client Components. The `NextIntlClientProvider` is set up in `src/app/[locale]/layout.tsx`.
- **Message files:** `messages/en.json`, `messages/de.json`, `messages/zh-CN.json`. Add keys to all three when adding new text. `de` and `zh-CN` are currently incomplete — see `docs/todos/0001-incomplete-de-and-zh-translations.md`.
- **Locale switcher:** `src/components/LocaleSwitcher.tsx` — uses `useLocale()` + `router.replace(pathname, { locale })` to switch without losing the current path.
- **Proxy routing:** `src/proxy.ts` (Next.js 16 renamed `middleware.ts` → `proxy.ts`, export `proxy` instead of `middleware`). next-intl's `createMiddleware` handles auto-redirect to the user's preferred locale.
- **Root layout:** the `src/app/layout.tsx` calls `getLocale()` (async) to set `<html lang={locale}>` correctly — this makes all routes dynamic (server-rendered on demand). If you need static generation, remove `getLocale()` and accept a hardcoded `lang` attribute.
- **404 pages:** `src/app/[locale]/not-found.tsx` has translations; `src/app/not-found.tsx` is the untranslated root fallback for invalid locale paths.

# Data validation (Zod v4)

This project uses **Zod v4** for schema definition and runtime validation. Schemas live in `src/lib/schemas/`.

- **Define schemas** in `src/lib/schemas/index.ts` (or split into sub-files and re-export). Always use `z.infer<typeof Schema>` to derive the TypeScript type — don't write the type manually.
- **Zod v4 shortcuts:** `z.email()`, `z.url()`, `z.uuid()` are top-level helpers; `z.string().email()` still works too.
- **Coercion:** use `z.coerce.number()` / `z.coerce.date()` for values arriving as strings (URL params, form data).
- **API validation:** wrap `fetch` responses with `.parse()` or `.safeParse()` to catch shape mismatches early. Use `safeParse` when you want to handle errors gracefully instead of throwing.
- **Forms:** pair Zod schemas with `react-hook-form` + `@hookform/resolvers/zod` for MUI form integration (not included by default — install when needed).
- **Server Actions / Route Handlers:** always validate incoming data with `.parse()` at the boundary, never trust client-supplied data.

# Testing (Vitest + React Testing Library)

This project uses **Vitest**, not Jest. The API is nearly identical, but imports come from `vitest`.

- **Test location:** place test files in `__tests__/` subdirectories next to the module being tested, or alongside as `*.test.ts` / `*.test.tsx`.
- **Globals:** `describe`, `it`, `expect`, `vi` are available globally (`globals: true` in `vitest.config.ts`) — explicit imports are still fine and preferred.
- **Path alias:** `@/` resolves to `src/` inside tests, same as in the app.
- **Run tests:** `npm run test:run` (single run, CI) · `npm run test` (watch mode).

**Mocking next-intl in component tests** — always mock these three modules at the top of the test file before importing the component:

```tsx
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
}))

vi.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/',
  Link: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('@/i18n/routing', () => ({
  routing: { locales: ['en', 'zh-CN'], defaultLocale: 'en' },
}))
```

See `src/components/__tests__/LocaleSwitcher.test.tsx` for a complete working example.

- **MUI in tests:** MUI components render without a ThemeProvider in jsdom — this is fine for unit tests. Don't add a ThemeProvider wrapper unless you're explicitly testing theme-dependent behaviour.
- **Selected state:** MUI `MenuItem` with `selected` uses the `Mui-selected` CSS class, not `aria-selected`. Assert with `toHaveClass('Mui-selected')`.

# Toolchain

Run these before committing or opening a PR — they mirror what CI checks:

```bash
npm run lint          # ESLint
npm run format:check  # Prettier (read-only check)
npm run type-check    # tsc -b
npm run test:run      # Vitest single run
```

To auto-fix issues: `npm run lint:fix` and `npm run format`.

# Docker

- **`output: 'standalone'`** in `next.config.ts` is required for the Docker build. Do not remove it — without it, `.next/standalone/` is not generated and the Dockerfile's `COPY` steps will fail.
- **Architecture:** two containers — `app` (Node.js standalone server, port 3000) and `nginx` (reverse proxy, port 8080 → exposed as 3000). Nginx starts only after the `app` health check passes.
- **Static assets:** `/_next/static/` paths are content-hashed at build time. Nginx caches them with `immutable` headers — do not change this.
- **Local run:** `docker compose up -d` then visit `http://localhost:3000`.
