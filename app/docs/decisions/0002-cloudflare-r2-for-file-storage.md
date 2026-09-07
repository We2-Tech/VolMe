# 0002 — Store uploads on Cloudflare R2, not AWS S3

Status: Accepted
Date: 2026-09-07

## Context

VolMe stores two kinds of user uploads: event cover images and the documents
volunteers attach to an application (mostly PDFs). v1 kept them in an AWS S3
bucket, uploaded straight from the browser with credentials baked into the bundle
(`frontend/src/util/fileUploader.js`).

The owner has decided to stop using AWS entirely, so the v1 bucket and its
credentials are out of scope — not migrated, not fixed, just abandoned along with
the rest of the v1 infrastructure (see
`0001-rewrite-volme-on-this-template.md`).

## Decision

Uploads go to **Cloudflare R2**.

- Access it with `@aws-sdk/client-s3` v3 plus `@aws-sdk/s3-request-presigner`,
  pointed at the R2 S3-compatible endpoint
  (`https://<account-id>.r2.cloudflarestorage.com`). The client code is ordinary
  S3 code; only the endpoint and credentials differ.
- The browser never holds a credential. A Route Handler signs a short-lived
  presigned PUT for each upload, and the browser uploads directly to R2.
- Reads go through a public R2 custom domain (`NEXT_PUBLIC_R2_PUBLIC_URL`) for
  event images, and through presigned GETs for application documents, which must
  stay private to the applicant and the organiser.
- Env vars: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
  `R2_BUCKET`, `NEXT_PUBLIC_R2_PUBLIC_URL`.

## Alternatives considered

- **UploadThing.** Fastest to wire up and ships its own React dropzone, but adds a
  third-party vendor in the upload path and caps the free tier at 2 GB.
- **MongoDB GridFS.** No new service at all, and the compose file already runs a
  `mongo` container — but every image read then goes through a Route Handler, with
  no CDN in front of it, and large files put avoidable load on the database.

R2 won because it keeps the code identical to the S3 plan already sketched for P4,
charges nothing for egress, and sits in the same ecosystem as the Cloudflare Tunnel
the template already supports.

## Consequences

- Anything in this repository that says "S3" means the S3 _API_, not AWS.
- `NEXT_PUBLIC_R2_PUBLIC_URL` is the only R2 value the browser ever sees. If a
  future change needs an `R2_*` secret client-side, that is a bug — sign a URL on
  the server instead. This is the exact mistake v1 made with
  `REACT_APP_AWS_SECRET_ACCESS_KEY`.
- The v1 S3 bucket's contents (existing event images and volunteer documents) are
  not carried over. Deactivate that key pair whenever the AWS account is closed.
