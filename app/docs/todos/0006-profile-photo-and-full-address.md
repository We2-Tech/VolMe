# 0006 — Profile photo upload, and the rest of the address

Opened: 2026-10-08
Area: `src/components/ProfileForm.tsx`, `src/app/[locale]/profile/page.tsx`

## What needs doing

Two things the v2 profile form (P5-10) deliberately leaves out:

1. **Changing your photo.** `User.image` is shown in the nav and on the profile
   page, but only Google sign-in ever sets it. Someone who signs in by email link
   has a letter avatar and no way to change it. v1 had "Add / Remove profile
   picture". Doing it means a `PROFILE`-scoped upload through
   `src/lib/server/services/documents.ts` (presigned PUT to R2), then writing the
   public URL to `User.image`. The Auth.js adapter owns `image` and overwrites it on
   each Google sign-in — decide whether an uploaded photo should win, and if so
   store it in a separate field.
2. **The full address.** The form edits only `city` and `country`. Saving it
   replaces the whole `address` subdocument, so `state`, `street`, `houseNumber` and
   `postalCode` — which the schema allows and the seed data sets — are dropped on the
   first save. Nothing reads them today, which is why this was acceptable. If
   something starts to (distance search from home, a certificate with a postal
   address), either add the fields to the form or merge instead of replace in
   `updateMyProfile`.

## Why it wasn't done now

The photo upload needs the same R2 upload component as application documents
(board task P5-7), which does not exist yet. Building it once for P5-7 and reusing
it here is cheaper than building it twice. The address fields have no consumer.

## Related

- `src/lib/server/services/users.ts` — `updateMyProfile`
- `src/lib/server/models/user.ts` — which fields the Auth.js adapter owns
- `docs/decisions/0002-cloudflare-r2-for-file-storage.md`
