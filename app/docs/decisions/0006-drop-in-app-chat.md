# 0006 — Drop in-app chat from v2

Status: Accepted
Date: 2026-09-07

## Context

v1 shipped a chat feature: `Chat.jsx`, `ChatPopup`, `ChatItem`,
`ChatPopupButton`, `conversation` and `message` models, `messageController`, and a
`messageApiSlice`.

It did not work. `frontend/src/redux/constants.js` sets
`MESSAGE_URL = "/api/messages"`, but `backend/server.js` never mounts that prefix —
there is no `messageRoutes.js` in the tree. So `useSendMessageMutation` and
`useGetMessagesQuery` both hit an unmounted path and get the server's catch-all 404. Only the conversation list worked, because it hangs off a different route
(`/api/users/:userId/conversations`).

In other words: on the live v1 site, opening a chat window and sending a message
did nothing. What is left is a conversation list over a 2-second `refetch()` poll,
with no sockets, no unread state and no notifications.

Porting it is therefore not a migration — it is building a chat feature from
scratch, wearing v1 code as a costume.

## Decision

Chat is dropped from v2. `Chat.jsx`, the three `components/Chat/*` files, the
`conversation` and `message` models, `messageController` and the message slice are
not ported.

The need behind it — an organiser and an applicant exchanging a few messages about
a specific application — is real, and is met by **messages attached to an
application**: a small append-only thread on the `Application` document, visible to
the applicant and to members of the owning organization
([`docs/roles.md`](../roles.md)). No sockets, no presence, no polling loop; the page
is server-rendered and revalidates on post.

That thread is part of the P4/P5 application work, not a separate chat product.

## Alternatives considered

- **Port it and fix the routing.** Rejected: mounting the missing route is the
  smallest part. Real chat needs unread counts, notifications, and transport that
  isn't a 2-second poll — a project in its own right, for a feature no user has ever
  successfully used.
- **Keep the 2-second poll as-is.** Rejected: it is a per-user request every two
  seconds for a feature that cannot send messages.

## Consequences

- Users cannot message each other outside the context of an application. That is
  intentional — unsolicited direct messaging on a volunteering platform is a
  moderation liability, and there is no moderation tooling
  ([`0005`](0005-two-layer-role-model.md): `ADMIN` has no UI).
- If free-form messaging is wanted later, it is a new decision and a new build, not
  a restoration. What to weigh is parked in
  [`todos/0003`](../todos/0003-messaging-beyond-application-threads.md).
