# Accounting, ERP, work management

Surveyed 2026-09-21. Confidence marks A–D explained in `README.md`.

## Summary

| Vendor | Public docs | Format | Auth | Conf. |
|---|---|---|---|---|
| Standard Books | `api-docs.excellent.ee` | HTTP, register-oriented | per install | **B** |
| Directo | `wiki.directo.ee` | XML + JSON | token | **A** |
| Merit Aktiva / Palk | `api.merit.ee` | REST / JSON | HMAC-SHA256 | **A** |
| SmartAccounts | PDF spec on vendor site | REST | signed request | **A** |
| SimplBooks | support portal only | REST | API user token | **B** |
| Erply | `learn-api.erply.com` | REST / JSON | session key | **A** |
| Scoro | `developers.scoro.com` | REST / JSON | API key + app id | **A** |
| Katana | vendor site | REST | key | **B** |
| Pipedrive | `developers.pipedrive.com` | REST | OAuth / token | **A** |
| e-Financials | `abiinfo.rik.ee` | documented | see registry notes | **A** |
| Taavi Tarkvara | none found | — | — | **D** |
| NOOM / Astro Baltics | none found | — | — | **D** |
| Bilnex | none found | — | — | **C** |
| Uku | none found | — | — | **C** |
| AccountStudio | none found | — | — | **D** |

---

## Standard Books — **B**

- Docs: `https://api-docs.excellent.ee/` — published as an open documentation site.
- Starting point given by the product owner as the least friction of any system here.
- Register-oriented rather than resource-oriented: the API reflects the ERP's own register
  structure, which is an advantage for anyone who already knows those registers and a
  steep wall for anyone who does not.
- Not verified here: whether the docs require a login, which registers are exposed, whether
  writes are supported, and how auth is issued per installation.
- Distinguishing trait: the same data model underlies Standard ERP installs in many
  countries, so an integration built once is not Estonia-only.

Next check: open the docs, list exposed registers, confirm whether a trial balance or
general ledger is reachable rather than only documents.

## Directo — **A**

- Docs: `https://wiki.directo.ee/et/liidestamine`, `https://wiki.directo.ee/en/api_direct`,
  `https://wiki.directo.ee/et/xml_direct`, `https://wiki.directo.ee/et/xmlcore`
- Public DokuWiki, Estonian and English, no login reported.
- Two generations side by side: the older XML Direct interface and a newer API that returns
  JSON or XML depending on the `Accept` header.
- Auth: a token replaces the older pairing of `appkey` plus database name. Token sent by
  POST in a `TOKEN` variable. Older calls use `key=[appkey]` with
  `Content-Type: application/x-www-form-urlencoded`.
- Writes supported: `put=1`, `what=order`, `xmldata=[XML]`.
- Also documents its own RIK e-arveldaja e-invoice integration at `wiki.directo.ee/et/rik`.

Strongest documentation of any Estonian-owned ERP in this list. Wide functional coverage
beyond accounting: production, CRM, projects, document management.

## Merit Aktiva and Merit Palk — **A**

- Docs: `https://api.merit.ee/merit-aktiva-api/`, `https://api.merit.ee/merit-palk-api/`,
  reference manual at `https://api.merit.ee/connecting-robots/reference-manual/`,
  auth page at `.../reference-manual/authentication/`, FAQ at `https://api.merit.ee/faq/`
- Versioned PDF specs also published: `merit.ee/juhend/muud/Merit_Aktiva_API_specification.pdf`
- REST over HTTP with JSON, UTF-8, timestamps as `yyyyMMddHHmmss`.
- Base: `https://aktiva.merit.ee/api/v1/` plus endpoint, with `ApiId`, `timestamp` and
  `signature` as query parameters.
- Auth: HMAC-SHA256 over `apiId + timestamp + httpBody`, keyed with the company's API key,
  base64 encoded. Admin generates and resets the pair under Settings → API Settings.
- **Gated: API access requires the Pro or Premium licence tier.** This matters for coverage
  — the cheapest Merit customers cannot be reached at all.
- A separate payroll API (Merit Palk) exists, which is unusual in this market.

Merit claims the largest installed base in Estonia, so this is the highest-volume target
despite the licence gate.

## SmartAccounts — **A**

- Public spec PDF: `smartaccounts.eu/uuskodu2015/wp-content/uploads/2021/03/SmartAccounts_API_2021_03_03.pdf`
  (version 1.1, dated 2021-03-03 — check for a newer revision)
- Vendor page: `smartaccounts.eu/et/abimaterjalid-ja-klienditugi/liidetud-teenused/api/`
- Auth: every request signed by the calling application with a secret key.
- Quirk worth noting: requests must be sent in Estonian time.
- A documentation portal at `docs.accounts.smartfintech.eu` also appeared in results.
  Unclear whether that is the current home or a different product — verify before citing.
