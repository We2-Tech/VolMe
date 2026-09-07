# 0002 — Complete the v1 production environment inventory before cutover

Opened: 2026-09-07
Area: deployment, DNS, `docker-compose.yml`, `.env`

## What needs doing

Board task P0-3 asked for an inventory of the live v1 deployment so P6-4 can replace
it. Everything the repository itself knows is below. The rest is only obtainable
from the owner's hosting and DNS accounts, and has to be filled in before cutover.

**Known from the code:**

- Origins the v1 API accepts (`backend/config/allowedOrigins.js`):
  `https://volme.org`, `http://volme.org`, `https://3.74.42.109`,
  `http://3.74.42.109`, `http://localhost:3000`. The bare IPv4 `3.74.42.109` is an
  AWS `eu-central-1` address — the v1 backend most likely runs on an EC2 instance
  in Frankfurt.
- The frontend calls `https://api.volme.org` in production and `http://localhost:3500`
  in development (`frontend/src/redux/apiSlice.js`), so `api.volme.org` is a
  separate host or vhost from `volme.org`.
- Backend env vars actually read by v1: `DATABASE_URI`, `PORT` (default 3500),
  `environment`, `CLIENT_ID` / `CLIENT_SECRET` (PayPal), plus EmailJS credentials
  used by `services/emailService.js`.
- Frontend build-time vars: `REACT_APP_AWS_ACCESS_KEY_ID`,
  `REACT_APP_AWS_SECRET_ACCESS_KEY`, `REACT_APP_AWS_REGION`,
  `REACT_APP_S3_BUCKET_NAME`, `REACT_APP_GOOGLE_MAP_KEY`, `REACT_APP_ENVIRONMENT`.
- There is no Dockerfile or CI config anywhere in v1 — the deployment was manual.

**Still unknown, needs the owner:**

- Where `volme.org` and `api.volme.org` DNS is hosted, and who holds the registrar
  account.
- The exact host behind `3.74.42.109` (EC2 instance id/size, or something else) and
  how the process is kept alive (pm2? systemd? a bare `npm start` in tmux?).
- Where TLS certificates come from and how they renew.
- Which MongoDB the production `DATABASE_URI` points at (Atlas cluster or
  self-hosted), and whether that instance should be deleted after cutover — the new
  deployment uses a fresh, empty database
  (`docs/decisions/0001-rewrite-volme-on-this-template.md`).
- The S3 bucket name and region, and whether its existing objects (uploaded
  volunteer documents and event images) should be kept or purged. The v1 credentials
  for it were published in the browser bundle and must be rotated regardless —
  board task P0-1.

## Why it wasn't done now

P0 was run from the repository only. The unknowns above live in AWS, the DNS
provider, and the domain registrar, none of which this session can reach.

## Related

- `docs/decisions/0001-rewrite-volme-on-this-template.md`
- Board tasks P0-1 (rotate the leaked AWS credentials), P0-3 (this inventory),
  P6-4 (replace the deployment), P6-5 (smoke test)
