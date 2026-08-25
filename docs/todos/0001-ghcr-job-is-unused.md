# 0001 — The GHCR push job is unused

Opened: 2026-08-25
Area: `.github/workflows/ci.yml`

## What needs doing

The `docker` job (Stage 4, builds an image and pushes it to GHCR) is disabled by default (`ENABLE_DOCKER_PUSH` variable), and even if it were turned on, nothing currently consumes the image it publishes — the `deploy` job rebuilds locally via `docker compose up -d --build` instead of pulling from GHCR (see [decisions/0003](../decisions/0003-ci-deploy-job-rebuilds-locally-instead-of-pulling-from-ghcr.md)).

Pick one:

1. Remove the job outright (and the matching docs/table row in README) for a cleaner pipeline.
2. Keep it as reserved capacity for multi-environment distribution or image backups — but that needs an actual plan for who would consume it and when, or it just stays dead weight.

## Why it wasn't done now

Noticed in passing while adding the `deploy` job; out of scope for that change. Asked whether to remove it and hadn't gotten an answer yet, so recording it here rather than letting it get forgotten by the next session.

## Related

- [decisions/0003](../decisions/0003-ci-deploy-job-rebuilds-locally-instead-of-pulling-from-ghcr.md)
- The `docker` job in `.github/workflows/ci.yml`
- The `docker` row in README.md's CI pipeline table
