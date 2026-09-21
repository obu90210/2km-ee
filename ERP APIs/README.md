# ERP APIs — Estonian business software API survey

Working research notes: which business software used in Estonia exposes an API, and
which of those publish developer documentation that anyone can read without a contract
or a partner login.

## Why this exists

Any product that reads a company's ledger, stock, sales or payroll out of the system it
already lives in has to answer one question first: how many of these systems can actually
be read, and how much friction is there per system. This folder is the answer, kept as a
maintained list rather than a one-off memo.

Second driver: Estonia's B2B e-invoicing mandate is expected in 2027, with EN 16931 as the
format. Every vendor below has to move, and the ones without an open interface will move
slowest. That is where integration work concentrates.

## Files

| File | Covers |
|---|---|
| `accounting-and-erp.md` | Accounting, ERP, work management, MRP |
| `pos-and-retail.md` | Point of sale, retail, hospitality |
| `einvoicing-and-documents.md` | E-invoice operators, EDI, document capture |
| `banking-and-payments.md` | Bank APIs, PSD2, payment gateways |
| `state-registries.md` | Registers and state services |

## Method and its limits

Compiled 2026-09-21 from public web search. **Documentation pages were not opened** —
outbound fetching was blocked in the environment this was written in. Every URL here came
from a search result, so treat URLs as "reported to exist", not "confirmed to load".

Nothing here involved signing up, calling an endpoint, or reading a contract. Rate limits,
pricing, licence-tier gating and write support are mostly unverified.

## Confidence legend

| Mark | Means |
|---|---|
| **A** | Public docs found, and search results described the mechanics (auth, format, base URL) |
| **B** | API confirmed to exist, docs public but thin, or docs location uncertain |
| **C** | API referenced only indirectly (through a partner's integration guide); no public docs found |
| **D** | No evidence of a public API; likely partner-gated or project-based integration |

## Before relying on any row

1. Open the doc URL and confirm it loads without a login.
2. Check whether the API is gated behind a licence tier (Merit gates it behind Pro/Premium).
3. Check read vs write scope — several of these read fine and write poorly.
4. Check whether a contract with the vendor is needed on top of the customer's consent.
5. Check the terms on redistributing customer data pulled through the API.

## Open questions

- Which vendors gate the API behind a paid tier, and at what price.
- Which expose a general ledger / trial balance, as opposed to only documents.
- Which support webhooks or change feeds, as opposed to polling only.
- What each vendor's 2027 EN 16931 plan is, and whether it opens new endpoints.
- Installed-base sizes per vendor, to weight integration effort.

## Maintenance

Add a row, mark its confidence, date it. Do not upgrade a confidence mark without opening
the page. This folder is excluded from the deployed site via `.assetsignore`.
