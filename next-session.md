# Portfolio refresh — 18 September 2026

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
