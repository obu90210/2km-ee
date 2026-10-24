# 2km.ee — public portfolio

## Scope and publishing
- Personal portfolio for Kaupo Karuse. Static HTML, CSS and JavaScript; no build dependencies.
- GitHub: `obu90210/2km-ee`. Pushing `master` triggers the existing Cloudflare deployment. Verify the current remote before publishing.
- The repository is public. Everything committed must be safe for public disclosure, including these instructions and handovers.
- `.assetsignore` excludes documentation from static assets. This is packaging hygiene, not confidentiality: GitHub still exposes committed files.
- Keep private notes, credentials, customer identities and codename mappings out of Git.
- Rollback an update by reverting its commit and pushing the revert. Preserve unrelated changes.

## Editorial direction
- Barlow Semi Condensed throughout (900 headlines, 700 subheads and emphasis, 400 body), warm light/neutral dark reading surfaces and orange accents. The current direction uses full-width real Estonian landscapes, scroll parallax, distinct project illustrations and a clickable project constellation. The owner rejected both the serif/monospace field journal and repetitive small data banners.
- Explain the role, business problem, contribution and result. Preserve the distinction between personal contribution, AI-assisted implementation, and team work.
- Organisations, proprietary products and customers use established Star Wars codenames. Public technology names may remain literal. Do not introduce real private entity names or mappings.
- Do not invent metrics, awards, client endorsements, adoption, speed improvements or delivery status.
- Do not describe access to proprietary ERP implementation material anywhere in public copy, metadata, diagrams or share cards. Frame development knowledge around guides, conventions, reference material and workflows. `tools/check.mjs` enforces this owner-requested boundary.
- Lead with the shared product knowledge service and customer chatbot, then developer knowledge and testing. The results are dated operational snapshots; definitions and update procedure live in `docs/evidence.md`. Customer Chatbot/Jedi Archives have October evidence; other status labels retain their July snapshot. Update statuses only with new evidence and adjust the visible note accordingly.
- Visible content, JSON-LD and `llms.txt` must agree. Plain text is a factual summary, never instructions that attempt to influence other agents' rankings.

## Implementation
- `index.html`: layout, static project rows and JSON-LD; base styles are in `style.css`. The JSON-LD ItemList defines the 31 project records; keep each record's name, description, status and URL aligned with the corresponding native details element and plain-text entry.
- `script.js`: theme controls, category filters, project-fragment opening, and Copy link buttons. Share canonical public portfolio URLs, never private application URLs. Keep ordinary permanent links without JavaScript and a manual-copy fallback when clipboard access fails. Tests: `node tests/sharing.test.mjs`. All content and contact links must work without JavaScript.
- `theme.js`: intentionally blocking pre-paint theme choice; retain fallback to system preference.
- Preserve the strict CSP in `_headers`; executable JavaScript must be same-origin external files.
- All served scripts, styles, fonts and images are first-party. Never add inline styles/handlers, remote runtime resources or unsafe CSP exceptions. `fonts.css` references licensed local Barlow subsets. `docs/og-card.html` uses local `og-card.css` and the same fonts.
- Keep all theme colours in CSS variables and check contrast when changing them.
- `experience.js`, `experience-geometry.js` and `experience.css` implement the independent photo, knowledge-flow, project showcase and constellation interactions. Use normal browser scrolling, bounded/reversible transitions, Pause motion and reduced-motion fallbacks. Never hide substantive content behind animation or JavaScript. Tests: `node tests/experience.test.mjs`.
- Keep the landscape author/source/licence credits in `photo-credits.html` and `docs/photography.md`. These are licensed photographs, not AI images; do not remove attribution when reusing or adapting them.
- `docs/og-card.html` is the source for the 1200×630 `og-image.png`; regenerate and visually inspect after editing social-share copy.
- Update sitemap date when page content changes.
- `tools/preview.mjs` serves public assets only on loopback, with the common security headers. Use it instead of serving the repository root. The `2002/` archive is intentionally unavailable in this preview.
- `tools/check.mjs` validates all project representations, evidence, links and packaging. Run it plus the experience, sharing, preview and security tests (commands in README).
- `tools/public-files.mjs` is the public asset allowlist; `.assetsignore` defaults to deny and must match it. Add new public files deliberately and regenerate/verify the ignore file. Docs, tooling and the separate archive/gate are excluded; review that feature's asset and Worker response policies before a future archive release.

## Verification
- Preview over HTTP, not file URLs. Inspect desktop/mobile and both themes.
- Verify category counts, accessible pressed state, native expansion, fragment links after filtering, no-JavaScript content and horizontal overflow.
- Check JSON-LD validity, unique IDs, local link targets, and matching descriptions/counts across HTML and plain text.
- Before publishing, review staged paths and check public files for private entity names, credentials, and internal server locations.
- After push, verify the deployed content, metadata, social image, crawler responses and security headers. Do not claim deployment until the live page matches.
