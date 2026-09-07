# 0003 — Start v2 on stock MUI components, with no theme styleOverrides

Status: Accepted
Date: 2026-09-07

## Context

v1's theme (`frontend/src/theme.js`) carried a `components` block of
`styleOverrides` for Button, ButtonGroup, Card, TextField, Dialog, AppBar, Drawer,
Link, ListItemIcon and Badge — pill-shaped buttons, 15px card corners, custom
outlined-input borders, and so on.

Most of it never ran. Everything from `MuiListItemIcon` downward was written as a
sibling of `createTheme`'s `components` key rather than inside it, so those
overrides were silently ignored for the lifetime of the project. What the v1 site
actually looked like was: stock MUI, plus the four overrides that happened to be in
the right place.

When P1 ported the theme, those four survivors were reproduced and two more were
added to match the apparent intent. That reproduced a look nobody had deliberately
designed — it was an artifact of a bug.

## Decision

The v2 theme carries **palette, color schemes and typography only**. No
`components` block, no `styleOverrides`, and no global `shape.borderRadius`
override — components render at MUI 9 defaults.

Per-screen styling goes in the `sx` prop on the component that needs it, during the
P5 page rewrites. A `styleOverrides` entry is only added back once the same
deviation has shown up on several screens and the design is settled.

## Alternatives considered

- **Port the four working overrides.** What P1 did. Rejected: it locks in a visual
  language derived from a bug, before a single real v2 screen exists to judge it
  against.
- **Design the full component layer now.** Premature — there is nothing to look at
  yet. Deferring costs nothing, because the overrides can be added centrally at any
  point without touching call sites.

## Consequences

- v2 will not look like v1 out of the gate: square-ish buttons with uppercase
  labels, 4px radii. That is expected, not a regression to "fix" by restoring the
  v1 file.
- If a screen needs a pill button today, write `sx={{ borderRadius: 999 }}` there.
  Don't reopen `theme.ts` for a one-off.
- Anyone reading `frontend/src/theme.js` as a reference should know most of it was
  dead code — do not treat it as a description of how v1 looked.
