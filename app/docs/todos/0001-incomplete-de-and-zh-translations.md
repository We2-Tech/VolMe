# 0001 — Fill the gaps in the German and Chinese message files

Opened: 2026-09-07
Area: `messages/de.json`, `messages/zh-CN.json`

## What needs doing

`messages/en.json` has 337 keys. The other two locales are incomplete, inherited
straight from v1:

- **`de.json`** — 297 keys: 50 missing versus English, 10 extra. The missing block
  is mostly the whole `events.*` category-label group (`events.AC`, `events.AW`,
  `events.CI`, `events.CS`, `events.DR`, `events.EC`, `events.EL`, `events.HF`,
  `events.HH`, `events.HM`, `events.HR`, `events.IV`, …). The 10 extras are under
  `sideDrawer`, which no other locale has.
- **`zh-CN.json`** — 322 keys: 15 missing, no extras. Missing: `navBar.about`,
  `navBar.application`, `navBar.contacts`, `navBar.features`, `navBar.home`,
  `features.bCTitle1-3`, `features.bCDescription1-3`, `features.c`, and a few more.

Also decide what to do with the `sideDrawer` group: either translate it into the
other two locales or delete it from `de.json`.

Run a key-diff against `en.json` after filling them in — next-intl throws at render
time when a component asks for a key the active locale doesn't have.

## Why it wasn't done now

P1-5 of the migration was a mechanical port of v1's `public/locales/*/translation.json`
into next-intl's `messages/` layout (plus `cn_ZH` → `zh-CN` and the addition of the
`de` locale to `src/i18n/routing.ts`). The gaps already existed in v1 and are a
content problem, not a migration problem. Most of these keys belong to pages that
P5 rewrites anyway, so translating them now would partly be wasted work — but the
gaps must be closed before those pages ship.

## Related

- `src/i18n/routing.ts` — locales are `['en', 'de', 'zh-CN']`
- `docs/decisions/0001-rewrite-volme-on-this-template.md`
- Board tasks P1-5 (done) and P5-1 … P5-11 (the pages that use these keys)
