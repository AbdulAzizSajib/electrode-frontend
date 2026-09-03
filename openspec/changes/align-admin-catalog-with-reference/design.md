## Context

See proposal.md — Why. The facts that shape this design:

**What we have.** `ProductOption` / `ProductOptionValue` are per-product, added three days ago by `add-product-option-types`. `ProductVariantOptionValue` joins a variant to the values defining it. Variants carry `sku` (unique), `price`, `compareAtPrice`, `stockQuantity` and images via `ProductImage.variantId` — the storefront gallery reads that link. `Category.parentId` already models sub-categories. `Coupon` already carries every field the reference calls a voucher. Tax is one rate on `StoreSetting`; shipping is a flat-price `ShippingMethod`.

**What the reference does.** Verified by reading it: global `attributes` / `attribute_values`, joined to `updated_inventories` (one row per combination) through `inventory_attributes`. A variant there carries **only price and quantity** — no SKU anywhere in that codebase, no per-variant image. Variant price is stored as a delta (`0` = inherit the product price). The product form is one scrolling page; the inventory editor is gated on the product existing. Attribute values are ticked as checkboxes and the combination table is regenerated, with an `existing` map keyed on joined value ids preserving price and quantity across regeneration.

**The defect this fixes.** Our generator matched existing rows by `optionValueIndexes`. Legacy variants had none, so all four keyed to `""`, matched nothing, and were regenerated at zero stock. The reference's `existing` map is the same idea done right.

## Goals / Non-Goals

**Goals:**
- Define an attribute once, reuse it everywhere.
- Never lose a variant's price, stock, SKU or images to a change in the selection.
- Migrate every existing product without a merchant touching it.

**Non-Goals:**
- Adopting the reference's *data* model. We keep SKU and per-variant images (proposal — What Changes); only the authoring interaction is copied.
- Storing variant price as a delta. The reference does; we store absolutes and will keep doing so — see Decisions.
- Multi-language catalog fields, flash sales (proposal — Not in scope).

## Decisions

### Attributes become global; per-product options are migrated, then dropped

`Attribute` and `AttributeValue` replace `ProductOption` and `ProductOptionValue`. `ProductVariantOptionValue` survives, repointed at `AttributeValue` — so the join that defines a variant does not change shape, only what it references.

Deduplication on migration is by **case-insensitive trimmed name**: two products with "Colour" and "colour" become one attribute. Values dedupe the same way within an attribute. This is the whole point — if migration produced one attribute per product, we would have renamed the problem.

- **Alternative — keep both, per-product and global**: rejected by the user, and it would mean two resolution paths in the storefront forever.
- **Alternative — new tables, leave the old ones**: rejected. Dead tables that half the code still reads are how a codebase rots.

### Migration is a data migration, and it is the risk

Purely additive schema changes cannot do this: existing variants reference `ProductOptionValue` rows that must become `AttributeValue` rows. The order is fixed:

1. Create the new tables.
2. For each `ProductOption`, find-or-create an `Attribute` by normalised name; same for values.
3. Rewrite every `ProductVariantOptionValue` to the new value id.
4. Verify: every variant that had a selection still has one, of the same arity.
5. Only then drop the old tables.

Step 4 is a hard gate. If any variant's selection changed arity, the migration aborts — a product whose variants silently lose their identity is unbuyable, and a shopper sees "Sold out" on a product with stock. That is exactly the failure this change exists to fix, so reproducing it during the fix is not acceptable.

Written as a single migration so a partial application cannot leave variants pointing at dropped rows.

### Combination rows are matched by attribute-value set, not by index

The generator's `existing` map is keyed on the **sorted set of attribute value ids** for a combination. Sorted, because the reference's key is order-sensitive and only works by accident of how JS orders integer-like keys — a latent bug worth not copying.

A row that still exists keeps its database id, so the backend updates rather than deletes and recreates. That is what preserves SKU, images and order links, not just the price and stock the reference preserves.

For legacy variants with no selection at all, matching falls back to **variant name**: a variant named "Black" matches the combination whose values render as "Black". This is what would have saved the Q86 product. It is a migration-era nicety, not a permanent rule — after migration every variant has a real selection.

