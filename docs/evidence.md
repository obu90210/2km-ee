# Portfolio evidence

Page updated 1 November 2026. Chatbot figures were refreshed with a read-only production aggregate. Figures below are dated observations recorded in the maintainer’s project operations. They are not independently audited or automatically refreshed.

| Measure | Value | Observation period |
| --- | --- | --- |
| Public chat turns | 4,249 | 25 September 2026 00:00:00 UTC to 1 November 2026 20:04:09 UTC |
| Turns with a source click | 1,130, approximately 26.6% | Same chatbot window; denominator is all 4,249 public turns |
| Median answer completion | 10.4 seconds | Same chatbot window; 4,249 recorded timings |
| Median first token | 6.0 seconds | Same chatbot window; 4,183 recorded timings |
| Indexed knowledge records | 43,583 | Separate snapshot, 20 October 2026 |

The chatbot scope excludes staff/evaluation traffic and junk. A turn represents a recorded question or lookup. It is not a count of people, complete conversations, successful answers or resolved cases. A source click is engagement with a cited link or article card; it does not establish whether a ticket was avoided or the answer was correct.

The cutoff is 22:04:09 in Tallinn on 1 November; that day is partial. The window starts at midnight UTC, replacing the former 25 September 15:00–8 October snapshot rather than extending its exact start time. The figures therefore must not be used as a like-for-like growth comparison.

The aggregate used a read-only database transaction and the production reporting helpers for public traffic, the current configured office exclusion, and the stored non-junk flag. Source engagement counts each turn once when at least one associated source-click record exists, divided by all included turns; this differs from a rate calculated only over answers offering links. Timing medians use recorded total-request and request-to-first-token milliseconds, rounded to one decimal second; missing first-token timings are excluded. Only counts, timing medians and dates were returned; no visitor text, identifiers or source URLs were exported.

Knowledge records may represent document sections and other indexed units. They must not be presented as unique original articles. The knowledge snapshot has its own date and must not be merged into the chatbot observation period.

The rating sample is small and self-selected. The page makes no satisfaction, support-deflection, uptime, or international-adoption claim. Multilingual capability is separate from measured use in each country.

## Refreshing the evidence

1. Obtain a fresh aggregate report using the project's established public/non-junk traffic definitions. Do not export visitor text or identifiers into this repository.
2. Record the measurement window, time basis, exclusions, unit definitions and any methodology change. Confirm dates and scope before comparing periods.
3. Update visible HTML, its `data-metric` values, JSON-LD datasets, `llms.txt`, and this document together. Keep the source report in the appropriate private project; public provenance is described here without internal locations.
4. Update review/sitemap dates and run `node tools/check.mjs`. Inspect the page and social preview, then publish only within the owner's authorised scope.

Case-study order is deliberate: Customer Chatbot, Jedi Archives, Holocron, Autotests Portal. It moves from customer use through the shared knowledge foundation to developer context and verification. Customer answers remain within the product-support knowledge base.

## Migration development evidence — 29 October 2026

Hyperspace Migration is listed as In development. A read-only implementation review and the project's recorded manual verification support the description: a 486-record test-company rehearsal completed, including recovery after a saved record's API response was lost. This is a controlled test rehearsal, not a customer migration or production-readiness claim. Automated reconciliation and final cut-over work remain in development. The public entry includes no customer data, private product names or internal system locations.
