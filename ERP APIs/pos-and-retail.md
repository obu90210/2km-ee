# Point of sale, retail, hospitality

Surveyed 2026-09-21. Confidence marks A–D explained in `README.md`.

Estonia has no fiscalisation requirement, so there is no regulated receipt-data channel of
the kind Latvia, Lithuania, Poland or Italy have. POS data stays private to each vendor,
which is why this segment is markedly more closed than accounting.

## Summary

| Vendor | Public docs | Conf. |
|---|---|---|
| Erply | `learn-api.erply.com` | **A** |
| CompuCash (Ektaco) | none found; integrations exist | **C** |
| NOOM (Astro Baltics) | none found | **D** |
| Others (R-Keeper, Poster, Tillhub, ScanPOS) | not established as present here | **D** |

---

## Erply — **A**

The only Estonian POS vendor with a real developer story.

- Docs: `https://learn-api.erply.com/`
- Opened to third-party developers in 2010, which is early by any standard.
- Classic general-purpose API plus newer REST/JSON microservices, each with its own Swagger.
- Auth: username and password exchanged for a session key.
- Endpoint discovery through `getServiceEndpoints`; account-specific endpoints.
- Covers POS, inventory, CRM, reporting — retail, wholesale and hospitality.
- Public code at `github.com/erply`.

Effectively the reference implementation for openness in Estonian retail software, and the
only POS system here that can be integrated without a vendor conversation.

## CompuCash / Ektaco — **C**

- Long-established Estonian POS and time-tracking vendor, strong in hospitality and retail.
- Confirmed live integrations: Bolt Food, Wolt, Directo, Merit.
- Those integrations prove an interface exists. No public developer documentation was found.
- Support runs through `ektaco.ee/en/helpcenter/` rather than a developer portal.

Reachable, but only through the vendor. Treat as a partnership, not an integration.

## NOOM / Astro Baltics — **D**

- POS full-stack since 1998, extendable with the NOOM business software modules.
- Also sells self-service kiosks, payment terminals and access systems.
- No public API documentation found.

## Everything else

Restaurant POS brands used in Estonia (R-Keeper, Poster, Tillhub) and ScanPOS did not
surface with either an Estonian presence or API documentation in this pass. Not evidence of
absence — the search was shallow. Re-check before concluding anything.

---

## Reading of the list

- **One open system, one reachable system, the rest closed.** POS is the weakest segment for
  anyone wanting broad programmatic coverage.
- **No fiscalisation means no shortcut.** In Latvia and Lithuania, fiscal requirements force
  structured receipt data into a known shape. Estonia has nothing equivalent, so receipt-level
  data here is only ever obtained per vendor.
- **The delivery platforms did the integration work already.** Bolt Food and Wolt forced
  CompuCash and others to build interfaces. Those interfaces exist; they are just not
  published. That is a negotiation problem, not an engineering one.
- **Erply is the wedge** for anything POS-shaped, and it reaches beyond Estonia.
