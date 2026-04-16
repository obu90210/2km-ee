# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal website / AI project portfolio for Kaupo Karuse at `2km.ee`. Single static HTML page — no build tools, no frameworks, no dependencies.

## Development & Deployment

- Edit `index.html`, push to `master`, Cloudflare auto-deploys (usually within seconds)
- **GitHub repo**: `obu90210/2km-ee`
- **Hosted on**: Cloudflare Workers (static assets)
- **Worker URL**: `2kmee.kaupokaruse-073.workers.dev`
- **Custom domain**: `2km.ee`
- No build step, no tests, no linting — just HTML/CSS/JS in one file

## Content Rules

- All real company/product/customer names are **anonymized with Star Wars codenames** (see HTML comment at top of `index.html`)
- When adding or editing project bubbles, keep the anonymization consistent — never use real company names
- The page must render correctly **without JavaScript** (bubbles visible by default, JS adds animations progressively)

## DNS (Cloudflare)

- Domain managed in Cloudflare (DNS Setup: Full, SSL/TLS: Flexible)
- `2km.ee` / `www.2km.ee` → Worker (Proxied)
- MX: Cloudflare Email Routing
- SPF: `include:_spf.mx.cloudflare.net include:_spf.google.com`
- DMARC: `v=DMARC1; p=none;`

## Email

- **Cloudflare Email Routing**: `kaupo@2km.ee` forwards to personal inbox
- **Send as**: configured via Gmail "Send mail as" using `smtp.gmail.com`
- SPF authorizes both Cloudflare (receiving) and Google (sending)

## Known Gotchas

- Custom domain must be added from **Worker side** (Settings > Domains & Routes), not just DNS — otherwise Cloudflare returns 522
- If Cloudflare says "domain already in use" when adding Custom Domain, delete the existing DNS record first — Cloudflare needs to create it itself
- SSL/TLS is set to **Flexible** — correct for Workers origin. Don't change to Full/Strict without reason
