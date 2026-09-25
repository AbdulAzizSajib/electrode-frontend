## Context

See proposal.md — Why. The constraints that shape the approach:

- **The server already takes everything this needs.** `POST /orders` accepts a guest `shippingAddress` with both `city` and `state` (each optional, 100 chars), persists `state`, and `CustomerAddress` carries `city` and `state` columns. The quote and the order are keyed on `deliveryOptionKey` and nothing else about the destination.
- **A delivery option deliberately carries no destination criteria.** `replace-shipping-rules-with-delivery-options` (server) deleted address matching and made the option the shopper's own choice — see its design.md, D1–D3. That decision holds for the *server*: it is not being reversed here. What changes is only who clicks the option in the storefront.
- **`key` is a stable slug the merchant never sees; `label` is merchant-authored and renameable.** Any mapping that keys off the label breaks on a rename; keys survive one.
- **The merchant's option list is arbitrary.** Two options is typical, but the schema allows up to 20, and each deployment is a separate clone with its own database (see the agency model). Nothing universal can know a given store's keys.
- **The source data** is a 64-district array, each with an `areas` list of upazila/thana and neighbourhood names — 1,343 entries, of which 529 sit under "Dhaka" and include both metro neighbourhoods ("Dhanmondi - Rd 3") and outer thanas ("Savar", "Dohar", "Nawabgonj (Dhaka)").
- **The storefront has no searchable select.** `combobox` exists in the admin; the two apps share no code and no dependency.

## Goals / Non-Goals

**Goals:**

- One destination answer that both identifies the address and decides the delivery charge.
- No server, database, admin or Postman change — this ships from the storefront repo alone.
- A store stays orderable in every state the mapping can be wrong in.
- The zone data is small enough that a person can review it and a merchant can be asked about it.

**Non-Goals:**

- Merchant-editable district-to-option mapping. It stays code-shipped data this round.
- Interpreting addresses already saved as free text.
- Courier integration, per-area pricing, or anything that prices below the option level.
- An escape hatch back to the option cards when derivation succeeds — see D6.

## Decisions

### D1 — District goes in `state`, area goes in `city`

The picker writes two values into fields that already exist end to end: `state` = district, `city` = area.

*Why:* every layer already carries them. The guest payload validates `state`, the order service persists it, `CustomerAddress` has the column, and `formatAddress` already prints city then state. That makes this change storefront-only, which is the difference between one release and four (server, admin, Postman, storefront).

*Alternative considered:* dedicated `district` / `area` columns. Rejected — a Prisma migration, a validation change, an admin change and a Postman update, to hold two strings the existing columns already hold and already display. The naming mismatch is real ("state" is not a Bangladeshi concept) and is paid for with a comment at the type, not with a migration.

*Consequence:* `state` stops being the free-text "State / region (optional)" field on the saved-address form and becomes the district half of a required pair. Addresses that already hold something else in `state` are left exactly as they are — see D7.

### D2 — The list ships as static storefront data, generated from the source JSON

The district/area list is vendored into the storefront as a generated module. It is not fetched, not stored in the database, and not merchant-editable.

*Why:* the districts and upazilas of Bangladesh do not change on a merchant's timetable, and the list is identical for every client. A database table would mean a model, a module, an admin screen and an API call on the critical path of checkout, to serve data that is the same in every deployment.

*Alternative considered:* a `GET /districts` endpoint on the server. Rejected for the same reason plus one more — it puts a network request between opening checkout and being able to type an address.

*Constraint this imposes:* the module must not land in the first-paint bundle of every page. It is imported only by the picker, and the picker is loaded by the checkout and address forms — both already client components below the fold of the first paint. Budget: the generated module stays under 80 KB raw / ~20 KB gzipped, checked once when it is generated.

### D3 — Two maps, not one: area → zone, then zone → option key

Resolution goes through an intermediate **zone** (`INSIDE_DHAKA`, `OUTSIDE_DHAKA`, extensible):

```
area + district ──(universal zone map)──> zone ──(per-deployment map)──> option key ──> the merchant's option
```

*Why:* the two halves have different lifetimes and different owners. The zone map is geography — the same for every client, reviewed once. The zone-to-key map is one line per zone and is the only part that knows a particular store's configured keys, so cloning the storefront for a new client means editing that one small map, not re-authoring 1,343 rows.

*Alternative considered:* mapping areas straight to option keys. Rejected — it makes the big data file per-client, so every clone forks it and no fix travels between them.

*Alternative considered:* matching the option by its label ("the option called Inside Dhaka"). Rejected — labels are merchant-authored and renameable, and D2 of the server change exists precisely because a rename must not silently re-bucket orders. A rename must not silently re-price them either.

### D4 — Zone is assigned per district, with a per-area exception list for Dhaka

Every district carries one zone. Dhaka district additionally carries a list of its areas that are **not** inside-Dhaka for pricing.

*Why:* 63 districts are uniform, so 63 entries cover them. Dhaka is the only one where the pricing boundary runs through the district — Savar, Dohar, Keraniganj and Nawabganj are Dhaka district but are not what a merchant means by "Inside Dhaka". A per-area table for all 1,343 entries would be unreviewable; a per-district default plus a short exception list is something a merchant can read and confirm.

