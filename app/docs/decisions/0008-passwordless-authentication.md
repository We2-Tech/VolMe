# 0008 — Passwordless sign-in: Google OAuth and emailed magic links

Status: Accepted
Date: 2026-09-07

## Context

Board task P3-3 planned an optional email-and-password `Credentials` provider
alongside Google OAuth, with P3-6 covering email verification and password reset.

Two things pushed against that once the work started:

- **Passwords are the expensive half.** A `Credentials` provider means choosing and
  maintaining a hash, a reset flow, a reset-token store, rate limiting on the sign-in
  form, and a "your password was changed" mail. v1 had all of that, badly: a bespoke
  `Code` collection, a 366-line `ForgetPasswordPage`, and a `loginLimiter`.
- **Google alone is not enough for the audience.** The cold-start plan is Munich
  e.V.s and city bodies (docs/research/2026-09-german-volunteering-market.md). Many
  of them use their own mail domain and would be shut out by a Google-only login.

Auth.js's Resend provider covers the second point without the first: an emailed
one-time link that both proves the address and signs the person in.

## Decision

**VolMe has no passwords.** Two ways in:

- **Google OAuth**, registered only when `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`
  are present, so a fresh checkout still boots and can sign in by email.
- **An emailed magic link** via Auth.js's Resend provider.

Consequences for the board: P3-3 (`Credentials`) and P3-6's password-reset half are
not built at all. There is nothing to reset. Email verification is implicit — a
delivered link is the proof.

Two supporting choices:

- **JWT session strategy, not database sessions.** The adapter still owns `users`,
  `accounts` and `verification_tokens`; only the session lives in the cookie. This
  is what lets `src/proxy.ts` answer "is this request signed in?" without a database
  round trip. Database sessions cannot be checked there.
- **In development, with no `AUTH_RESEND_KEY`, the sign-in link is printed to the
  server console** instead of sent. Otherwise local sign-in would require owning a
  verified sending domain. In production the same path throws.

## Alternatives considered

- **Credentials with argon2.** Rejected: all of the cost above, for a login method
  that is strictly worse for the user than a link in their inbox.
- **Google only.** Rejected: excludes the exact organisations the cold-start plan
  depends on.
- **Database sessions.** Rejected: no proxy-level gate, and the per-request database
  read buys nothing here because the only thing the session carries is
  `User.role` — membership is queried per request regardless (docs/roles.md).

## Consequences

- Losing access to the inbox means losing access to the account. There is no
  fallback, no security questions, no support flow. If that becomes a real support
  burden, adding a second provider is the answer, not adding passwords.
- Sign-in is a two-step flow (submit address, open mail), which is slower than a
  password field. `/signin/check-email` exists to make that step legible.
- The magic-link mail is now on the critical path for signing in — a Resend outage
  is a sign-in outage for everyone without a Google account.
- `AUTH_SECRET` signs the session JWT. Rotating it signs everyone out; losing it in
  production is a security incident, not an inconvenience.
