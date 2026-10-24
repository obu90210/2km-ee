# Kidise kange on 2km.ee

The owner selected “06 — Familiar & clear” from the personal design studies. This application keeps the established portfolio layout, licensed Estonian landscape photography and progressive enhancement.

## Typography

- Barlow Semi Condensed: 900 for headings and figures, 700 for project names.
- Atkinson Hyperlegible Next: 400 for body and controls, 600 for emphasis.
- Body text starts at 20px with 1.6 line spacing. Supporting labels use at least 18px; photo attribution uses 16px. Decorative canvas lettering is supplementary to the accessible HTML captions.
- All fonts are served locally. The SIL Open Font Licences are included in `assets/`. Atkinson files are the unmodified Google Fonts distribution, with Latin and extended Latin subsets.

## Colour and decoration

The Midnight & copper foundation uses navy `#151f2b`, linen `#f6eee1` and copper `#e7a46e`. The light reading theme uses a darker copper `#8a4825` for text, maintaining contrast on linen. Raised surfaces, statuses, controls and focus outlines have separate semantic roles in `style.css`.

One short vertical accent sits beside the wordmark. Avoid patterned horizontal bands, repeated vertical rails, and decorative marks on every card. The design takes colour cues from Mihkli clothing and the local landscape; it does not reproduce a historical costume pattern or claim a traditional pattern as a new invention.

`tests/design.test.mjs` verifies text/status contrast of at least 4.5:1 and control/focus contrast of at least 3:1 on both reading surfaces. Theme selection honours a valid saved preference and otherwise defaults to light, regardless of the operating-system theme. Light also applies when storage is unavailable or JavaScript is disabled. The landscape scenes retain their own dark surface and light text in both themes.

## Motion, sharing and maintenance

The photo parallax, knowledge flow, selected-work illustrations and project constellation retain their existing JavaScript and reduced-motion behaviour. Page content remains ordinary HTML. Do not hide substantive content behind motion or scripts.

The credits and security pages use the same fonts and theme roles. The social card source is `docs/og-card.html` plus `docs/og-card.css`; export and inspect `og-image.png` at 1200×630 after visual changes.

Run the checks listed in the README, then inspect both themes at desktop and phone sizes. Keep the separate archive work outside a portfolio release. Roll back by reverting only the design release commit and pushing the revert.