- Known live integrations: Envoice, WooCommerce, ShopRoller, Uku, Bilnex.

## SimplBooks — **B**

- No standalone developer portal found. Guidance lives in the support site:
  `support.simplbooks.ee/en/kasutusjuhendid/what-is-api-and-how-it-works/`
- Auth: create an API user under Seaded → Kasutajad → Uus kasutaja, toggle "API kasutaja",
  save, and read the generated token.
- Integration surface is real and broad even if the docs are thin: WooCommerce, Shopify,
  Envoice, Telema, Banqup, Bilnex, Planlogi.

## Erply — **A**

- Docs: `https://learn-api.erply.com/`, wiki at `wiki.erply.com/article/1319-apis-overview`
  and `wiki.erply.com/fi/article/1333-json-api`
- Open to third-party developers since 2010 — the earliest and most deliberate API opening
  in this market.
- Two generations: a general-purpose classic API covering standard features, plus newer
  purpose-built REST microservices producing JSON.
- Auth: username and password exchanged for a session key used on subsequent requests.
- Endpoint discovery: call `getServiceEndpoints` to find the account's endpoint; each
  microservice endpoint ships its own Swagger, e.g.
  `api-json-eu10.erply.com/documentation/index.html`
- SDKs and sample code on GitHub under `github.com/erply`.

Covers both ERP and POS, so it appears in `pos-and-retail.md` too.

## Scoro — **A**

- Docs: `https://www.scoro.com/developers/`, API at `https://api.scoro.com/api/v2`
- Free developer programme; register an integration to get an AppId.
- Auth: `apiKey` or `user_token` in the JSON request body, plus an AppId sent as the
  `scoro-app-id` HTTP header for public integrations.
- Roughly 148 endpoints. Documented objects include invoices, orders, quotes, prepayments,
  purchase orders, finance accounts, VAT codes, products, projects, contacts, tasks.
- Official SDK: `github.com/Scoro-Software/Scoro-API-v2-SDK`

Work management rather than full accounting, but it holds invoices and quotes, so it is
relevant for receivables-shaped questions.

## Katana — **B**

- Estonian-founded manufacturing ERP (2017). Open API advertised on `katanamrp.com`.
- Developer docs location not confirmed in this pass.
- International customer base rather than Estonian, so low weight for a domestic play and
  high weight for anything sold outside Estonia.

## Pipedrive — **A**

- Docs: `developers.pipedrive.com` — fully public, OAuth, marketplace, sandbox.
- CRM, not accounting. Relevant only as pipeline data, not ledger data.
- Included because it is the reference example of how an Estonian-founded company documents
  an API when it intends an ecosystem to form.

## e-Financials / e-arveldaja (RIK) — **A**

State-provided accounting software for small companies. Developer documentation at
`abiinfo.rik.ee/en/e-financials/e-financials-api/technical-documentation-developers`.
Covered in `state-registries.md`.

## Low or no public API surface — **C** / **D**

| Vendor | What was found |
|---|---|
| Taavi Tarkvara | X-tee interface to the Tax Board, interfaces to e-invoice centres (Omniva, Fitek, Telema, Krediidiinfo) and access-control systems (Suprema, Protege, FoxSec). Payroll and HR. No public developer docs. **D** |
| NOOM / Astro Baltics | POS plus ERP modules, building POS since 1998. Rental from about EUR 79/month. No public API docs. **D** |
| Bilnex | Free e-invoice interface to Merit Aktiva, works through an API. Docs not public. **C** |
| Uku | Practice-management tool for accounting firms. Integrated with SmartAccounts and Bilnex. API presence implied, docs not public. **C** |
| AccountStudio | Listed among Estonian accounting packages. Nothing found on an API. **D** |

---

## Reading of the list

- **Four systems are genuinely open**: Directo, Merit, Erply, Scoro. Documented well enough
  that an integration can be scoped without talking to the vendor first.
- **One is open and uniquely accessible to us**: Standard Books, where the register model is
  already familiar. Verify the doc site first.
- **The long tail is closed.** Taavi, NOOM, CompuCash and the practice-management tools all
  integrate by project, not by API. Coverage of the Estonian market therefore plateaus well
  below 100 percent, and the remainder needs file exchange or a database-level read.
- **Merit's licence gate is the single biggest coverage constraint** in the accounting
  segment, because it excludes the cheapest tier of the largest vendor.
- **Auth is inconsistent**: HMAC signing, session keys, bearer tokens, signed requests, all
  different. Any aggregation layer absorbs five auth models before it covers five systems.