### A variant referenced by an order cannot be removed

The reference checks this and refuses the whole save. We do the same, and for the same reason: an order line pointing at a deleted variant loses what was actually bought.

The check runs **before the transaction opens**, consistent with how `ensureVariantOptionSelections` and `ensureVariantReferencesResolve` already work — a rejected request must modify nothing.

### Variant price stays absolute

The reference stores `price = 0` meaning "inherit the product price", and reads it back as `price > 0 ? price : productPrice`. We will not adopt this.

It conflates "free" with "unset", forces every reader to know the sentinel, and makes changing the product price silently change every variant's price. Our `price` is already nullable — null means inherit, which says the same thing without overloading a real value.

### Shipping matches most-specific-first

A rule's places are matched region → country → all-destinations. Without an explicit order, two places covering a shopper are a coin toss, and a merchant adding a specific rate would see it ignored at random.

No match is an error the shopper is told about, not a free delivery. Silently charging nothing for an undeliverable destination is a real loss.

### Tax and shipping rules cannot be deleted out from under products

Both references are non-null on `Product`: a product must be taxable and deliverable. So deletion requires reassignment — the merchant picks the replacement, and it is applied in the same transaction as the delete.

Collections cascade (a product simply leaves), and bundle deals null out (the product is sold without an offer). Those references are nullable, so nothing is orphaned.

### The form is one page; the inventory section is gated on existence

The wizard is replaced by a scrolling form with a media sidebar. The variants, gallery and stock sections render only once the product has an id, because each attaches to a product — the reference gates on exactly this and it is the reason its form does not need to hold everything in memory.

Media uploads stay separate calls, as they already are: files need multipart, the rest is JSON.

### Rich text is sanitised on the way out, not only on the way in

The editor stores HTML. It is sanitised **when rendered by the storefront**, with an allowlist of tags and attributes.

Sanitising only on save would leave anything already stored — or written by any other path — trusted forever. The storefront is where the markup meets a browser, so that is where the guarantee has to hold.

## Risks / Trade-offs

- **The migration is irreversible in practice** → verified by an assertion step before the drop, and rehearsed against a database copy before it is run for real. Rolling back means restoring a backup, so a backup is a precondition, not a suggestion.
- **Two products using "Colour" and "Color" merge into one attribute** → intended, and the merchant may not expect it. The migration reports what it merged.
- **Deduplicating by name merges values that were never meant to be the same** — a "Small" in Size and a "Small" in Weight → values dedupe *within* an attribute only, never across.
- **The product form becomes a very large component** → the media sidebar, the inventory editor and the tag input are separate components; the form is composition, not one file.
- **A rich-text editor is a new dependency with a real footprint** → chosen for bundle size and for producing clean HTML rather than a proprietary document format we would have to convert.
- **Nine new CRUD surfaces is a lot of near-identical code** → the reference solves this with a shared `ListPage`/`DataPage` pair. We should extract the same before writing the ninth, not after.
- **Checkout changes touch money** → tax and shipping move from single values to per-product rules. This is the part where a mistake charges a real shopper the wrong amount, and needs its own verification against known orders.

## Migration Plan

1. **Backend, additive**: new tables for attributes, tax rules, shipping rules, collections, bundle deals, tags; new product columns. Nothing reads them yet.
2. **Backend, data migration**: per-product options → global attributes, with the verification gate, then drop the old tables.
3. **Backend, endpoints**: CRUD for each new entity; product payload carries the new fields; checkout reads the new rules.
4. **Admin**: shared list/form scaffolding, then the nine pages, then the product form rewrite.
5. **Storefront**: option resolution against the new shape, new product facts, sanitised rich text.

Steps 1 and 2 ship together — the schema must not sit half-migrated. Steps 4 and 5 are independent of each other.

Backwards compatibility during 1–3: the storefront keeps working because `Product.options` is still shaped the same to it; only its source changes.

## Open Questions

- Which rich-text editor. It changes a dependency and some component code, but no requirement and no task boundary — decide when writing that component.
- Whether collections get storefront listing pages. Explicitly out of scope here; the data will support it either way.
