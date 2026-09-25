## 1. Destination data and resolution

- [x] 1.1 Vendor the district/area list into `src/data/bd-districts.ts` as a typed constant generated from the source JSON (64 districts, ~2,347 areas), names kept verbatim; record the source URL and the import date in a header comment so it can be regenerated
- [x] 1.2 Check the generated module against the size budget in design D2 (80 KB raw / ~20 KB gzipped); if it is over, flatten the shape before anything imports it
- [x] 1.3 Add `src/lib/delivery-destination.ts` holding the `DeliveryZone` union, the per-district zone map, the Dhaka-district exception list (D4) and the per-deployment zone → option-key map (D3), each with a comment saying which of the three is expected to differ per client
- [x] 1.4 Add the resolver: given a district, an area and the store's configured delivery options, return the matching option, or a stated reason it could not resolve (area unknown, area in no zone, zone names an option the store does not have)
- [x] 1.5 Add the search and label helpers the picker needs: match on either half of `District - Area`, cap the result count, and format the label for display
- [x] 1.6 Cover 1.3–1.5 in `src/lib/delivery-destination.test.ts`: a metro Dhaka area resolves to the inside option; a Dhaka exception area (Savar) resolves to the outside option; another district resolves to the outside option; an unknown area is unresolved; a zone naming an option absent from the configured list is unresolved; search matches on district and on area and respects the cap
- [x] 1.7 Confirm the Dhaka-district exception list with the merchant and fold the answer into 1.3 — the open question in design.md

## 2. The destination picker

- [x] 2.1 Build `src/components/ui/SearchableSelect.tsx`: text input, filtered listbox, keyboard up/down/enter/escape, capped rows, no new dependency (D9)
- [x] 2.2 Give it the accessibility a select needs — labelled input, `role="listbox"`/`role="option"`, `aria-activedescendant`, focus returned to the input on choose, and the storefront's own focus-ring treatment
- [x] 2.3 Build the labelled field wrapper the two forms share (label, required marker, error message) styled to match `Field` in `src/components/account/form-controls.tsx`
- [x] 2.4 Check it at phone width: full-width list, no horizontal page scroll, list height capped so an open keyboard does not hide the options

## 3. Checkout

- [x] 3.1 Replace the guest City input in `src/components/checkout/CheckoutForm.tsx` with the destination field, still gated on the merchant's `city` field configuration — a merchant who does not collect a city gets no picker
- [x] 3.2 Submit the destination in the existing fields: district as `state`, area as `city` on the guest shipping address (D1)
- [x] 3.3 Derive the delivery option from the destination and key the checkout quote on it, leaving the charge, the total and the advance amounts to come from the quote as they do now
- [x] 3.4 Hide the "Where are we delivering?" step while derivation resolves, and renumber the steps that remain
- [x] 3.5 Render the existing option cards unchanged for every unresolved case, with the reason stated — unmapped area, option no longer configured, city field switched off (D5)
- [x] 3.6 Keep collection in person as it is: the delivery/collection toggle and the pickup list stay shopper-chosen, and no destination is required to collect
- [x] 3.7 Block Place Order when a destination is required and missing, saying which answer is missing rather than disabling silently
- [x] 3.8 Name the derived option and its price on the order summary's Delivery line, including the waived-charge treatment already there
- [x] 3.9 Verify a destination change re-quotes and regenerates the idempotency key through the existing `orderFingerprint` — confirm, do not add to it

## 4. Saved addresses

- [x] 4.1 Replace the City input and the "State / region (optional)" input in `src/components/account/AddressForm.tsx` with the destination field, required on the same terms as the address's other required fields
- [x] 4.2 Preselect the destination when editing an address whose district and area are both recognised; leave it empty and require a choice before saving when they are not (D7)
- [x] 4.3 Set the checkout's destination from the selected saved address, and move the derived option and charge when the shopper switches between addresses
- [x] 4.4 Set the destination from an address added inline during checkout, without a reload
- [x] 4.5 Leave addresses saved before this change displaying exactly as stored, and fall back to the option cards when one is selected at checkout

## 5. Verification

- [x] 5.1 `cd frontend && npx vitest run src/lib/delivery-destination.test.ts` — flags do not survive `npm --prefix`
- [x] 5.2 `npm run lint` and `npx tsc --noEmit` clean in `frontend`
- [x] 5.3 Guest pass against the dev server: a metro Dhaka area shows the inside option and its price on the summary; switching to an outside district moves both the charge and the advance amount; an unmapped area brings the option cards back
- [ ] 5.4 Signed-in pass: save a new address with the picker; select an address saved before this change and confirm the option cards return; switch between two addresses in different zones and confirm the charge moves
- [ ] 5.5 Collection pass: the delivery/collection toggle and pickup list still work, and an order can be collected with no destination chosen
- [ ] 5.6 Place one order each way — derived and fallback — and confirm the placed order records the district and the area and the option that was charged
- [x] 5.7 Confirm no server, admin or Postman change is owed: the request bodies are the ones already in the collection, with `state` now populated
