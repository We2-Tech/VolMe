<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

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

- **Routing config:** `src/i18n/routing.ts` — defines supported locales (`en`, `zh-CN`) and default locale.
- **Navigation:** import `Link`, `useRouter`, `usePathname`, `redirect` from `@/i18n/navigation` (not from `next/navigation` or `next/link`). These are locale-aware wrappers.
- **Server translations:** use `getTranslations` from `next-intl/server` in Server Components. Call `setRequestLocale(locale)` at the top of every layout/page for static rendering support.
- **Client translations:** use `useTranslations` from `next-intl` in Client Components. The `NextIntlClientProvider` is set up in `src/app/[locale]/layout.tsx`.
- **Message files:** `messages/en.json` and `messages/zh-CN.json`. Add keys to both files when adding new text.
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
