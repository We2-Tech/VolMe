# 0004 — Give volunteers a way to hold a future occurrence

Opened: 2026-09-07
Area: events, applications, notifications

## What needs doing

A volunteer may only apply to the soonest open occurrence of a series
(`docs/decisions/0009-recurring-events-as-series-plus-occurrences.md`). Someone who
wants the Saturday three weeks out therefore has no way to hold onto it — they have
to remember, and come back.

Reopen when either shows up:

- Volunteers say they forgot about a date they meant to take, or ask to sign up
  further ahead.
- Organisers say they cannot plan because the roster only fills a week out.

Options, in the order worth trying:

1. **"Notify me when applications open."** One boolean per (user, occurrence), and a
   nudge the next time they load the site — no scheduler needed, same lazy pattern
   as series top-up. It has a job, which a bookmark list did not.
2. **Let a volunteer apply to the next N occurrences.** Removes the gap entirely,
   but brings partial acceptance ("you're in on the 14th, not the 21st") and the UI
   for it. That was deliberately deferred in 0009.
3. **Bring back a wishlist.** Rejected once already
   (`docs/decisions/0010-drop-the-wishlist.md`); only worth revisiting if people ask
   for saving in general, not just for this gap.

## Why it wasn't done now

The gap is narrow, and both good answers cost more than the problem currently
justifies — there are no users yet to say whether it matters. The wishlist that
would have papered over it was dropped for having no job of its own.

## Related

- `docs/decisions/0009-recurring-events-as-series-plus-occurrences.md`
- `docs/decisions/0010-drop-the-wishlist.md`
- Board tasks P4-2 (applications), P4-11 (series)
