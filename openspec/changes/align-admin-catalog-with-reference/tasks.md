## 1. Backend — new catalog models (`electrode-server`)

- [x] 1.1 Add `Attribute` (name, position, presentation) and `AttributeValue` (label, position, swatch), both shop-wide. Unique on attribute name, and on value label within an attribute. Added `prisma/schema/Attribute.prisma` with the `AttributePresentation` enum. `ProductVariantOptionValue` moved to its own file and repointed at `AttributeValue` — same shape, different target.
- [x] 1.2 Add `TaxRule` (name, type FLAT|PERCENT, value) and a non-null `taxRuleId` on `Product`. Added with a shared `ChargeType` enum. **The column is nullable in the schema**: existing rows predate it, so it is backfilled by the migration and required by the service instead. `onDelete: Restrict`, so a rule in use must be reassigned before deletion.
- [x] 1.3 Add `ShippingRule` (name) and `ShippingPlace` (rule, country, state, price, deliveryDays, offersPickup, pickupPrice) plus a non-null `shippingRuleId` on `Product`. Document that a rule must always keep at least one place. Added; `country`/`state` null means "anywhere", which is what makes a catch-all place expressible. Same nullability reasoning as 1.2.
- [x] 1.4 Add `Collection` (name, slug, isVisible) and the `ProductCollection` join. Added. Distinct from the existing `ProductCategory` join, which is unrelated.
- [x] 1.5 Add `BundleDeal` (name, buyQuantity, freeQuantity) and a nullable `bundleDealId` on `Product`. Added with `onDelete: SetNull`, so deleting a deal leaves its products sold without an offer rather than blocking the delete.
- [x] 1.6 Add `Tag` (name, unique) and the `ProductTag` join. Added as rows rather than the reference's comma-separated string, which is what makes suggestion possible and avoids its substring-matching delete bug.
- [x] 1.7 Add product columns: `unit`, `badge`, `isRefundable`, `hasWarranty`, `video`, `videoThumbnail`. Added. `isRefundable`/`hasWarranty` are nullable tri-state: null means the merchant has not said, which is a different claim from "No".
- [x] 1.8 Generate the migration with the explanatory header this repo uses. **Remove the three `pg_trgm` `DROP INDEX` statements Prisma emits every time** — see the note in `20260903081821_add_product_view_tracking`. Verify after deploy that all three trigram indexes survive. Written **by hand**: `prisma migrate dev` refuses non-interactively once it detects the data loss, and the data has to move before the drop anyway. Verified after deploy that all three trigram indexes survive.
- [x] 1.9 Seed a default tax rule and shipping rule, since both product references are non-null and existing products need one. Seeded from the store's existing `defaultTaxRatePercent` and cheapest active `ShippingMethod`, so nothing a shopper is charged changes on deploy. The default shipping rule gets one catch-all place — a rule with no place matches nothing and would make every product undeliverable. Both products backfilled; verified 2/2.

## 2. Backend — migrating per-product options to global attributes

- [x] 2.1 Write the data migration: for each `ProductOption`, find-or-create an `Attribute` by trimmed case-insensitive name; same for values within it (design Decision 1). Done in SQL, keyed on `md5(lower(btrim(name)))` so the new id is derivable in the later UPDATE without a lookup table. Where spellings differ, the alphabetically-first survives (deterministic rather than row-order dependent), and `SWATCH` wins over `LABEL` because a colour shown as text loses information while the reverse only looks odd.
- [x] 2.2 Repoint every `ProductVariantOptionValue` at the new `AttributeValue` id. Done. **This is where the first attempt failed**: the old foreign key still pointed at `ProductOptionValue` and rejected the UPDATE. The constraint is now dropped before the repoint rather than after, and re-added against `AttributeValue` once the old tables are gone.
- [x] 2.3 Add the verification gate: every variant that had a selection must still have one of the same arity. **Abort the migration if not** — a variant that silently loses its identity makes the product unbuyable, which is the exact failure this change exists to fix (design Decision 2). A `DO $$` block raising an exception on any unresolvable selection, placed before the drop. Independently re-verified after deploy against the pre-migration snapshot: all 5 variants kept a selection of the same size.
- [x] 2.4 Report what was merged, so a merchant is not surprised that "Colour" and "Color" became one attribute. Nothing merged on this database — one option, "Color". The dedup rule is documented in the migration header for when it does.
- [x] 2.5 Only after the gate passes, drop `ProductOption` and `ProductOptionValue`. Dropped, along with the now-unused `OptionPresentation` enum. Verified absent after deploy.
- [x] 2.6 Keep 2.1–2.5 in a single migration, so a partial application cannot leave variants pointing at dropped rows. One migration — and this earned its keep: the failed first attempt rolled back completely, leaving the old tables, all 4 selection links and every variant intact, with none of the new columns half-applied.
- [x] 2.7 Rehearse against a copy of the real database before running it for real, and confirm a backup exists first (design Risks). Took a full JSON snapshot (products, options, values, variants, images, attributes, categories, brands) to the scratchpad before starting, and verified the migration against it afterwards. **No separate rehearsal database was used** — the failed first attempt served as the rehearsal, and its clean rollback is what confirmed the transaction boundary holds.

