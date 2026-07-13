# 2km.ee Redesign — "The Index"

**Date:** 2026-07-13
**Status:** Approved by Kaupo (mockup review via visual companion)
**Replaces:** the current "Twilight Violet" glassmorphism bubble-grid design

## Problem

The current design is the statistical-average AI portfolio: dark violet gradient,
glassmorphism cards, shimmer gradient hero text, emoji icons, floating orbs, pill
filter buttons. A free low-quality model produced nearly the same layout unprompted —
proof it reads as "generated", not designed. The site must convey engineering
substance with distinctive visual character, without Star Wars-themed visuals
(codenames stay, theming does not).

## Chosen direction

**The Index** — a Swiss print catalog. Light warm paper, strong typography, projects
as numbered ruled rows instead of cards. Considered and rejected: "The Manifest"
(service-registry terminal aesthetic — its own trope, cold for non-technical
visitors; its neutral dark palette survives as the dark theme) and "The Broadsheet"
(newspaper editorial — high copywriting cost, reads "writer" not "engineer").

Reference mockup: `.superpowers/brainstorm/1904-1783969674/content/index-refined.html`
(local only, git-ignored).

## Layout

Single page, top to bottom:

1. **Topline** — mono caps `2KM.EE — AI & AUTOMATION PORTFOLIO` left, theme toggle
   button right.
2. **Masthead** — name in Archivo 900 uppercase (clamp 56–104px, tight leading),
   one-sentence pitch with bolded key phrases, right-aligned mono facts block
   (location · `31 PROJECTS · 26 LIVE` · obfuscated email). Heavy 3px rule below.
3. **Filter line** — text-only mono links with counts (`ALL 31 / AI INFRASTRUCTURE 7 / …`),
   active = vermillion + underline. No pills, no buttons.
4. **Column header row** — mono caps: `№ / PROJECT / WHAT IT IS / CATEGORY / STATUS`.
5. **The index** — all 31 projects, one ruled row each:
   - № (mono, vermillion, 01–31, ordered as the current page order)
   - Project name (Archivo 700); featured projects get a vermillion ★ (replaces
     the 2-column `.featured` treatment)
   - One-line description
   - Category (mono caps)
   - Status (mono caps), mapped 1:1 from the current site's five statuses:
     `active → LIVE` (`--live` green), `design → DESIGN` (`--warn` amber),
     `paused → PAUSED` (`--faint`), `blocked → BLOCKED` (`--blocked` red),
     `complete → DONE` (`--muted`). Pulsing dots deleted; the colored word is the indicator.
   - Click expands the row **in place**: long description paragraph, full
     `STACK — …` mono line, optional external link. **The modal dies.**
6. **More/footer** — heavy rule, mono line: name · codename disclaimer
   ("NAMES ARE CODENAMES · THE WORK IS REAL") · obfuscated email.

**Mobile (≤720px):** column headers hidden; each row becomes a stacked block
(№ + name / description / category / status), detail indents under the number.

## Typography & color

Fonts (Google Fonts — already CSP-allowed origins): **Archivo** 400–900,
**IBM Plex Mono** 400–600. All metadata/labels are Plex Mono with letter-spacing;
all reading text is Archivo.

All colors as CSS custom properties on `:root` — **no hardcoded accent values
anywhere else** (fixes the current site's rgba-drift gotcha).

| Token | Light (default) | Dark |
| --- | --- | --- |
| `--paper` | `#f4f0e6` | `#16171c` |
| `--paper-raise` (hover/expanded) | `#ece5d4` | `#1f2027` |
| `--ink` | `#191510` | `#ece7db` |
| `--muted` | `#57503e` | `#a49d8c` |
| `--faint` | `#6d6656` | `#918c7e` |
| `--hair` (rules) | `#d9d2bf` | `#2e3038` |
| `--accent` (vermillion) | `#b73809` | `#f2683c` |
| `--live` | `#1a6b3c` | `#4ac97e` |
| `--warn` (amber) | `#855c00` | `#d8a53a` |
| `--blocked` | `#8f1d1d` | `#e25a5a` |

No gradients, no glass, no glows, no violet. Accessibility: all text tokens verified ≥ 4.5:1 (WCAG AA small text) against both `--paper` and `--paper-raise`; accent/warn (light) and faint (dark) were bumped once more at implementation time after the hover-background check.

## Theme toggle

- Default follows `prefers-color-scheme` via CSS media query (works with no JS).
- Toggle button (topline, mono, `◑ DARK` / `◐ LIGHT`) sets `data-theme` on `<html>`
  and persists to `localStorage`.
- FOUC prevention without violating CSP (no inline scripts): a tiny same-origin
  `theme.js` loaded **blocking in `<head>`** applies the stored theme before first
  paint. Main `script.js` stays at end of body.

## Interaction & progressive enhancement

- **Rows are native `<details>`/`<summary>`** — expansion works with JS disabled.
  `summary` styled as the grid row (list-marker removed). Keyboard/focus semantics
  come free.
- **Filters need JS** (as today). Without JS: all rows simply visible — page fully
  readable, same rule as the current site.
- **Motion:** none beyond hover background and the details expansion. Count-up
  animations, orbs, shimmer, floating shapes are deleted. `script.js` shrinks to:
  theme toggle, filters, obfuscated-mailto assembly (keep the existing
  `data-u`/`data-d` pattern).

## Content model changes

Per project, the bubble `data-*` model is replaced by real HTML:

- `data-detail` → visible-when-open `<p>` inside the details panel (**SEO win:
  long descriptions become crawlable text instead of attributes**).
- `data-alltech` → the `STACK — …` mono line (full list; the tag-teaser and `+N`
  chip logic die).
- `data-cat` → stays (filter hook), values unchanged (`infra/web/test/integ/auto/other`).
- `data-url` → optional link inside the panel.
- Emoji icons: deleted.

All 31 projects and codenames carry over verbatim (titles, taglines, details,
tech lists, categories, statuses). Anonymization rule unchanged — real-name grep
before deploy.

## SEO / metadata

- JSON-LD `@graph`, `llms.txt`, `sitemap.xml`: regenerate from the new markup
  (same data, so mostly unchanged; verify `numberOfItems` = 31 and masthead facts
  match).
- `<meta name="description">`, OG/Twitter tags: keep text, unchanged.
- **og-image**: re-render the 1200×630 card in Index style (paper, Archivo,
  vermillion) via the existing headless-Chrome method; commit.
- `_headers`, CSP, robots.txt, security.txt: **untouched**. New design introduces
  no new external origins.

## Constraints (unchanged)

Static site, no build step; content files become `index.html` + `script.js` + tiny `theme.js`. Strict CSP —
no inline scripts (inline styles/`<style>` allowed). Renders correctly without
JS. Star Wars codenames everywhere, no real names in any committed file.

## Out of scope

The discoverability backlog (`docs/discoverability-todo.md`) — About block,
identity graph, Search Console — stays parked. The masthead pitch + footer
partially cover the About/contact intent.

## Success criteria

1. Side-by-side with any "make me a portfolio" LLM output, the page is
   unmistakably different (light, typographic, ruled index — no cards).
2. Theme toggle works, persists, defaults to system preference, no flash.
3. JS disabled: full content readable, rows expandable, correct theme.
4. Mozilla Observatory score unchanged (A+), zero CSP console violations.
5. Real-name grep over `index.html` + `llms.txt` + `sitemap.xml` is clean.
6. Lighthouse: no regression vs current site.
