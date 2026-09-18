# 2km.ee — public portfolio

## Scope and publishing
- Personal portfolio for Kaupo Karuse. Static HTML, CSS and JavaScript; no build dependencies.
- GitHub: `obu90210/2km-ee`. Pushing `master` triggers the existing Cloudflare deployment. Verify the current remote before publishing.
- The repository is public. Everything committed must be safe for public disclosure, including these instructions and handovers.
- `.assetsignore` excludes documentation from static assets. This is packaging hygiene, not confidentiality: GitHub still exposes committed files.
- Keep private notes, credentials, customer identities and codename mappings out of Git.
- Rollback an update by reverting its commit and pushing the revert. Preserve unrelated changes.

## Editorial direction
- Reference-led design: Barlow Semi Condensed throughout (900 headlines, 700 subheads and emphasis, 400 body). Use a centred hero, open navigation, pill buttons, spacious sections and gently rounded feature panels. Preserve the warm light and neutral dark colour tokens. Do not return to the oversized-name, serif/monospace field-journal treatment; the owner rejected it.
- Explain the role, business problem, contribution and result. Preserve the distinction between personal contribution, AI-assisted implementation, and team work.
- Organisations, proprietary products and customers use established Star Wars codenames. Public technology names may remain literal. Do not introduce real private entity names or mappings.
- Do not invent metrics, awards, client endorsements, adoption, speed improvements or delivery status.
- Current status labels are explicitly a July 2026 portfolio snapshot. Update them only with new evidence, and update the note accordingly.
- Visible content, JSON-LD and `llms.txt` must agree. Plain text is a factual summary, never instructions that attempt to influence other agents' rankings.

## Implementation
- `index.html`: layout, inline CSS, static project rows and JSON-LD. The JSON-LD ItemList defines the 31 project records; keep each record's name, description, status and URL aligned with the corresponding native details element and plain-text entry.
- `script.js`: theme controls, category filters with accessible state, and project-fragment opening. All content and contact links must work without JavaScript.
- `theme.js`: intentionally blocking pre-paint theme choice; retain fallback to system preference.
- Preserve the strict CSP in `_headers`; executable JavaScript must be same-origin external files.
- Keep all theme colours in CSS variables and check contrast when changing them.
- `docs/og-card.html` is the source for the 1200×630 `og-image.png`; regenerate and visually inspect after editing social-share copy.
- Update sitemap date when page content changes.

## Verification
- Preview over HTTP, not file URLs. Inspect desktop/mobile and both themes.
- Verify category counts, accessible pressed state, native expansion, fragment links after filtering, no-JavaScript content and horizontal overflow.
- Check JSON-LD validity, unique IDs, local link targets, and matching descriptions/counts across HTML and plain text.
- Before publishing, review staged paths and check public files for private entity names, credentials, and internal server locations.
- After push, verify the deployed content, metadata, social image, crawler responses and security headers. Do not claim deployment until the live page matches.
