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
| Account-level TLS | Live handshakes accepted TLS 1.0 and 1.1, alongside 1.2/1.3 | Requires Cloudflare Minimum TLS Version = 1.2; no authenticated account connection was available in this session, so the owner was asked to apply it. Verify separately from the repository release |

The font is Barlow Semi Condensed by the Barlow Project Authors, downloaded unmodified from the official Google Fonts distribution. Original CSS: https://fonts.googleapis.com/css2?family=Barlow+Semi+Condensed:wght@400;700;900&display=swap. Font licence is shipped as `assets/barlow-semi-condensed-license.txt`; authoritative licence: https://github.com/google/fonts/blob/main/ofl/barlowsemicondensed/OFL.txt.

All runtime scripts, styles, images and fonts are first-party. The site has no forms, visitor accounts or third-party analytics. Theme storage holds only the theme preference. Clipboard writes occur only after the visitor activates Copy link; clipboard reads remain disabled. HTTPS, HSTS, anti-framing, MIME-sniffing protection, opener/resource policies and permissions restrictions remain in place.

The existing photo archive and its unfinished Worker feature are outside this release. They stay off the public asset list. Before a future archive release, review the secret setup, access behavior, and headers returned directly by the Worker: static `_headers` rules do not apply to Worker-generated responses.

## Verification and limitations

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
