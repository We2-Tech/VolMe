# 0002 — Revisit monetisation once cold start ends

Opened: 2026-09-07
Area: product / business model — no code yet

## What needs doing

`docs/decisions/0004-no-monetisation-during-cold-start.md` shipped v2 with no
payment path. This entry holds what to do when that stops being the right answer,
so the question gets reopened deliberately rather than by someone rediscovering the
deleted PayPal code.

**Triggers to reopen — any one of these:**

- A company asks for a corporate volunteering programme (team days, employee
  matching, participation-hours reporting for their ESG/CSR reporting). This is the
  signal that matters most; it is how the incumbent German platforms actually earn.
- Running costs stop being negligible — realistically that means the Google Maps
  bill, or outgrowing R2's and Resend's free tiers.
- Organisers ask, unprompted, to pay for visibility.
- A funder requires a sustainability plan as a grant condition.

**When triggered, in order:**

1. Re-read `docs/research/2026-09-german-volunteering-market.md` and check whether
   the landscape still holds — it was a point-in-time snapshot.
2. Pick the revenue shape. The research ranks them; the short version is corporate
   volunteering B2B first, paid organiser verification second, donations third.
   Do **not** reintroduce a per-publish fee.
3. Only then write code. Start with a **Stripe Payment Link** — created in the
   Stripe dashboard, dropped into the page as a URL. No SDK, no webhook, no
   checkout page. Move to Stripe Checkout + webhooks only when the manual step
   becomes the bottleneck.
4. Write a new decision entry that supersedes 0004. Do not edit 0004.

**What is already in place for this:**

- `Organizer.isVerified` survives in the v2 schema and is the hook for paid
  verification / featured placement. It is granted by hand today and costs nothing.
- Nothing else. There is no dormant payment code, no feature flag, no unused
  columns — by design.

## Why it wasn't done now

The site has no users: v1's data is not migrated, and cold start is being handled
by partnering with Munich e.V.s and city bodies, all free. Charging the supply side
during cold start would shrink the scarcer side of a two-sided marketplace. Running
costs are close to zero, so nothing forces the question yet.

## Related

- `docs/decisions/0004-no-monetisation-during-cold-start.md`
- `docs/research/2026-09-german-volunteering-market.md`
- Board task P0-4 (the decision that produced this), P5-4 (needs a non-payment sort
  order for the event list)
