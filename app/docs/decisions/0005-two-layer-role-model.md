# 0005 — Split roles into a platform role and an organization membership

Status: Accepted
Date: 2026-09-07

## Context

v1 had one flat enum on the user: `VOLUNTEER` / `ORGANIZER` / `ADMIN`, chosen at
registration and fixed thereafter, implemented as Mongoose discriminators. The
`Organizer` discriminator carried `organizationName`, `country`, `state`, `city`,
`address`, `postalCode` and `isVerified` — meaning **the organisation was modelled
as a user account wearing a costume**. `Event.organiser` pointed at a single
`User`.

Three problems, none visible until you try to sign up a real association:

1. **One e.V., one login.** A Verein's Vorstand and its Ehrenamtskoordinator both
   need to manage the same events; v1 gives them one shared password. Every Munich
   organisation in the cold-start plan has this shape.
2. **A person cannot be both.** Someone who coordinates for an association also
   volunteers elsewhere at the weekend. v1 forces two accounts.
3. **`ADMIN` was never real.** No controller, route or middleware referenced it, so
   `User.isBlocked` and `Organizer.isVerified` had no one who could set them.

Separately, `eventController.createEvent` took `organiser` from `req.body` without
comparing it to the authenticated user — any signed-in account could publish an
event attributed to anyone.

There is no data to migrate (`0001`), and P5 rewrites every page that touches
authorization, so the schema shape chosen here is the one those pages get written
against. Changing it later costs page rewrites; changing it now costs nothing.

## Decision

Two layers, two values each.

- **`User.role`** — `USER` (default) and `ADMIN`. Nothing else. There is no
  `VOLUNTEER` or `ORGANIZER` platform role: volunteering is what any signed-in user
  does, organising is what a membership permits.
- **`Membership`** — a new collection joining a user to an `Organization` with an
  org-scoped role of `OWNER` or `MEMBER`. A user may hold memberships in several
  organizations, with a different role in each.
- **`Organization`** — a new collection holding what v1 hung off the `Organizer`
  user: name, address, `isVerified`, and a `type` for later company accounts.
  `Event.organization` replaces `Event.organiser`.
- "Is an organiser" is **derived** from having ≥ 1 membership, never stored.
- Platform role travels in the Auth.js session; **membership does not** — it is
  queried per request so that adding or removing a member takes effect immediately
  rather than at next sign-in.

The current permission matrix and the derived predicates live in
[`docs/roles.md`](../roles.md), which is a living document. This entry records only
why the shape was chosen.

## Alternatives considered

- **Flatten v1's enum and keep organisation data on the user.** Cheaper: no extra
  collection, no invitation flow. Rejected because it solves none of the three
  problems above, and corporate volunteering — the monetisation path in
  `0004` — needs organisation-shaped accounts, so it only defers the same work to a
  point where a dozen pages already depend on the old shape.
- **Finer org roles now** (`OWNER` / `EDITOR` / `VIEWER`). Rejected as speculative.
  Two roles cover every workflow currently on the board; splitting `MEMBER` later is
  additive and cheap.

## Consequences

- **New work in P4:** an invitation flow. Joining an organization is by emailed
  invite from an `OWNER`; roughly half a day, and it did not exist in v1.
- **New step after registration:** a user who wants to publish must create or join
  an organization. Registration itself no longer asks "volunteer or organiser?".
- **Authorization moves next to the data.** `src/proxy.ts` gates authentication
  only; whether the actor may touch _this_ event is decided in the Server
  Action / Route Handler that loads it, because the proxy cannot know which
  organization owns the object named in the URL.
- **Never read the actor from the request body.** Take it from the session. This is
  the specific hole v1 had.
- An organization must always retain at least one `OWNER`.
- The umbrella-agency case (one coordinator across several Vereine) is served by
  multiple memberships. A parent/child organization hierarchy is explicitly not
  modelled; that would be a new decision.
