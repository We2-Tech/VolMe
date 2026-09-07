# 0010 — Drop the wishlist

Status: Accepted
Date: 2026-09-07

Supersedes the wishlist half of
[`0007`](0007-embed-the-wishlist-on-the-user.md). That entry's other half — Document
keeps its own collection, with a scope and R2 metadata — still stands.

## Context

0007 kept v1's wishlist, moving it from a two-field `WishlistItem` collection to an
array on the user. Cheap to keep, so it was kept.

Reviewing it before P4, the feature turned out to have no job to do here.
**Applying is nearly free** — it costs nothing, needs no payment, and can be
withdrawn (`WITHDRAWN` is in `ApplicationStatus`). A "save for later" list earns its
place where applying is expensive or irreversible; where it is cheap, "save it" just
competes with "apply", and loses.

v1 wrapped that thin idea in a NavBar drawer, a dedicated page with its own search
box, and a 228-line card component — a lot of surface for storing `{user, event}`.

There is one real gap that argued for keeping it: a volunteer may only apply to the
soonest occurrence of a series ([`0009`](0009-recurring-events-as-series-plus-occurrences.md)),
so an interesting date three weeks out cannot be held onto. That is a genuine
consequence of our own rule — but it is narrow, and a bookmark list is a
roundabout answer to it.

## Decision

The wishlist is removed: `User.wishlist`, the `/wishlist` route from the proxy's
protected prefixes, the seeded example, and v1's `wishlist` / `wishlistItemCard`
message blocks in all three locales.

Board tasks P4-5 and the wishlist parts of P5-1 are dropped.

## Consequences

- Re-adding it costs one array field, one Server Action and a button — the schema
  work is not the expensive part, so deferring loses nothing.
- The gap from 0009 stays open: nothing holds an occurrence a volunteer cannot apply
  to yet. If that turns out to bite, the better answer is probably "notify me when
  applications open" rather than a passive bookmark list — it has an actual job.
  Recorded in [`todos/0004`](../todos/0004-holding-a-future-occurrence.md).
- Anything in the v1 tree referring to wishlists is history, not a feature to
  restore.
