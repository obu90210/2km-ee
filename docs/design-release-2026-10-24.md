# Kidise kange application — 24 October 2026

## Scope

Applied the owner's selected Barlow Semi Condensed / Atkinson Hyperlegible Next pairing and Midnight/copper palette, with a corresponding linen light theme. Enlarged supporting text and made the narrow header and hero links wrap naturally. The credits/security pages, favicon and social sharing image follow the same design. The short vertical accent is limited to the wordmark.

The 31 project records, measurement definitions, photography, interaction and animation scripts are unchanged. Theme preference and reduced-motion behaviour are preserved. Local project `CLAUDE.md` was updated and remains ignored. Public design rules live in `docs/design.md` and `AGENTS.md`.

## Verification before publication

- Static content, experience geometry, sharing, preview/security boundaries and design checks pass.
- Text/status colour roles exceed 4.5:1 on both reading surfaces; the minimum is 4.93:1 in light and 6.72:1 in dark. Control borders and focus roles exceed 3:1. Dark photo/canvas scenes have a separate bright focus role and navy backing ring.
- Browser inspection covered 1280px desktop and 390px/320px phone widths, both themes, selected-work scenes, category filtering and direct project fragments. No horizontal page overflow or browser warnings/errors were observed. The browser requests reduced motion, so normal-motion preservation is supported by unchanged script bytes and the existing geometry tests, rather than a new moving browser capture.
- The social card was rendered from its HTML/CSS source, inspected, and saved as an actual 1200×630 PNG. A regression check verifies its signature and dimensions.
- Independent review identified the export format and dark-scene focus issues; both were reproduced with failing checks and corrected.
- All 258 pre-existing archive/gate files retain their original hashes. The owner's archive-only `_headers`/`robots.txt` edits and separate deployment files are not part of this release.

## Publication and rollback

The previous published revision is `3743e474267876f29fca797e6e147bdd35826a52`. Publish only the reviewed design paths through the existing GitHub `master` deployment. After publishing, verify live assets, typography, social image and security headers. To roll back, revert only the design release commit and push the revert; retain unrelated owner work.
