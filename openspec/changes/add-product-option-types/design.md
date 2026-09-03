## Context

See proposal.md — Why. The design-relevant constraints:

- `ProductVariant.name` is free text and is currently the only thing distinguishing variants. `ProductVariant.attributes` is `Json?` on the backend and `Record<string, string>` on the wire — collected by the admin form, **read by nothing** in the storefront. It has no vocabulary, no ordering, and no guarantee two variants of a product share keys.
- There is no `ProductOption` model anywhere in `prisma/schema/` (46 models).
- The admin is a **Vite + React Router SPA**, not Next.js. The variants step is `product-form-page.tsx:733-853` — a `Form.List` of free-text rows with nested name/value attribute pairs, submitted as `Object.fromEntries(...)` at line 412.
- The storefront has **two** near-duplicate variant selectors: `ProductDetail.tsx:273-305` and `ProductQuickView.tsx:60-113`. Both hold "chosen variant id" state and fall back to the first in-stock variant.
- `variant.attributes` reaching the storefront unused means the wire already carries partial option data — but unstructured and unusable as-is.
- Cart, orders and stock reference `variantId`. That must not change.

## Goals / Non-Goals

**Goals:**
- Option structure as data, so a new option name needs no code change in any of the three repos.
- One variant-resolution implementation shared by both storefront call sites.
- Existing products keep working with no merchant action required.

**Non-Goals:**
- A shared option library across products (proposal — Not in scope). Options are per-product, which keeps the model a tree and avoids a taxonomy nobody has asked for yet.
- Changing the cart/order contract. `variantId` remains the identifier throughout.
- Removing `ProductVariant.name`; it stays as a display and admin label.

## Decisions

### Model options as a per-product tree, with variants joining to values

```
Product 1─* ProductOption (name, position, presentation)
                 1─* ProductOptionValue (label, position, swatch payload)
ProductVariant *─* ProductOptionValue   (join)
```

`position` on both option and value carries merchant-authored order — the spec requires S → M → XL, which no attribute of the label itself provides. Ordering by `position` is why this is rows rather than a JSON array: a JSON blob cannot be indexed, constrained, or partially updated safely.

The join table is what makes a variant *defined by* its values. The invariant — a variant selects **exactly one value per option of its product** — is the correctness property everything else depends on, and cannot be expressed as a database constraint. It is enforced in the service layer on write, and the resolver is written to tolerate violation rather than crash.

- **Alternative — structure `variant.attributes` JSON** (the user considered and rejected this): no ordering, no per-value swatch data, no referential integrity, and renaming an option means rewriting every variant's blob.
- **Alternative — parse `variant.name` by `/`**: rejected in the proposal; a merchant typo silently breaks the product.

### `presentation` on the option, not inferred from its name

The spec requires an option to declare how its values render. Inferring "colour" from the name breaks the moment a merchant writes "Colour", "Color", or Bengali. An explicit enum (`SWATCH`, `LABEL`) chosen by the merchant, with swatch payload on the *value*. Unknown presentation values render as labels, so adding a presentation later cannot break a deployed storefront.

### Selection state becomes value-per-option; the variant is derived

Both storefront components currently store `chosenVariantId`. They change to store a map of option → chosen value, with the variant **derived** by resolution. This is what makes multi-option selection expressible at all: with two options, "Black" is not a variant, and there is no variant id to store until both are chosen.

Availability is computed the same way: a value is available if some variant matching the other current choices includes it and has stock. This is a pure function over (options, variants, current choices), which makes it directly testable — `variant-gallery.test.ts` is the precedent for testing this kind of pure module.

**Both call sites use one shared module.** The existing duplication between `ProductDetail` and `ProductQuickView` is already a hazard; the spec requires the two to be indistinguishable in behaviour, so a second copy of resolution logic would be a spec violation waiting to happen.

### Legacy products render through the same path via a synthetic option

Rather than branching on "has options / has no options" in the components, a product whose variants carry no option values is presented as a single synthetic option whose values are the variant names. One rendering path, one resolution path, and the spec's "legacy product presents its variants as a single choice" falls out for free.

- **Alternative — backfill real options by splitting `name` on `/`**: rejected as a *migration*. It would guess structure from a display string and permanently write the guess into the database. The synthetic option is computed at read time, so a merchant can author real options whenever they choose and nothing was corrupted meanwhile.

### Unavailable ≠ absent

The spec requires unavailable values to stay visible and disabled. This must be enforced in the resolver's output shape — each value carries its availability rather than being filtered from the list — so a call site cannot accidentally implement "hide" by mapping over a pre-filtered array.

## Risks / Trade-offs

- **The three repos must ship in order** → backend first (additive, storefront and admin ignore the new fields), then storefront (renders synthetic options for everything, identical to today), then admin (merchants can author). Each step is independently safe.
- **A variant violating the one-value-per-option invariant** — reachable through direct DB edits or a partial migration → the resolver treats an unresolvable combination as unavailable rather than throwing. A product renders degraded, never blank.
- **Combinatorial explosion when generating variants** (5 colours × 6 sizes = 30 rows) → the admin generates combinations but must let a merchant delete the ones they do not stock. Not every combination is a real product.
- **Reordering options and values in the admin is remove-and-re-add, not drag** → decided during implementation. `Form.List` has no drag affordance in this codebase and introducing one is a larger UI change than this work warrants. Position still comes from array order, so the payload and the storefront already support any order; only the authoring gesture is clumsy. Worth revisiting if merchants author long value lists.
- **This change and `fix-variant-image-thumbnails` both rewrite the selector in the same two components** → textual collision, not semantic: the gallery change assumes only that *some* variant is selected. Sequence deliberately; whichever lands second rebases.
- **`variant.attributes` becomes redundant but is not removed here** → left in place to avoid a breaking wire change; a later cleanup can drop it once nothing reads it.
- **Deleting an option value that variants reference** → must be blocked or cascade deliberately in the admin; silently orphaning variants would make products unresolvable.

## Migration Plan

1. **Backend**: migration adding `ProductOption`, `ProductOptionValue`, and the variant↔value join. Purely additive — no existing column changes, no data rewritten. Options on the public detail payload and the admin product payload. Write-time validation of the one-value-per-option invariant.
2. **Storefront**: types, mappers, shared resolution module with tests, both components rewired. With no product yet carrying options, every product takes the synthetic-option path and the page is unchanged.
3. **Admin**: options-and-values authoring, variant generation from combinations, replacing the free-text rows and nested attribute pairs.

**No data backfill.** Existing variants keep their names and gain no option values; they render through the synthetic path indefinitely. Migrating a real product to real options is a merchant action in the admin, product by product, whenever they choose.

Rollback: steps 2 and 3 revert independently. Step 1 is additive, so rolling back the storefront leaves unused tables rather than broken data.

## Open Questions

- Whether the admin should offer a starter vocabulary of common option names (Colour, Size) as suggestions. Pure admin UX convenience — changes no spec requirement, no interface, and no task in this change.
