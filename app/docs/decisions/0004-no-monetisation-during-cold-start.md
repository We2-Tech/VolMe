# 0004 — Ship v2 with no payments; revisit monetisation after cold start

Status: Accepted
Date: 2026-09-07

## Context

v1 charged organisers to publish events. `Organizer` carried
`subscriptionType` (`FREE` / `BASIC` / `PREMIUM` / `PAYASYOUGO`),
`unusedPaidSubscription` and `subscriptionId`; `CreateEvent.jsx` decremented the
counter on every publish, dropped the organiser back to `FREE` when it hit zero,
and refused to publish with "Your subscription is invalid!". `Events.jsx` also
sorted non-`FREE` organisers' events to the top. Payment ran through PayPal, across
roughly 2,100 lines (`checkOut.jsx` 1,149, `Pricing.jsx` 937, plus
`paypalButton.js` and the payment slices).

That model existed because the TUM SEBA course required a business model, not
because it had been validated. Charging the supply side per publish is the wrong
lever for a two-sided marketplace in cold start: few events means no volunteers,
and no volunteers means no organisers. A publish fee makes the scarce side scarcer.

Separately, the v2 running cost is close to zero — self-hosted runner plus
Cloudflare Tunnel, R2's free tier with no egress charge, Resend's free tier, and a
Mongo container. The only line item that can actually generate a bill is the Google
Maps API. So there is no cost pressure forcing revenue now.

The market check (`docs/research/2026-09-german-volunteering-market.md`) found that
the established German platforms converged on the same answer: the platform is free
for non-profits and volunteers, and the money comes from corporates.

## Decision

**v2 ships with no payment path at all.**

- No PayPal. If VolMe ever charges, it will be **Stripe** — Payment Links can take
  money with zero application code, which is the right amount of code to write
  before there is a paying customer.
- Publishing events is free and unlimited.
- The subscription fields are **not** carried into the v2 `Organizer` schema:
  `subscriptionType`, `unusedPaidSubscription`, `subscriptionId` are all dropped,
  along with the `PaymentItem` model and the `SUBSCRIPTIONTYPE` enum. Keeping a
  per-publish counter around would quietly invite the same model back.
- `Organizer.isVerified` **is** kept. It costs nothing, it already exists, and it
  is the hook for the one monetisation shape that does not damage the marketplace
  (paid verification / featured placement). For now verification is granted by
  hand and carries no fee.
- The cold-start plan is partnerships, not revenue: approach Munich e.V.s and city
  bodies directly, onboard them free.

## Alternatives considered

- **Keep PayPal, disable it behind a flag.** Rejected: 2,100 lines of dormant
  payment code is 2,100 lines to port, type, test and keep working against a
  moving PayPal SDK, for a feature deliberately switched off.
- **Keep the schema fields, drop only the UI.** Rejected for the reason above — the
  fields are the model. Re-adding three fields later is a five-minute change; the
  cost of keeping them is that the next person builds on them.

## Consequences

- **Event ranking needs a new rule.** v1 ranked paid organisers first. P5-4 has to
  pick something else — the default should be event start date ascending
  (soonest first), with sort exposed through `searchParams`.
- **Abuse control is now an open question.** A publish fee was, incidentally, the
  only thing limiting how many events an account could create. Rate limiting or
  verification gating may be needed once the site is public.
- Anyone who finds `subscriptionType` in the v1 tree should treat it as history,
  not as a feature to restore.
- Revisiting this is a **new** decision entry, not an edit to this one. The open
  question and what to watch for are parked in
  `docs/todos/0002-monetisation-when-cold-start-ends.md`.
