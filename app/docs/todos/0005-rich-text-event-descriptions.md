# 0005 — Decide whether event descriptions need rich text

Opened: 2026-09-10
Area: `src/components/EventForm.tsx`, event detail page

## What needs doing

`Event.description` is plain text: a multiline field in the form, rendered with
`whiteSpace: 'pre-wrap'` on the detail page. Line breaks survive; nothing else does
— no headings, lists, bold, or links.

The migration board called for replacing v1's `react-quill` with Tiptap. That was
skipped for now, deliberately.

Reopen when organisers actually ask for formatting — most likely for lists ("bring
gloves, sturdy shoes, a filled water bottle") or a link to their own signup notes.

When it comes up:

1. Prefer a **constrained** editor over a general one — bold, italic, lists, links,
   nothing else. A volunteering listing does not need headings or tables, and every
   allowed tag is a tag the sanitiser has to get right.
2. Store the HTML, and **sanitise it server-side on write**, not on render. v1
   sanitised with DOMPurify at render time in the browser, which means the database
   held whatever was submitted.
3. Update the detail page to render it, and drop `whiteSpace: 'pre-wrap'`.
4. Migrating existing plain-text descriptions is a one-line escape-and-wrap.

## Why it wasn't done now

Rich text is the least load-bearing part of publishing an event, and it is the part
that carries an XSS surface: v1's react-quill stored HTML that had to be scrubbed
before it could be shown. Plain text removes that surface entirely and costs three
fewer dependencies. Adding it later is additive — the field type does not change.

## Related

- `src/components/EventForm.tsx` — the comment at the top of the component
- Board task P5-6
