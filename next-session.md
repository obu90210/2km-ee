# Portfolio handover — 24 October 2026

## Published and verified

Code release `acf551f4bc19775f417f4f3e59f5743c64e87f5f` is pushed to `master` and verified live. Mozilla Observatory: A+ / 145, 12 passed, 0 failed (scan 130637628). Actual production checks passed for content/CSP, 16 public assets, 12 denied private paths, four crawler agents and seven browser configurations. Full verification and the remaining account-level TLS action: `docs/release-2026-10-24.md`. Owner archive/gate files remain unchanged and outside the release. The local master matches the remote after the release.

## Current refresh

- Final owner boundary: public development narratives describe guides, conventions, references and workflows. Updated matching metadata/diagram labels; renamed project 17 to Development Review (`#development-review`). The prior entry name/fragment was deliberately removed rather than retained as a public alias. Shared instructions and the content check prevent restoring the restricted wording.

- Owner follow-up: added daily macOS, Windows and Linux use to About, Person metadata, `llms.txt` and the project-local `CLAUDE.md`.

- Owner follow-up: added use of a shared GPU AI box and fully local models on his own PC's graphics card to the About section, Person metadata and `llms.txt`; project-local `CLAUDE.md` records this too. No model brands, hardware specifications or internal addresses were inferred.

- This checkout is based on the September design (`ae7fb61`); it was fast-forwarded from the stale July version after checkpointing the owner's work. The owner explicitly authorised commit/push to `master` for the existing Cloudflare deployment, with security review/hardening included before release. Git records the final release revision; validate the current live page rather than assuming rollout from a push alone.
- Security hardening: locally hosted licensed Barlow subsets; external stylesheets; same-origin CSP with no inline exceptions and Trusted Types; default-deny public-asset manifest; preview Host validation; personal-domain security contact and a plain-language security page. Independent code review found no DOM injection issue or remaining material finding. Details, commands and rollback: `docs/security-review-2026-10-24.md`.
- Owner decision: leave Cloudflare's current TLS minimum unchanged for now (24 October 2026). The probe accepted legacy 1.0/1.1 as well as 1.2/1.3. This is a deliberate deferral, not an outstanding approval request or deployment blocker. Revisit when the owner resumes TLS hardening. The complete Cloudflare settings checklist is at the end of `docs/security-review-2026-10-24.md`; public DNSSEC lookup also found no authenticated chain, with no parent DS record.
- The knowledge service and customer chatbot now lead the portfolio. Added native HTML results cards, measurement definitions, and the knowledge → retrieval → cited answer → review workflow. Selected stories now run Customer Chatbot, Jedi Archives, Holocron, Autotests Portal; illustration labels/rendering follow each story's attributes.
- Figures are separately dated historical operations snapshots: 1,142 public turns / 320 source-click turns (28%) over 25 September–8 October; 43,583 indexed records on 20 October. Definitions and update procedure: `docs/evidence.md`. No fresh production aggregate query succeeded during the assessment; do not describe these as current/live figures. No visitor conversations or identifiers were inspected.
- HTML, JSON-LD, `llms.txt`, social-card source/image, and sitemap were aligned. Other project delivery statuses remain explicitly historical. Codenames, photography credits, permanent project IDs, strict CSP and no-JavaScript reading remain.
- Added `README.md`, `tools/check.mjs`, `tools/preview.mjs` and preview tests. Preview binds loopback and only serves public assets; repository notes, scan reports, gate/config and photo archive return 404. `.assetsignore` preserves the owner's earlier exclusions and adds local tooling/documentation exclusions.
- Project-local `CLAUDE.md` was updated, with its private legend preserved and contradictory instructions removed. Global assistant instructions were not changed. Superseded local June/July notes moved into ignored `docs/superpowers/archive/`.

## Verification for this refresh

- Content check passed for 31 records, category counts, matching descriptions/statuses, IDs/assets, evidence values/dates, scene mapping, CSP-compatible scripts and packaging exclusions.
- Existing experience geometry and sharing tests passed; preview server tests passed for public assets, private-path blocking, common security headers, HEAD and method restrictions. Archive-specific noindex headers are not applied to the preview homepage.
- Isolated Chrome checks passed for seven combinations: desktop light/dark (1440px), phone light/dark (390px), small phone with reduced motion (320px), desktop reduced motion, and phone without JavaScript. Verified no horizontal overflow, all 31 entries and evidence available, contact links, correct theme and normal-motion scene tracking, and no browser runtime/resource errors.
- Fixed the 320px About flow overflow by stacking its steps at very small widths. Desktop/mobile hero/results and dark selected-work screenshots were visually inspected. Social preview regenerated and inspected at 1200×630.
- Browser interaction confirmed Automation filter shows 4 projects with correct pressed state; a direct Jedi Archives link restores all 31 and opens the target. Sharing success/denied/missing clipboard paths remain covered by the existing tests.
- An independent read-only review found no material implementation or data issues. Review requested regeneration/visual checks, which were subsequently completed.
- All 258 existing owner archive/gate files matched their pre-sync SHA-256 hashes. Existing crawler restrictions and archive-only header changes were preserved.

## Release scope and continuity

