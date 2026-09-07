# 0003 — Decide whether messaging needs to go beyond application threads

Opened: 2026-09-07
Area: product — applications, notifications

## What needs doing

`docs/decisions/0006-drop-in-app-chat.md` removed v1's chat and replaced it with a
message thread scoped to a single application. That covers "the organiser has a
question about your application" and nothing else.

Reopen if any of these show up:

- Organisers ask to contact a volunteer **before** they apply, or after an event
  ends (e.g. inviting a good volunteer back).
- Volunteers ask to reach an organisation without applying to something first.
- Application threads visibly get used for conversations that have nothing to do
  with that application.

When it comes up, decide in this order:

1. **Is a thread enough, just attached elsewhere?** An organization-level enquiry
   thread is a much smaller build than chat, and keeps every message anchored to a
   context that can be moderated.
2. **Is email enough?** Resend is already wired up for application notifications
   (board P4-6). A "contact this organisation" form that sends mail may close the
   need entirely, with no inbox to build.
3. **Only then, real messaging.** That means unread state, notifications, a
   transport that is not polling, blocking/reporting, and moderation tooling —
   which in turn needs the admin UI that `ADMIN` does not have yet
   (`docs/roles.md`, "Deliberately not built yet").

Whatever is chosen, write a new decision entry superseding 0006.

## Why it wasn't done now

v1's chat never worked — the `/api/messages` prefix was never mounted, so sending a
message always 404'd. There is no usage to point at, no user asking for it, and
no moderation tooling to make open messaging safe. Application-scoped threads meet
the one need that demonstrably exists.

## Related

- `docs/decisions/0006-drop-in-app-chat.md`
- `docs/roles.md` — who can read an application thread
- Board tasks P4-2 (applications), P4-6 (email notifications), P5-7 (application page)
