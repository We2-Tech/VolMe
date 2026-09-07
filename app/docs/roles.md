# Roles and permissions

Living reference for who can do what in VolMe v2. Update it in the same change as
any code that adds a capability or changes who holds it.

Why the model has this shape — and what it replaces — is in
[`decisions/0005-two-layer-role-model.md`](decisions/0005-two-layer-role-model.md).
That entry is append-only history; **this file is the current truth**.

---

## The two layers

VolMe has **platform roles** on the user, and **organization roles** on a
membership. They answer different questions and never merge into one enum.

```
User ──< Membership >── Organization
 role                     (name, type, isVerified, address…)
                            ^
                            └── Event.organization
```

### Layer 1 — platform role (`User.role`)

Exactly two values. Global, one per user.

| Value   | Who                                | Built                        |
| ------- | ---------------------------------- | ---------------------------- |
| `USER`  | Every registered account. Default. | yes                          |
| `ADMIN` | Platform staff.                    | value only — no admin UI yet |

`ADMIN` exists in the enum so moderation fields (`User.isBlocked`,
`Organization.isVerified`) have a legitimate holder. There is no admin interface;
until one is built, an admin acts through the database. Do **not** add `MODERATOR`,
`SUPPORT` or similar until an actual admin screen exists to need them.

There is deliberately **no `VOLUNTEER` or `ORGANIZER` platform role.** Volunteering
is what any signed-in user does; organising is what a membership lets you do.

### Layer 2 — organization role (`Membership.role`)

Exactly two values. Scoped to one organization; a user may hold memberships in
several, with a different role in each.

| Value    | Can                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `OWNER`  | everything `MEMBER` can, plus: invite and remove members, change a member's role, edit organization profile, delete the organization |
| `MEMBER` | create, edit and delete the organization's events; read and decide applications to them; message applicants                          |

An organization always has at least one `OWNER` — the last one cannot leave or be
demoted without promoting someone else first.

---

## Derived predicates

These are **computed, never stored**. Storing them is how the two layers drift apart.

| Question                    | How to answer                                         |
| --------------------------- | ----------------------------------------------------- |
| Is this a volunteer?        | Any authenticated user. There is no flag to check.    |
| Is this an organiser?       | The user has ≥ 1 membership.                          |
| Can they edit this event?   | A membership exists for `(user, event.organization)`. |
| Can they manage this org?   | That membership's role is `OWNER`.                    |
| Can they moderate anything? | `user.role === 'ADMIN'`.                              |

---

## Permission matrix

`self` = the user's own record. `member` / `owner` = of the organization that owns
the object in question.

| Action                                     | anonymous |          USER           | member | owner | ADMIN |
| ------------------------------------------ | :-------: | :---------------------: | :----: | :---: | :---: |
| Browse and search events                   |     ✓     |            ✓            |   ✓    |   ✓   |   ✓   |
| View an event, an organization profile     |     ✓     |            ✓            |   ✓    |   ✓   |   ✓   |
| Sign in (Google, or an emailed link)       |     ✓     |            —            |   —    |   —   |   —   |
| Apply to an event                          |     —     |            ✓            |   ✓    |   ✓   |   ✓   |
| Withdraw own application                   |     —     |            ✓            |   ✓    |   ✓   |   ✓   |
| Wishlist an event                          |     —     |            ✓            |   ✓    |   ✓   |   ✓   |
| Review an event they attended              |     —     |            ✓            |   ✓    |   ✓   |   ✓   |
| Edit own profile, upload own documents     |     —     |          self           |  self  | self  | self  |
| Create an organization                     |     —     | ✓ (becomes its `OWNER`) |   ✓    |   ✓   |   ✓   |
| Create / edit / delete the org's events    |     —     |            —            |   ✓    |   ✓   |   ✓   |
| Read applications to the org's events      |     —     |            —            |   ✓    |   ✓   |   ✓   |
| Accept / decline an application            |     —     |            —            |   ✓    |   ✓   |   ✓   |
| Read an applicant's uploaded documents     |     —     |            —            |   ✓    |   ✓   |   ✓   |
| Invite / remove members, change their role |     —     |            —            |   —    |   ✓   |   ✓   |
| Edit organization profile                  |     —     |            —            |   —    |   ✓   |   ✓   |
| Delete the organization                    |     —     |            —            |   —    |   ✓   |   ✓   |
| Set `Organization.isVerified`              |     —     |            —            |   —    |   —   |   ✓   |
| Block a user, remove any event or review   |     —     |            —            |   —    |   —   |   ✓   |

An applicant's uploaded documents are readable by the applicant and by members of
the organization they applied to — nobody else, including other applicants. Serve
them through presigned GETs, never a public URL
([`decisions/0002`](decisions/0002-cloudflare-r2-for-file-storage.md)).

---

## How to check this in code

**Never trust the client for identity or ownership.** v1's `createEvent` read the
organiser id straight out of `req.body`, so any signed-in user could publish an
event attributed to someone else. Take the actor from the session, always.

- `User.role` rides in the Auth.js session callback, so `auth()` gives it without a
  query. It is only ever useful for the `ADMIN` check.
- Membership is **not** in the session — a user can belong to many organizations and
  membership changes must take effect immediately, not at next sign-in. Query it per
  request, in the Server Component / Server Action / Route Handler that needs it.
- `src/proxy.ts` gates on authentication only, by matching the request path against
  `PROTECTED_PREFIXES` after stripping the locale, and redirecting anonymous
  visitors to `/signin`. Object-level checks belong next to the data access, not in
  the proxy — the proxy cannot know which organization owns the event in the URL.
- The helpers in `src/lib/server/authz.ts` implement every predicate above:
  `currentUser` / `requireUser` / `requireAdmin`, `membershipRole`, `isOrganiser`,
  `membershipsOf`, and `requireMembership(orgId, { atLeast })`. Use them rather than
  querying `MembershipModel` at the call site.

---

## Deliberately not built yet

Each of these is a new decision entry when it happens, not an edit to this file's
history:

- **Admin UI.** `ADMIN` has no screens. Moderation is manual.
- **Finer organization roles** (`EDITOR`, `VIEWER`, event-level delegation). Wait
  until someone complains that `MEMBER` is too broad.
- **Company / corporate accounts.** These arrive as `Organization.type === 'COMPANY'`
  plus team sign-up, when corporate volunteering becomes real
  ([`todos/0002`](todos/0002-monetisation-when-cold-start-ends.md)).
- **Umbrella organizations.** A body like Freiwilligen-Agentur TATENDRANG managing
  several Vereine works today by giving one person several memberships. A real
  parent/child organization hierarchy is not modelled.
