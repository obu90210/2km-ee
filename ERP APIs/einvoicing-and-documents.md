# E-invoice operators, EDI, document capture

Surveyed 2026-09-21. Confidence marks A–D explained in `README.md`.

## Why this segment matters most right now

Estonia's B2B e-invoicing mandate is expected in 2027, on EN 16931. Since 1 July 2025 any
VAT-registered buyer can already demand a structured e-invoice from a seller. Every operator
below is rebuilding against that deadline, and every accounting package has to connect to at
least one of them.

The operators are also the segment with the least public documentation, because their
customer is the software vendor, not the developer. Access is by contract.

## Operators in the Estonian market

Drawn from the integration lists published by the accounting vendors — a reliable way to
enumerate a market without asking the operators.

| Operator | Role | Public API docs | Conf. |
|---|---|---|---|
| Finbite | E-invoice operator (ex Omniva / Fitek) | none found | **C** |
| Telema | EDI and e-invoice | none found | **C** |
| Envoice | E-invoice and document capture | none found | **C** |
| CostPocket | Receipt and invoice digitisation | none found | **C** |
| Unifiedpost / Banqup | E-invoice operator | none found | **C** |
| FitekIN | Purchase-invoice workflow | none found | **D** |
| Bilnex | Free e-invoicing, Merit-focused | none found | **C** |
| Billberry | E-invoice | none found | **D** |
| Bauwise | Construction cost / invoice | none found | **D** |
| Docura | Document handling | none found | **D** |
| e-arveldaja (RIK) | State e-invoicing | **yes**, see `state-registries.md` | **A** |

---

## Finbite — **C**

- Formerly the Omniva e-invoicing business, earlier Fitek.
- Publishes its ERP integration list at `finbite.eu/e-arvete-liidesed/` — e-arveldaja, Merit,
  Directo and others.
- Auth pattern, as described in a client vendor's setup guide: an authentication code copied
  from the Finbite portal under General Settings → Data exchange with ERP.
- No public developer documentation found.

## Telema — **C**

- EDI operator, strongest in retail supply chains rather than general e-invoicing.
- Auth pattern, from SimplBooks' setup guide: a Channel ID plus an API key pasted into the
  accounting package.
- Documentation appears to be partner-gated.

## Envoice — **C**

- E-invoicing plus purchase-document capture.
- Auth pattern: API keys copied from the Envoice portal into the accounting package.
- Integrated with SmartAccounts and SimplBooks among others.
- No public developer documentation found.

## CostPocket — **C**

- Receipt and expense digitisation rather than invoice transport.
- Appears alongside Finbite in vendor setup guides; the two can run in parallel.
- No public developer documentation found.

## Unifiedpost / Banqup — **C**

- International operator with an Estonian presence.
- Integrated with SimplBooks and others.
- Group-level developer documentation may exist; not established in this pass.

---

## Reading of the list

- **This is the least documented and most commercially guarded segment**, and also the one
  with a legislated deadline. That combination usually means the operators are busy and
  under-resourced on partner onboarding.
- **The accounting vendors' integration pages are the market map.** Nobody publishes a list
  of Estonian e-invoice operators; the ERP vendors publish it accidentally, by documenting
  which ones they support.
- **Auth is uniformly "paste a key from our portal".** No OAuth, no scopes, no delegated
  access. Every integration is per-customer manual setup, which is exactly the friction the
  2027 mandate will make visible at scale.
- **The state operator is the only documented one.** e-arveldaja publishes developer
  documentation; the commercial operators do not. That asymmetry is worth watching.
