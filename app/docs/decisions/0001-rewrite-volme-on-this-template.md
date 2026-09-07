# 0001 — Rewrite VolMe on this template, with no backward compatibility

Status: Accepted
Date: 2026-09-07

## Context

VolMe v1 (tagged `v1-legacy`) is a TUM SEBA 2024 course project: a Create React App
frontend (~15,200 lines, React 18, MUI 5, RTK Query, i18next) plus a separate
Express + Mongoose backend. `react-scripts` is unmaintained and two of its
dependencies (`react-quill`, `react-beautiful-dnd`) do not work on React 19, so
staying on the old stack blocks every other upgrade.

The repository has ~30 GitHub stars, so it is being refactored **in place** rather
than replaced by a new repository — stars belong to the repository itself and
survive branch, directory, and history changes.

The owner decided that **no backward compatibility is required at all**: the
production database is not migrated, existing user accounts and sessions are not
preserved, and the v1 API shape carries no weight. This is the single most
consequential constraint in the migration and is not visible anywhere in the code.

## Decision

- The template is vendored at `app/` via `git subtree` from
  `git@github.com:We2-Tech/nextjs-template.git`, so template history is preserved
  and future template updates can be pulled with `git subtree pull`.
- Frontend and backend merge into this one Next.js application. The Express server
  is not ported as a service; its controllers become Route Handlers and Server
  Actions.
- Schemas are **redesigned**, not migrated. Zod is the single source of truth in
  `src/lib/schemas/`; Mongoose models and TypeScript types derive from it.
- Authentication is rebuilt on Auth.js v5. Next.js itself provides no auth — only
  proxy, cookies, and Server Actions. Old bcrypt hashes, refresh tokens, and the
  `Code` verification-code collection are dropped rather than supported.
- `frontend/` and `backend/` stay in the tree as a reference until the rewrite
  reaches parity, then are deleted and `app/*` is promoted to the repository root.

## Alternatives considered

- **New repository.** Rejected: loses the stars and the project's history.
- **Preserve the production data.** Rejected by the owner. Keeping it would have
  forced a frozen schema, a snapshot-validation pass, bcrypt-hash compatibility,
  and a read-only staging period — roughly seven tasks of pure compatibility work
  buying nothing, since the v1 deployment has no data worth carrying forward.

## Consequences

- Anyone who finds a v1 field name, collection shape, or endpoint path should treat
  it as historical reference, not as a contract to satisfy.
- The v1 site and `api.volme.org` go offline at cutover; this is a new site, not a
  gradual traffic shift.
- `v1-legacy` is a permanent tag. Do not delete it — it is the only way back to the
  original implementation.

## Progress tracking

The 52-task migration board lives outside this repository, as a Claude artifact
whose task state is stored in its own database:

https://claude.ai/code/artifact/935dc9ea-94b9-402c-9168-7fc3c6da137d

Task ids on the board (`p0-1` … `p6-6`) are the shared vocabulary between that
board and this repository — reference them in commits and in `docs/todos/` entries.
