# Decisions

A log of choices made in this project that a future session — human or agent — could not reasonably reconstruct just by reading the code. It's the "why", not the "what". Agent sessions don't share memory with each other, so this is the only reliable source of "why" across sessions.

**Skim the index below before making a non-obvious call in an area that already has entries. When you make one, add an entry in the same change.**

- One file per decision: `NNNN-short-slug.md`, numbered sequentially.
- **Append-only**: don't edit an old entry when a decision changes — open a new one and mark the old entry's `Status` as `Superseded by NNNN`. The history itself is information; it stops the same tradeoff from being relitigated blind.
- Copy [`_template.md`](_template.md) to start a new entry.

## Index

| #                                              | Title                                                          | Status   |
| ---------------------------------------------- | -------------------------------------------------------------- | -------- |
| [0001](0001-rewrite-volme-on-this-template.md) | Rewrite VolMe on this template, with no backward compatibility | Accepted |
| [0002](0002-cloudflare-r2-for-file-storage.md) | Store uploads on Cloudflare R2, not AWS S3                     | Accepted |
