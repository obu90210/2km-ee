# Portfolio refresh — 18 September 2026

## Scroll-driven data journey
- Replaced the rejected five looping banners with one sticky canvas: scattered bits → streams → branching systems → network → converged signal. Ordinary page scrolling scrubs the transformation in either direction, anchored to the four main sections. No scroll interception or continuous animation loop.
- Geometry lives in journey-geometry.js; rendering, scroll tracking and accessibility controls in journey.js. Existing copy, typography and theme colours remain unchanged.
- Pause control freezes the scene. Reduced motion gives a static non-sticky network; no JavaScript retains assets/data-stream.png as the static fallback. Native content and links remain accessible.
- Pre-change production commit: 68967e3. Rollback by reverting this change and pushing the revert; preserve unrelated work.

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
