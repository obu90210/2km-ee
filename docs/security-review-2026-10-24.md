# Security review — 24 October 2026

Scope: the public static portfolio, its browser scripts and deployment assets, and the local preview. An independent read-only review checked DOM injection, URLs/hash handling, clipboard behavior, and the preview boundary. No concrete DOM injection issue was found. This is a code review and targeted verification, not a certification or exhaustive penetration test.

## Changes and evidence

| Area | Finding | Resolution |
| --- | --- | --- |
| Content policy | Inline styles and external font origins were permitted | External CSS and locally hosted font files allow strict same-origin policies without inline exceptions |
| Browser injection boundary | Future string-based DOM sinks were not restricted | Enforce Trusted Types with no policy creation; scripts use DOM creation and text assignment |
| Deployment | Exclusion rules required anticipating private filenames | Default-deny `.assetsignore` permits only the reviewed public manifest and hosting headers |
| Local preview | Requests using a foreign Host were accepted | Require loopback/localhost and the actual listener port; regression tests reject other hosts/ports |
| Vulnerability contact | Contact used a different organisation domain | Use the portfolio contact, a canonical disclosure URI, UTF-8 plain text and a current expiry |
| Account-level TLS | Live handshakes accepted TLS 1.0 and 1.1, alongside 1.2/1.3 | Recommended minimum is 1.2. Owner explicitly chose on 24 October 2026 to leave the setting unchanged for now; revisit when requested |

The font is Barlow Semi Condensed by the Barlow Project Authors, downloaded unmodified from the official Google Fonts distribution. Original CSS: https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@400;700;900&display=swap. Font licence is shipped as `assets/barlow-semi-condensed-license.txt`; authoritative licence: https://github.com/google/fonts/blob/main/ofl/barlowsemicondensed/OFL.txt.

All runtime scripts, styles, images and fonts are first-party. The site has no forms, visitor accounts or third-party analytics. Theme storage holds only the theme preference. Clipboard writes occur only after the visitor activates Copy link; clipboard reads remain disabled. HTTPS, HSTS, anti-framing, MIME-sniffing protection, opener/resource policies and permissions restrictions remain in place.

The existing photo archive and its unfinished Worker feature are outside this release. They stay off the public asset list. Before a future archive release, review the secret setup, access behavior, and headers returned directly by the Worker: static `_headers` rules do not apply to Worker-generated responses.

## Verification and limitations

Post-deployment results are recorded in `release-2026-10-24.md`: live checks passed and Mozilla Observatory reported A+ / 145 (12 passed, 0 failed). The separate account-level TLS setting is explicitly deferred by the owner.

- `node tools/check.mjs`: project/evidence/metadata consistency, restricted public wording, scripts, fragments and packaging.
- `node tests/security.test.mjs`: public manifest, local font signatures/licence, external/inline resource restrictions, CSP/Trusted Types and disclosure metadata.
- Existing experience/sharing checks plus preview HTTP tests: rendering geometry, sharing/fallback behavior, private paths, method restrictions, headers and hostile Host requests.
- Isolated browser verification: desktop and phone themes, reduced motion, no JavaScript, no overflow at 320/390/1440px, correct story scenes and no runtime/resource errors.
- Check actual production responses after deployment; repository headers alone do not prove enforcement. An external scan must be reported with its date and actual result, without inferring broader application security from a grade.

LLM discoverability remains factual: semantic HTML, readable content without scripts, canonical URLs, JSON-LD, sitemap and `llms.txt`. No ranking instructions, fabricated endorsements or security badges were added.

## Prior state and rollback

Prior production revision: `ae7fb619d9d8874877f92d67b65c70e7eafa5e88`. Prior public HTML and selected security headers were captured in the ignored local release checkpoint before the change. Git retains the prior asset bundle and headers.

If verification fails, revert only this portfolio/security release commit on `master`, then push the revert to the existing Cloudflare deployment. Verify the prior content and headers are restored. Do not reset or discard unrelated archive work, or publish its gate/config as part of rollback. A security rollback must be explicit because it restores the previous, more permissive policy.

