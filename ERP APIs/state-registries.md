# Registers and state services

Surveyed 2026-09-21. Confidence marks A–D explained in `README.md`.

The best-documented APIs touching Estonian business data are the state's, not the software
vendors'. They are also the only ones with a clear, published access process.

## Summary

| Service | Provider | Public docs | Conf. |
|---|---|---|---|
| e-Business Register open data API | RIK | `avaandmed.ariregister.rik.ee` | **A** |
| e-Business Register XML queries | RIK | `ariregister.rik.ee/est/xml_queries` | **A** |
| X-tee company services | RIK | `abiinfo.rik.ee` | **A** |
| e-Financials (e-arveldaja) API | RIK | `abiinfo.rik.ee/en/e-financials/...` | **A** |
| Company registration API | RIK | `rik.ee/en/e-business-register/company-registration-api` | **B** |
| Tax Board (MTA) | MTA | via X-tee | **B** |

---

## e-Business Register — open data and APIs — **A**

- Introduction: `https://avaandmed.ariregister.rik.ee/en/open-data-api/introduction-api-services`
- Bulk download: `https://avaandmed.ariregister.rik.ee/en/downloading-open-data` — public data
  on companies, non-profits, foundations and public bodies, in JSON and XML.
- XML query service: `https://ariregister.rik.ee/est/xml_queries` — intended for high query
  volumes or for keeping a local mirror.

Two named X-tee services:

| Service | Returns |
|---|---|
| `arireg.ettevotjaRekvisiidid_v1` | Name, registry code, address, VAT number — enough to raise an invoice |
| `arireg.detailandmed_v2` | Fullest company detail, regularly refreshed |

**Access requires a contract with RIK.** The bulk open data does not; the query services do.
That distinction decides the cost structure of anything built on top.

## e-Financials / e-arveldaja — **A**

- Developer documentation:
  `https://abiinfo.rik.ee/en/e-financials/e-financials-api/technical-documentation-developers`
- State-provided accounting software for small companies, free to a large population of
  micro-entities.
- Directo documents its own integration with it at `wiki.directo.ee/et/rik`, and Finbite lists
  it first among supported systems — so it has real installed weight, not just availability.

Notable: the state's own accounting package publishes developer documentation while most
commercial operators do not.

## Company registration API — **B**

`https://www.rik.ee/en/e-business-register/company-registration-api` — programmatic company
incorporation. Relevant to anyone building onboarding or corporate-services flows; niche
otherwise.

## Tax Board (MTA) — **B**

Reached through X-tee rather than a public REST portal. Taavi Tarkvara is documented as using
an X-tee interface to the Tax Board, which confirms the channel exists for software vendors.
Not surveyed in detail here.

---

## Reading of the list

- **The state is the best-documented data provider in this whole survey.** Where a commercial
  operator says "contact us", RIK publishes a service name and a contract route.
- **Two access tiers**: bulk open data is free and unrestricted; live query services need a
  RIK contract. Design around which tier a use case actually needs, because the free tier
  covers more than people assume.
- **e-arveldaja is an underrated integration target.** It is free, state-run, widely used at
  the small end, and it publishes developer docs. It is the only accounting system in Estonia
  where both the documentation and the customer acquisition problem are already solved.
- **Company identity is a solved problem here.** Registry code, VAT number and address come
  from a documented source, so no product needs to invent its own company master data.