*Consequence:* the exception list is the one piece of this change that needed the merchant's sign-off, because a wrong entry charges the wrong price and nothing reports it. Confirmed 2026-09-25 as the eleven areas the code lists. It stays small enough to correct in one edit, and D5 keeps the store orderable if it is ever wrong again.

### D5 — Every failure falls back to the option cards that exist today

When the destination cannot resolve — no destination chosen, area in no zone, zone naming an option the store no longer has, city field switched off, or the shopper collecting in person — checkout renders the shopper-chosen option cards, unchanged, and the order proceeds exactly as it does now.

*Why:* a store that cannot take an order is worse than a store that asks one extra question. This also means the change can ship before the D4 exception list is final and before every client's zone-to-key map is filled in: an unmapped store degrades to today's behaviour instead of breaking.

*Consequence:* both paths stay alive, so both must stay tested. The fallback is not dead code kept for safety — it is the path for pickup, for legacy addresses and for any merchant who does not organise delivery by district.

### D6 — When derivation succeeds, the option cards are not shown at all

No "not right? choose yourself" escape beside the derived option.

*Why:* it is what the shopper was asked for — one question, not a question and a second-guess. Two ways to set the same charge is also how a shopper ends up with an option that contradicts their address, which is the whole failure this change removes.

*Trade-off accepted:* a shopper whose area is mapped to the wrong zone has no way to correct it themselves; they will contact the merchant, who corrects the zone data. The order summary names the derived option and its price so the mistake is at least visible before confirming, rather than discovered at the door.

### D7 — Addresses saved before this change are never guessed at

No fuzzy matching of a stored free-text city to a district. A saved address whose `city`/`state` are not both recognised entries of the list is treated as having no destination: it displays as saved, and checkout falls back to the option cards for it. Editing such an address requires choosing a district and area before it can be saved again.

*Why:* "dhaka" could be Dhaka district or Dhaka metro; "savar" is Dhaka district but outside-Dhaka pricing. A guess that is right 90% of the time is a wrong delivery charge on one order in ten, applied silently. Asking is cheap and correct.

### D8 — The derived key is submitted exactly like a chosen one

The storefront still sends one `deliveryOptionKey` on the quote and on the order. No new field, no flag saying it was derived, no new endpoint.

*Why:* the server's refusals — unknown key, deleted option, pickup while collection is off — are the same refusals whether a person or a rule picked the key, and they are already written. Telling the server how the key was chosen would invite it to behave differently, which is exactly what must not happen.

*Consequence:* the existing idempotency fingerprint already includes `deliveryOptionKey`, so changing district regenerates the key and cannot reuse a previous attempt's. Nothing to add.

### D9 — A small owned-source searchable select, not a dependency

The picker is a new storefront component: a text input, a filtered list capped at a readable number of rows, keyboard navigation, and the same field styling as the rest of the form.

*Why:* one control does not justify a dependency in a bundle a customer downloads, and the admin's `combobox` cannot be imported — the apps share no package. The cap matters more than it looks: 1,343 options must never all be in the DOM, and the list must filter on both halves of the label, because a shopper types "Savar", not "Dhaka - Savar".

## Risks / Trade-offs

**The exception list is wrong for some Dhaka area** → The merchant confirms it before release (open question below); the summary names the option and price before the shopper confirms, and a fix is a one-line data edit, not a code change.

**The generated module bloats the storefront bundle** → Budget in D2, checked when the module is generated; it is imported only by the picker, which only the checkout and address forms mount.

**A merchant renames or deletes the option a zone names** → Falls back to the option cards (D5) rather than submitting a key the store no longer has. The failure is visible as "choose an option", not as a wrong price.

**A shopper is mapped to a zone they disagree with** → Accepted, see D6. Visible before confirming; corrected by the merchant in data.

**Both paths must stay tested forever** → Accepted. The fallback is the pickup path and the legacy-address path as well, so it cannot rot unnoticed.

**Area names in the source data are inconsistent** — "Mohammadpur (Dhaka)", "Dhanmondi - Rd 3", "Nawabgonj (Dhaka)" with its own spelling → Displayed verbatim so what the shopper picked is what the courier reads; the search matches on any part, so the parenthetical and the spelling do not have to be typed.

## Migration Plan

1. Generate the district/area module and the zone data from the source JSON; check the size budget and get the D4 exception list confirmed.
2. Ship the picker and derivation in one release. There is no data migration: no column changes, no backfill, nothing rewritten.
3. After release, `state` begins arriving populated on new orders and new addresses. Old rows are untouched and keep working through the fallback.

**Rollback:** revert the release. Nothing persisted by it is unreadable to the previous build — `state` was always a valid field on both the address and the guest payload, and an order carries the same `deliveryOptionKey` it always did.

## Open Questions

- ~~**Which Dhaka-district areas are charged as outside-Dhaka?**~~ **Answered 2026-09-25:** Savar, Savar Cantonment, Ashulia, Amin Bazar, Birulia, Dhamrai, Keranigonj, Kaliganj - Keraniganj, Kodomtoli(Keraniganj), Dohar and Nawabgonj (Dhaka). "Nawabgonj Puran Dhaka" stays inside the city — the source lists old Dhaka's Nawabganj separately from the upazila.
- **Is a third zone wanted** (a separate "Dhaka sub-urban" rate, which several couriers price)? The zone map is a string union and the zone-to-key map is one line per zone, so adding one later is data plus one merchant-configured option — no design change.
