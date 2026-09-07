# 0007 — Embed the wishlist on the user; keep documents in their own collection

Status: Partially superseded by 0010 — the wishlist is gone; the Document half stands
Date: 2026-09-07

## Context

Board task P2-5 asked whether v1's two small side collections deserve to exist in
v2.

- **`WishlistItem`** had exactly two fields, `user` and `event`. A whole collection,
  an index, a controller, four routes and a Redux slice to express "this person
  starred that event".
- **`Document`** recorded an uploaded file: type, path, owner, and the events it was
  attached to.

With no data to migrate, both are free to reshape now and expensive to reshape
after P5 writes a dozen pages against them.

## Decision

**The wishlist is an array of event ids on the user** (`User.wishlist`). The
`WishlistItem` collection is gone.

**Documents keep their own collection.** They gained an `owner`, a `scope`
(`PROFILE` / `APPLICATION` / `ORGANIZATION`) and R2 metadata (`key`, `filename`,
`contentType`, `size`) instead of v1's single `path` string.

## Alternatives considered

- **Keep `WishlistItem` as a join collection.** The one thing it buys is asking
  "who wishlisted this event?" cheaply. Nothing on the board asks that, and a
  wishlist is inherently small and always read together with its owner — one
  document read instead of a query plus a join.
- **Embed documents on the user and on the application.** Rejected: a profile
  document is deliberately reusable across several applications, so embedding it
  would either duplicate the file metadata per application or force one of the two
  to hold a dangling reference. Files also need lifecycle handling of their own —
  an orphaned R2 object is a bill, and a shared collection is where a cleanup job
  can find them.

## Consequences

- Write to `User.wishlist` with `$addToSet` / `$pull`, never by reading the array,
  editing it in memory and writing it back — two tabs would clobber each other.
- If a "trending events" or "how many people saved this" feature ever appears, that
  is the trigger to revisit: it wants the inverse index this shape does not have.
  A new decision entry, not an edit to this one.
- The wishlist rides along on every user read. That is fine at tens of entries and
  would not be at thousands; nothing enforces a cap today.
- `Document.key` is an R2 object key, not a URL
  ([`0002`](0002-cloudflare-r2-for-file-storage.md)), so the public base or the
  signing strategy can change without touching stored rows.
