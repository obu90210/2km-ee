# Bank APIs, PSD2, payment gateways

Surveyed 2026-09-21. Confidence marks A–D explained in `README.md`.

Two distinct things get called "bank API" here and they are not interchangeable:

- **PSD2 / open banking** — regulated account access. Reading it as a third party requires
  an AISP or PISP licence, or an agreement with a licensed provider. Free at the point of
  use, heavily constrained in what it allows.
- **Corporate gateways** — contractual bank-to-ERP channels for statements, payment files
  and balances. No licence needed, but a bank contract per customer.

For anything reading a company's own data with that company's consent, the corporate
gateway is usually the right road and the regulatory one is a detour.

## Summary

| Provider | Channel | Public docs | Conf. |
|---|---|---|---|
| LHV | LHV Connect (corporate) | `partners.lhv.ee/en/connect/` | **A** |
| LHV | Open banking (PSD2) | `partners.lhv.ee/en/open-banking/` | **A** |
| SEB Baltics | Developer portal | `developer.baltics.sebgroup.com` | **A** |
| Swedbank | Gateway + PSD2 | not confirmed | **B** |
| Luminor | PSD2 | not confirmed | **B** |
| Coop Pank | PSD2 + bank link | not confirmed | **B** |
| Maksekeskus / MakeCommerce | Payment gateway | vendor site + merchant portal | **A** |
| Montonio | Payment gateway | not confirmed | **B** |
| EveryPay | Payment gateway | not confirmed | **B** |

---

## LHV — **A**

Two separate, separately documented channels, which is rare and useful.

- **LHV Connect**: `https://partners.lhv.ee/en/connect/` — a public API for integrating
  banking services directly into customer software. Corporate channel, contractual.
- **Open banking**: `https://partners.lhv.ee/en/open-banking/` — the PSD2 surface.
- Note: `docs.lhv.com/home/connect` documents **LHV Bank Limited (UK)**, a different entity
  from LHV Pank (EE). Do not mix the two specifications.
- Sandbox and developer registration available.

The most developer-legible bank in Estonia by a clear margin.

## SEB Baltics — **A**

- Portal: `https://developer.baltics.sebgroup.com/`
- Baltic-wide, covering Estonia, Latvia and Lithuania from one portal — the only bank here
  that treats the three markets as one developer surface.
- Scope not enumerated in this pass; expect PSD2 plus corporate services.

## Swedbank, Luminor, Coop Pank — **B**

All three are confirmed present in Estonian open banking and all offer bank links as a
payment method. Developer portal URLs were not confirmed in this pass. Swedbank Gateway is
the corporate channel name to search for; it did not surface with a URL here.

Swedbank and SEB are the two largest banks in Estonia, so their gateways carry the most
transaction volume regardless of how well documented they are.

## Maksekeskus / MakeCommerce — **A**

- Site: `https://makecommerce.net/`, merchant portal `merchant.maksekeskus.ee`
- Described as publicly available and well documented.
- Credentials: Shop ID, Secret Key, Public Key, issued in the merchant portal.
- First-party modules for WooCommerce, Magento 2, Shopify, OpenCart, PrestaShop.
- One contract covers both bank links and card payments.
- Stronger on card payments than on bank links.

## Montonio — **B**

- Estonian gateway, strongest position in bank links, which are roughly 80 percent of
  Estonian online payments.
- Documentation exists and is widely used by integrators; the URL was not confirmed here.

## EveryPay — **B**

- Estonian gateway with an API-first positioning.
- Documentation location not confirmed in this pass.

---

## Reading of the list

- **Bank links dominate Estonian payments**, at roughly 80 percent of online volume. Any
  payment-adjacent product that treats cards as primary has misread the market.
- **LHV is the only bank that documents a corporate channel and a PSD2 channel separately
  and publicly.** For reading a business customer's transactions with their consent, LHV
  Connect is the shortest path.
- **SEB's Baltic-wide portal is the efficient way to cover three countries**, and the only
  place that structure exists.
- **Watch the entity trap**: LHV Pank (Estonia) and LHV Bank Limited (UK) publish different
  specifications at different domains.
- **PSD2 is not the default answer.** It is licensed, scope-limited and built for consumer
  account aggregation. Business data at document level lives in the corporate gateways.