- Portfolio changes: `.assetsignore`, `AGENTS.md`, `README.md`, `index.html`, `experience.css`, `experience.js`, `llms.txt`, `sitemap.xml`, `og-image.png`, `docs/og-card.html`, `docs/evidence.md`, `next-session.md`, `tools/`, `tests/preview.test.mjs`.
- Separate existing owner work: `2002/`, `gate/`, `wrangler.toml`, plus the archive changes in `_headers` and `robots.txt`. Do not stage everything together or incidentally publish the archive feature. Retain its configuration/secret checks as a separate release.
- The project-local private `CLAUDE.md` stays ignored and was updated for this release; do not commit it. Public instructions live in `AGENTS.md`; update that file for durable shared rules.
- `node tools/preview.mjs` starts a local public-assets-only preview. A preview may already be running at `http://127.0.0.1:8123/` from this session.
- Cloudflare publishes pushes to `master`; the owner has authorised this release. Review the exact staged paths and run the five checks before pushing. `_headers` has security changes plus the owner's separate archive stanza: stage only the security changes, retaining the archive stanza locally. Roll back by reverting only the release commit; do not reset the owner's parallel work.

---

## Previous handover — 18 September 2026

## Project sharing correction
- Replaced the misleading “Link to this project” action with a progressively enhanced Copy link button on all 31 entries. It copies the canonical portfolio fragment, confirms success visibly and through an accessible status, and presents a selected read-only URL if copying fails. Without JavaScript, the ordinary anchor reads “Permanent link”.
- The prior Permissions-Policy blocked clipboard writes. Only clipboard-write now permits self; clipboard reads remain disabled and CSP is unchanged.
- Verified 31 canonical URLs, success/reset, denied and missing clipboard fallbacks with node tests/sharing.test.mjs; existing geometry and static consistency checks pass. Browser preview confirmed copying and mobile layout without overflow.
- Prior production state: 121209f. Rollback by reverting the sharing correction commit and pushing the revert to master; preserve unrelated changes.

## Current expressive redesign
- Owner rejected the single sticky data strip and authorised a larger redesign, citing scroll-driven storytelling and full-width photography. Real Estonian nature photographs are now used: Viru bog opening and Käsmu coastal interlude. See public photo-credits.html and docs/photography.md for licences.
- Multiple independent interactions: photo parallax, drawn knowledge-flow path, sticky crossfading project illustrations, a 31-point linked constellation that follows filters, contact line art, and reading progress. The work illustrations are conceptual, not live monitoring.
- experience.js, experience-geometry.js and experience.css replace the old journey modules. No continuous animation loop, scroll interception, framework or new dependency. Canvas work is skipped offscreen.
- Normal reading, native project details and contact links work without JavaScript. Reduced motion disables parallax and sticky illustration tracking; Pause motion freezes scroll-linked artwork.
- Verified desktop/mobile in both themes, 31-point/category count agreement, native project opening from a constellation link, no horizontal overflow, no console errors and a no-JavaScript preview. Geometry/markup tests: node tests/experience.test.mjs. Static data/metadata checks remain unchanged.
- Pre-change production commit: f1ed726. Rollback by reverting this redesign commit and pushing the revert, preserving unrelated work.

## Latest visual revision
- Owner rejected the field-journal treatment. Replaced it with reference-led Barlow Semi Condensed typography (400/700/900), a centred hero, open navigation, pill controls and spacious rounded sections. Existing light/dark colour tokens are unchanged.
- Removed serif headlines, monospaced labels and heavy editorial rules. Kept factual content, all 31 project records and machine-readable metadata intact.
- Desktop and 390px mobile views inspected; light/dark, filter counts, pressed state, fragment opening and overflow checks passed. Static consistency, contrast and private-reference checks passed. Social preview regenerated at 1200×630.
- Prior production state: commit 840f119. Rollback this visual revision by reverting its commit and pushing the revert, preserving unrelated work.

## Earlier content changes
- Added a clear role statement, four selected-work narratives, a complete project index and direct contact links.
- All 31 project descriptions shortened; removed unverified scale, adoption, performance and security claims. Status labels identify the previous July 2026 snapshot; the invoicing work is labelled a prototype.
- Added Codex alongside the existing Claude workflow without rewriting historical implementation credit.
- HTML, JSON-LD, plain text and social preview aligned. Added accessible filter feedback and fragment opening.
- Shared instructions now live in AGENTS.md. Public repository documentation contains no private codename mappings. Documentation excluded from static assets via .assetsignore.

## Remaining editorial work
- Verify current delivery statuses with each project owner before replacing the snapshot labels.
- Add independently shareable evidence and quantified outcomes only when confirmed and cleared for publication.
- Add a verified LinkedIn profile if provided. GitHub profile is linked.
- Search Console/Bing indexing and external profile links remain separate account tasks; no ranking or recommendation guarantee.

## Verification before publishing
- Desktop and mobile layout inspected in light/dark themes; no mobile horizontal overflow.
- Category filtering, accessible feedback and project links that restore hidden entries passed.
- With JavaScript blocked, all 31 entries remain available, native expansion works and contact links remain usable.
- Static checks passed for JSON-LD/HTML/plain-text consistency, unique IDs, fragment targets, script placement, text contrast and private-reference scanning.
- Social image regenerated as a 1200×630 PNG.

## Operational boundary
- This refresh was prepared in an isolated checkout to leave an existing photo-archive feature untouched. Do not stage unrelated local files when continuing.
- For rollback, revert the portfolio refresh commit and push the revert to master; never reset unrelated local work.
