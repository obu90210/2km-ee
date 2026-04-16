# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website / AI project portfolio for Kaupo Karuse at `2km.ee`. Single static HTML page — no build tools, no frameworks, no dependencies.

## Development & Deployment

- Edit `index.html`, push to `master`, Cloudflare auto-deploys (usually within seconds)
- **GitHub repo**: `obu90210/2km-ee`
- **Hosted on**: Cloudflare Workers (static assets)
- **Custom domain**: `2km.ee`
- No build step, no tests, no linting — just HTML/CSS/JS in one file

## Content Rules

- All real company/product/customer names are **anonymized with Star Wars codenames** (see HTML comment at top of `index.html`)
- When adding or editing project bubbles, keep the anonymization consistent — never use real company names
- The page must render correctly **without JavaScript** (bubbles visible by default, JS adds animations progressively)

## Security Files

- `_headers` — security response headers (HSTS, CSP, X-Frame-Options, etc.). Requires Cloudflare to process; if headers don't appear, configure via Cloudflare Transform Rules instead
- `_routes.json` — intended to block `.git` access; may not work on Workers (use Cloudflare WAF rule as primary block)
- `.well-known/security.txt` — security researcher contact info

## DNS & Email (Cloudflare)

- Domain managed in Cloudflare, DNS proxied
- MX: Cloudflare Email Routing (`kaupo@2km.ee` forwards to personal inbox)
- Send-as configured via Gmail using `smtp.gmail.com`
- SPF authorizes both Cloudflare (receiving) and Google (sending)

## Known Gotchas

- Custom domain must be added from **Worker side** (Settings > Domains & Routes), not just DNS — otherwise Cloudflare returns 522
- If Cloudflare says "domain already in use" when adding Custom Domain, delete the existing DNS record first — Cloudflare needs to create it itself
- `_headers` and `_routes.json` are Cloudflare Pages features — they may not be processed by Workers. Always verify headers with `curl -sI` after deploying
- `.git` directory is exposed by the Worker deployment — blocked at Cloudflare WAF level, not by `_routes.json`
