# 0009 — Recurring events: a series plus one Event per date

Status: Accepted
Date: 2026-09-07

## Context

v1 had `Event.isRegular: Boolean` and `Event.isRegularUntil: Date`. Both are dead:
they appear in the model and in `eventController.createEvent`'s passthrough, and
**nowhere else in the codebase** — no page sets them, no page reads them. They also
cannot express anything useful, because there is no frequency: "repeats until
December" without saying how often. P2 carried the pair into the v2 schema, which
was a mistake — porting two fields that encode nothing.

The question that decides the design is **what a volunteer applies to**. If an
application points at the series, then "accepted" has no meaning (accepted for
every Saturday, forever?), `peopleNeeded` has no meaning (8 per week or 8 in
total?), attendance cannot be recorded per date, and a review has no date to
attach to. So applications must point at a specific date — and once that is true,
so must capacity, attendance and reviews.

## Decision

**`EventSeries` holds the rule; each date is an ordinary `Event` with
`series` pointing back at it.**

A one-off event has `series: null` and behaves exactly as before. The list page,
applications, reviews, capacity and attendance need no concept of recurrence at
all — they only ever see a concrete `Event`. This is the shape calendars use, so it
also matches what people expect.

Settled parameters:

- **Frequencies:** weekly, fortnightly (`freq: WEEKLY, interval: 2`), and monthly on
  the nth weekday (`bySetPos: 1…5` or `-1` for the last). Not supported: a fixed
  day of the month ("the 15th"), several times a day, or exception dates.
- **The rule is a structured subset, not a raw RRULE string.** Field names and
  ranges map one-to-one onto RFC 5545 (`FREQ`, `INTERVAL`, `BYDAY`, `BYSETPOS`,
  `UNTIL`, `COUNT`), so `.ics` export or a move to a full RRULE library later is a
  translation, not a data migration.
- **Capacity is per occurrence.** Six people needed this Saturday, six the next.
- **A volunteer applies to one occurrence at a time** — the soonest future one that
  is neither cancelled nor already full. Skipping full dates rather than blocking
  keeps one popular Saturday from shutting the whole series until it passes.
- **Generation horizon: 3 months**, capped at 60 occurrences per batch. A weekly
  series materialises about 13 dates.
- **Top-up is lazy.** This stack has no scheduler, so `materialiseSeries()` runs when
  a series is created or edited and when its occurrences are read. A unique partial
  index on `(series, startDate)` makes it idempotent, and inserts run unordered so a
  colliding date from a concurrent top-up does not abort the batch.
- **Editing means "this occurrence" or "this and future".** Never "all" — that would
  rewrite dates that have already happened, along with their applications and
  reviews. Generation copies the latest occurrence forward as its template, so
  editing the future is what changes what gets generated.
- **Cancelling one date sets `Event.isCancelled`** rather than deleting the
  document, so people who were already accepted can see that this date is off.

## Alternatives considered

- **One event with a free-text schedule.** Cheapest, and what v1 half-built.
  Rejected: a recurring event could not be filtered by date, could not appear in "my
  events" for the right week, and could not be applied to per date.
- **Store the rule only, expand on read.** No occurrence documents at all. Rejected:
  the event list filters, sorts and paginates by date, and MongoDB cannot do that
  against dates that do not exist as documents. The core page would be the first
  casualty.

## Consequences

- **The series' IANA timezone is load-bearing.** Adding seven days to a UTC instant
  moves a 10:00 event to 09:00 or 11:00 across Germany's DST switches. Occurrences
  are computed in the series' local time and stored as UTC instants. There are tests
  for both boundaries; do not "simplify" the expansion to UTC arithmetic.
- A series whose `until` is beyond the horizon is never fully materialised. Anything
  that assumes "all occurrences are in the database" is wrong — ask the series.
- Deleting a series must decide what happens to occurrences with applications
  against them. Cancelling them is the safe default; hard deletion loses the record
  of who was accepted.
- `count` counts from the start of the series, so expansion always starts there.
  With a 3-month horizon that is cheap; a series running for years would want a
  stored counter instead.
