# 2km.ee

Kaupo Karuse’s personal portfolio: ERP expertise, AI knowledge services, customer support, developer tools, and automation. Static HTML, CSS, and JavaScript. No build step or runtime packages.

## Working locally

Requires Node.js; verified with Node 24. Run from the repository root:

```powershell
node tools/preview.mjs
```

Open http://127.0.0.1:8123/. The preview serves an explicit list of website assets and the common production security headers. It does not serve repository documents, local notes, scan reports, deployment code, or the separate photo archive. Do not preview by serving the entire repository root.

## Checks

```powershell
node tools/check.mjs
node tests/experience.test.mjs
node tests/sharing.test.mjs
node tests/preview.test.mjs
node tests/security.test.mjs
node tests/design.test.mjs
```

The content check compares all 32 HTML project entries with JSON-LD and `llms.txt`, verifies dated measurements, counts, fragment links, local assets, story mappings, and packaging exclusions. The tests cover scroll geometry, project sharing/fallbacks, and private-path protection in the preview server. Inspect desktop and phone layouts in both themes before publishing; also check reduced motion and reading without JavaScript.

## Files

| Location | Purpose |
| --- | --- |
| `index.html`, `style.css` | Accessible page content, base styles, project index and structured data |
| `fonts.css`, `assets/*.woff2` | Locally hosted Barlow and Atkinson font subsets and licences |
| `experience.css` | Photography, selected-work scenes, results, responsive layouts |
| `script.js`, `theme.js` | Theme, filters, project links and sharing |
| `experience.js`, `experience-geometry.js` | Scroll-linked illustrations and project constellation |
| `assets/`, `photo-credits.html` | Locally served visuals and required photo attribution |
| `llms.txt`, `sitemap.xml`, `og-image.png` | Plain-text portfolio, crawler and sharing metadata |
| `docs/design.md` | Kidise kange typography, colour roles and visual rules |
| `docs/evidence.md` | Public measurement definitions and update procedure |
| `security.html`, `.well-known/security.txt` | Security design and vulnerability reporting |
| `docs/photography.md`, `docs/og-card.html` | Photo provenance and social-card source |
| `tools/`, `tests/` | Local checks and safe preview; excluded from site assets |
| `AGENTS.md`, `next-session.md` | Current project instructions and handover |

## Editing content

Keep each project's HTML entry, JSON-LD record, and `llms.txt` entry aligned. Keep permanent fragment IDs stable. When the selected stories change, their `data-illustration` and `data-caption` attributes drive the matching scene. All substantive content must remain available without JavaScript.

Results are dated operational observations, not live counters. Keep the measurement window, traffic exclusions, and unit definitions. Update visible figures, JSON-LD datasets, `llms.txt`, and `docs/evidence.md` together. Never turn source engagement into a claim about resolution or satisfaction.

Organisations, proprietary products, and customers use established Star Wars codenames. Private entity mappings, credentials, visitor conversations, and internal system locations do not belong in this public repository.

## Publishing

The established Cloudflare deployment follows GitHub `master`. A push there publishes the page. Preview and review first; a local edit does not authorise a commit or push.

`tools/public-files.mjs` is the explicit public-asset list used by the preview. `.assetsignore` defaults to denying all assets, then permits only that reviewed list and the Cloudflare headers file. The security test requires both to agree. Git ignores and asset excludes serve different purposes: a file committed to this public repository is public even when it is excluded from the website.

Browser scripts, styles, fonts and images are served locally. CSP rejects inline styles/handlers, application network connections and framing; Trusted Types blocks string-based DOM injection sinks. The preview also rejects foreign Host headers. Review details and verification: `docs/security-review-2026-10-24.md`.

The separate `2002/` photo archive and `gate/` worker are existing owner work. Preserve their routing, crawler restrictions, and secret-based access. Do not include them incidentally in a portfolio release. `wrangler.toml` changes require their own Cloudflare configuration check.

After an authorised release, verify the live content, security headers, social image, crawler responses and archive boundary. Roll back by reverting only the release commit and pushing the revert; retain unrelated changes.