References: [Cloudflare static asset headers](https://developers.cloudflare.com/workers/static-assets/headers/), [asset ignore format](https://developers.cloudflare.com/workers/static-assets/binding/), [style attributes and CSSOM](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src-attr), [Trusted Types enforcement](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/require-trusted-types-for), [security.txt format](https://www.rfc-editor.org/rfc/rfc9116.html).

## Cloudflare settings checklist

For this static Workers portfolio. No dashboard setting was changed in this session. Public-response observations below were checked on 24 October 2026; a working response does not identify the exact dashboard toggle that produced it. The TLS minimum remains unchanged by the owner's explicit choice.

| Setting | Intended configuration | Observation / action |
| --- | --- | --- |
| Workers deployment | Keep the existing GitHub connection to `obu90210/2km-ee`, production branch `master`, and the existing `2km.ee` custom domain | Push-to-deploy and the public domain were verified. Continue using the existing Worker; no replacement service is needed |
| SSL/TLS → Edge Certificates → Minimum TLS Version | **1.2 when the owner resumes TLS hardening** | TLS 1.0/1.1 currently accepted. **Explicitly deferred: leave unchanged for now** |
| SSL/TLS → Edge Certificates → TLS 1.3 | On | Successful TLS 1.3 handshake verified |
| SSL/TLS → Edge Certificates → Always Use HTTPS | On | `http://2km.ee/` returned 301 to `https://2km.ee/` |
| HSTS and security response headers | Keep the repository `_headers` policy authoritative; avoid conflicting dashboard header overrides | Live HSTS is `max-age=63072000; includeSubDomains; preload`; strict CSP and the other security headers were verified. A duplicate dashboard HSTS configuration is unnecessary |
| DNSSEC | Enable and complete the registrar DS-record step | No parent DS record or authenticated resolver answer was observed. Cloudflare-side toggle was not inspected. Coordinate the DS record with the current registrar and verify the complete chain |
| WAF / managed protection | Retain existing protection and private-path blocking; use targeted rules instead of a global JavaScript challenge for ordinary portfolio visitors | Twelve private/unpublished paths were denied. Dashboard rules were not inspected |
| AI Crawl Control | Allow intended search and user-initiated assistant crawlers | Requests with ChatGPT-User, OAI-SearchBot, Claude-User and GPTBot user agents returned 200. This verifies those request probes, not every crawler's source IP or rule. Training permissions are a separate owner choice |
| Cloudflare-managed robots.txt | Off; keep the repository policy in control | Live robots.txt exactly matched the deployed repository file; no managed-content block or active Content-Signal directive was present |
| Speed → Settings → Content Optimization → Rocket Loader | Off | Preserve the deliberately blocking theme script and strict CSP; no loader is required |
| Security → Settings → Client-side abuse → Email Address Obfuscation | Off for this site | Contact is intentionally public, including security.txt. Avoid adding a decoder script to the static page |
| Web Analytics / Zaraz / injected third-party tools | Off for this portfolio unless explicitly redesigned and approved | Current public copy promises no third-party analytics; the strict policy intentionally allows no such resource or connection |
| Cache rules / browser TTL | Keep Workers' normal static-asset caching and respect the deployed revalidation headers | Homepage returned `public, must-revalidate, max-age=0`. Avoid a blanket long-lived HTML cache override that delays updates |
| Account security | Use MFA/passkey and appropriately scoped credentials when account/API access is configured | Account controls were not available for inspection. No new credentials are required merely to host the current static page |

The current Worker serves static assets directly; there is no separate origin server to configure for this portfolio. Leave unrelated origin, email-routing and DNS records unchanged. The unpublished archive/gate requires its own configuration review before a future release.

Cloudflare references: [Minimum TLS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/minimum-tls/), [TLS 1.3](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/tls-13/), [HTTPS redirect](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/), [DNSSEC and registrar coordination](https://developers.cloudflare.com/registrar/get-started/enable-dnssec/), [crawler actions](https://developers.cloudflare.com/ai-crawl-control/features/manage-ai-crawlers/), [Rocket Loader](https://developers.cloudflare.com/speed/optimization/content/rocket-loader/enable/), [email obfuscation](https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/), [CSP compatibility](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/content-security-policies/).
