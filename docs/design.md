# Kidise kange on 2km.ee

The owner selected “06 — Familiar & clear” from the personal design studies. Kidise kange combines condensed Barlow headings, accessible reading type, midnight and copper, and licensed Estonian landscape photography. The November refinement applies three design-system practices to this identity. Give recurring decisions named tokens, define when each component variant belongs, and verify the rendered result with real content and interaction states.

`style.css` defines the portfolio's shared colour, type, layout and control tokens. `experience.css` applies them to the home page and owns scene-specific styling. The live HTML is the reference for native component markup. Resolve design drift in these files and update this guide when a rule changes.

## Typography

- Barlow Semi Condensed: 900 for the page title, section headings and figures, 700 for subheadings, the hero statement and project names.
- Atkinson Hyperlegible Next: 400 for body, navigation and filter labels, 600 for emphasis and primary or utility controls.
- Body text starts at 20px with 1.6 line spacing. Supporting labels use at least 18px; photo attribution uses 16px. Decorative canvas lettering is supplementary to the accessible HTML captions.
- All fonts are served locally. The SIL Open Font Licences are included in `assets/`. Atkinson files are the unmodified Google Fonts distribution, with Latin and extended Latin subsets.

## Colour and decoration

The Midnight & copper foundation uses navy `#151f2b`, linen `#f6eee1` and copper `#e7a46e`. The light reading theme uses a darker copper `#8a4825` for text, maintaining contrast on linen. Raised surfaces, statuses, controls and focus outlines have separate semantic roles in `style.css`.

One short vertical accent sits beside the wordmark. Avoid patterned horizontal bands, repeated vertical rails, and decorative marks on every card. The design takes colour cues from Mihkli clothing and the local landscape; it does not reproduce a historical costume pattern or claim a traditional pattern as a new invention.

`tests/design.test.mjs` verifies text/status contrast of at least 4.5:1 and control/focus contrast of at least 3:1 on both reading surfaces. Theme selection honours a valid saved preference and otherwise defaults to light, including when storage or JavaScript is unavailable. The landscape scenes use their own dark surface, legible overlay and bright focus ring in both themes.

## Layout and components

| Pattern | Rule |
| --- | --- |
| Reading sections | Start headings, introductions and content on the same edge. Use the shared page width, responsive gutters and section spacing. Keep long introductions within the reading measure. |
| Photo-led hero | Put the name first, then role and location, statement, explanation, and actions. Concentrate the desktop overlay behind the copy and use a vertical overlay on narrow screens. Keep the landscape visible and credit it within the scene. |
| Primary and secondary links | Use a filled copper control for the hero's pilot link. Use an underlined text link for its secondary action and plain text for header navigation. Keep one clear primary action in a group. |
| Utility buttons and filters | Use a 4px radius and at least 44px height. Use a border for utility controls. Pair a raised surface and copper edge with `aria-pressed` for the selected filter. Keep focus visible and test longer labels at phone widths. |
| Evidence | Place figures on the reading surface in aligned columns. Stack them with horizontal separators on phones. Keep each figure with its label, definition and date. |
| Project index | Use native disclosure rows with a visible focus state. With motion enabled, the row moves on hover and keyboard focus and the disclosure marker rotates when opened. |

Use authentic photography and project-specific diagrams for visual interest. Let the typography and composition group related content before adding a panel, badge or decorative mark. Add new variants only when a recurring use calls for them.

The migration replay uses the dark scene palette for a fictional invoice and its run log. Keep each step in HTML with a stable fragment. The script switches the visible step and manages focus. Keep the real case citation separately labelled and readable with or without the clipboard.

## Motion, sharing and maintenance

Preserve the strength and timing of the photo parallax, hero illustration, knowledge flow, selected-work illustrations and project index through visual refinements. Agree motion changes with the owner. Pause motion and the operating system's reduced-motion preference take priority. Page content remains ordinary HTML and readable without scripts.

The credits and security pages use the same fonts and theme roles. The social card source is `docs/og-card.html` plus `docs/og-card.css`; export and inspect `og-image.png` at 1200×630 after visual changes.

Run the checks listed in the README, then inspect both themes at desktop and phone sizes. Check keyboard focus, touch targets, active filters, project links, disclosure and the page with JavaScript disabled. The sitemap modification date also records changes to the published page layout. Evidence and copy review dates record their own reviews. Keep the separate archive work outside a portfolio release. Roll back by reverting the design release commit and pushing the revert.