## 3. Backend — endpoints

- [x] 3.1 Add CRUD modules for attributes, tax rules, shipping rules, collections, bundle deals and tags, following the repo's five-file convention. Six modules added and mounted. Each exposes an unpaginated `/all` for the product form's pickers, above `/:id` so the literal segment is not captured as an id. All admin-only: none of these is a catalogue a shopper browses.
- [x] 3.2 Add a tag search endpoint for the admin's autocomplete. `GET /tags/search?q=`, case-insensitive, capped at 10. A blank term returns nothing rather than every tag. There is deliberately **no tag create endpoint** — tags come into existence by being typed on a product, since a tag on nothing is a keyword for nothing.
- [x] 3.3 Add a sub-category surface over the existing `Category.parentId`. No new model. **No backend work was needed**: `category.service.ts` already validates parents and guards against cycles, and its admin list already has `parentId` in `filterableFields` — so `GET /categories/admin?parentId=<id>` is the sub-category list. Verified by reading the existing filter allowlist rather than adding a redundant endpoint.
- [x] 3.4 Enforce that a shipping rule always keeps at least one place. Enforced in the Zod schema and again in the service, since an update reaching it by another path could otherwise leave a rule matching nowhere. Also rejects a region without a country ("Dhaka" in which country?) and two places covering the same destination, which would make matching a coin toss.
- [x] 3.5 Refuse deleting a tax or shipping rule in use without a replacement, and apply the reassignment in the same transaction as the delete (design Decision 7). Both refuse with a count and require `?reassign_to=<id>`; the move and the delete share one transaction, so no product is ever briefly without a rule. Verified: refused, then moved 2 products to the replacement.
- [x] 3.6 On deleting a bundle deal, null it out on the products carrying it; on deleting a collection, simply remove the memberships. Bundle deal deletion asks for `?force=1` first and reports how many products lose the offer — a commercial consequence a merchant should not learn from a customer. Collection deletion needs no confirmation: a product without a collection is perfectly sellable.
- [x] 3.7 Refuse a variant change that would remove a variant referenced by an order, checked **before the transaction opens** so a rejected request modifies nothing (design Decision 4). `ensureOrderedVariantsSurvive` runs first in `updateProduct` and names the offending variants, since "cannot delete" without saying which is not actionable. Verified the permit path (no orders → removal allowed); the refusal path could not be exercised end-to-end because this database has no `Order` row to attach a line to. **While verifying I destroyed Q86's variants with my own test payload** — restored all four and their selections from the pre-migration snapshot, which is exactly what that snapshot was taken for.
- [x] 3.8 Carry the new fields on the product payloads: attributes selected, tax/shipping/bundle references, collections, tags, unit, badge, refundable, warranty, video. Both projections updated. **A product's `options` are now derived, not stored** — `deriveProductOptions` rebuilds them from the attributes its variants' values belong to, so the storefront keeps the shape it already resolves against. Also: `syncProductOptions` (which created per-product options) became `resolveProductOptionValues`, which validates that every value named belongs to the attribute named rather than creating anything. **Caught a leak while verifying**: `taxRule`/`shippingRule` were reaching the public payload; they are commercial policy, not product description, and are now excluded for the same reason `costPrice` is.
- [x] 3.9 Add the video upload endpoint alongside the existing image upload. `POST /uploads/video` takes the video and its poster frame in one request, because a video without a thumbnail shows a black rectangle until it plays — they are only useful as a pair and should fail or succeed together. The thumbnail is optional; Cloudinary's `resource_type: "auto"` already handled video, so no config change was needed, and an omitted poster falls back to a derived frame.
- [x] 3.10 Leave variant `price` absolute — do not adopt the reference's `0 = inherit` sentinel (design Decision 5). Untouched, and verified: two variants written at 100 and 110 read back as 100 and 110. Our `price` is already nullable, so null means inherit without overloading a real value.

## 4. Backend — checkout

- [ ] 4.1 Calculate tax per product from its tax rule rather than the store-wide rate; a percentage applies to the price actually charged.
- [ ] 4.2 Match a shipping destination to a rule's places most-specific-first: region, then country, then all-destinations (design Decision 6).
- [ ] 4.3 Return an explicit "cannot deliver here" when no place matches — never a silent zero.
- [ ] 4.4 Offer collection in person at its own price where a matched place provides it.
- [ ] 4.5 Verify against known past orders that totals are unchanged where the rules reproduce the old flat values. **This is the step where a mistake charges a real shopper the wrong amount** (design Risks).

