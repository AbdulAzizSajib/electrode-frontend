## Why

Checkout currently asks a Bangladeshi shopper two questions about the same fact and gets a poor answer to both. It asks for a **City** as free text, which comes back as "dhaka", "Dahka", "ঢাকা", "savar, dhaka" — unusable for finding an order, briefing a courier or reporting on where sales come from. Then it asks them to pick a **delivery area** ("Inside Dhaka" / "Outside Dhaka"), which is a pricing bucket the merchant invented, not something a shopper thinks in; a shopper in Savar or Keraniganj has to work out which bucket they are in, and an order charged ৳80 that should have been ৳120 is a loss the merchant only discovers at dispatch.

One searchable **District / Area** picker answers both at once: the shopper names where they actually live, and the delivery charge follows from it.

## What Changes

- A searchable **District / Area** combobox replaces the free-text City field on the guest checkout form and on the saved-address form. Its options read `District - Area` (e.g. `Bagerhat - Bagerhat Sadar`), covering 64 districts and 1,343 areas, shipped as static storefront data — no new request, no new endpoint.
- The chosen area **derives the delivery option**. The storefront resolves the area to a delivery zone, the zone to one of the merchant's configured delivery options, and submits that option's key exactly as the shopper's own click does today.
- **BREAKING (shopper-facing flow):** when derivation resolves, the "Where are we delivering?" step and its option cards are **no longer shown**. The chosen option appears as the Delivery line in the Order Summary, with its label and price, and nowhere else.
- Derivation **falls back to the manual option cards**, unchanged, whenever it cannot resolve: the merchant has hidden the city field, no zone mapping covers the area, the mapped option is not in the store's configured list, the shopper is collecting in person, or a saved address predates the picker and has no district.
- The picker's value is stored in the fields that already exist: **district → `state`, area → `city`**. No API, database or admin change.
- The delivery **price is still the server's**. The storefront derives only which option key to send; the amount charged continues to come from the checkout quote, as it does now.

## Capabilities

### New Capabilities

- `storefront/checkout`: how the checkout page establishes where an order is going and which delivery option is charged for it, including the fallback to shopper-chosen options. This path is already the storefront's checkout capability by convention in earlier changes; `openspec/specs/` holds no synced file for it yet, so this change writes the first one.
- `storefront/delivery-addresses`: how a signed-in shopper's saved address captures district and area, and how an address saved before this change still works.

### Modified Capabilities

None. The server-side `commerce/delivery-options` capability is untouched: a delivery option still carries no destination criteria, and the storefront still submits one option key per order. What changes is who clicks it.

## Impact

- **Storefront only.** No server, database, admin or Postman change. `POST /orders` and `GET /orders/quote` are called with exactly the fields they take today; `state` is already accepted on the guest shipping address and already persisted.
- New static data module for the district/area list, plus the zone map that turns an area into a delivery zone and a zone into one of the store's option keys. The zone-to-option map is per-deployment data, in keeping with one clone per client.
- Changed components: the checkout form's address fields, its delivery step and its order summary; the saved-address form; a new searchable select primitive (no such component exists in the storefront yet).
- **The Dhaka boundary is merchant data, and was confirmed before release** — the district list has 529 areas under "Dhaka", of which eleven (Savar, Ashulia, Dhamrai, Keraniganj, Dohar, Nawabganj and their neighbours) are charged at the outside-Dhaka rate. See design.md, D4.
- Existing orders and addresses are unaffected: nothing is migrated, and a saved address with a free-text city keeps working through the fallback.