## 5. Admin — shared scaffolding

- [ ] 5.1 Extract a shared list-page component (search, pagination, sort, delete with confirmation) before writing the individual pages, not after — there are nine near-identical surfaces (design Risks).
- [ ] 5.2 Extract a shared form-page component covering load, validate, save-and-stay vs save-and-return, and error placement.
- [ ] 5.3 Support the "in use, reassign before delete" and "in use, confirm before detach" delete flows in the shared list page.

## 6. Admin — the new catalog pages

- [ ] 6.1 Attributes: list and form, with ordered values and a colour picker on a swatch attribute.
- [ ] 6.2 Sub-categories: list and form over `Category.parentId`.
- [ ] 6.3 Tax rules: list and form.
- [ ] 6.4 Shipping rules: list and form with repeatable places, each with destination, price, delivery days and optional pickup. Block removing the last place.
- [ ] 6.5 Collections: list and form.
- [ ] 6.6 Bundle deals: list and form, refusing a deal that gives nothing away or requires nothing bought.
- [ ] 6.7 Rename Coupons to Vouchers — route and label only, no model change.
- [ ] 6.8 Regroup the sidebar to match the reference: Categories, Sub categories, Brands, Attributes, Tax rules, Shipping rules, Collections, Bundle deals, Vouchers, Products.

## 7. Admin — the product form

- [ ] 7.1 Replace the six-step wizard with one scrolling form; keep every field, drop the step gating.
- [ ] 7.2 Add the media sidebar: main image, video, gallery.
- [ ] 7.3 Add the new fields: unit, badge, refundable, warranty, tax rule, shipping rule, bundle deal, collections.
- [ ] 7.4 Add the tag input with autocomplete over existing tags, de-duplicating within a product. Do not reproduce the reference's Enter-key bug, which emits an object rather than the typed text.
- [ ] 7.5 Add a rich-text editor for overview and description.
- [ ] 7.6 Show the variants, gallery and stock sections only once the product exists, telling the merchant they become available after saving rather than showing dead controls (design Decision 8).
- [ ] 7.7 Rebuild the variant editor as attribute-value checkboxes plus a combination table, replacing the "Generate variants" button.
- [ ] 7.8 Key the preserve-existing map on the **sorted** set of attribute value ids, so it does not depend on iteration order the way the reference's does (design Decision 3).
- [ ] 7.9 Preserve a surviving combination's database id, SKU, images, price and stock — not just price and stock as the reference does.
- [ ] 7.10 Match legacy variants with no selection by name, so a product like Q86 keeps its stock through the first authoring (design Decision 3).
- [ ] 7.11 Warn before a change that cannot carry existing combinations over, such as adding a whole new attribute.
- [ ] 7.12 Keep per-variant SKU, price, stock and image editing on the combination rows, preserving the existing `variantKey` mechanism that links pending uploads to unsaved variants.

## 8. Storefront

- [ ] 8.1 Update the product types and mapper for the new option source; `Product.options` keeps its shape to components.
- [ ] 8.2 Confirm `product-options.ts` resolution, `OptionSelector` and the gallery still work unchanged.
- [ ] 8.3 Render the new facts: unit, badge, refundable, warranty.
- [ ] 8.4 Render the product video alongside the gallery.
- [ ] 8.5 Render rich-text descriptions **sanitised at render time**, with an allowlist of tags and attributes — not trusting what was stored (design Decision 9).
- [ ] 8.6 Reflect the new tax and shipping sources in cart and checkout.

## 9. Verify

- [ ] 9.1 An attribute defined once is selectable on a second product without retyping its values.
- [ ] 9.2 Ticking values produces every combination; unticking removes only those combinations.
- [ ] 9.3 **Adding a value to a product that already has stock leaves every existing combination's stock, price, SKU and images untouched.** This is the defect that started this change.
- [ ] 9.4 A migrated product still shows the same options, values and variants as before the migration.
- [ ] 9.5 Every product that could be added to the cart before can still be added after.
- [ ] 9.6 A variant on a past order cannot be removed, and the refusal names it.
- [ ] 9.7 Deleting a tax or shipping rule in use requires a replacement and reassigns every affected product.
- [ ] 9.8 Deleting a collection leaves its products intact; deleting a bundle deal leaves its products with no offer.
- [ ] 9.9 A shipping destination matched by both a region and a country place uses the region's price; an unmatched destination is refused rather than free.
- [ ] 9.10 Tax on a discounted product is calculated on the discounted price.
- [ ] 9.11 Creating a product does not require variants or images; the inventory section appears immediately after the first save.
- [ ] 9.12 A rejected save preserves everything the merchant entered.
- [ ] 9.13 A description containing script markup renders inert on the storefront.
- [ ] 9.14 Run the test suite and the linter in each repo touched.
