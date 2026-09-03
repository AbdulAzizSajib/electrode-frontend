## Why

A variant is a name and nothing else. `ProductVariant.name` is free text — `"Q86 Retro / White"` — and the product page renders a flat row of those strings under a heading that literally says "Option". The slash is a convention held together by whoever typed it, not structure. Nothing in the system knows that "White" is a *colour*, that it is the same colour as the "White" on a different product, or that a product has one axis of choice rather than two.

That is fine for a four-colour earbud and wrong for everything else this store is meant to sell. A shop selling dresses needs S / M / XL as sizes, shown in size order, with sold-out sizes visibly dead rather than absent. A bakery needs 1 pound / 2 pound as weights. A phone needs colour *and* storage as two independent choices, where picking "Black" then "256GB" resolves to one variant — a flat button list cannot express that at all; it forces the merchant to hand-write every combination as a string and the shopper to read them.

The raw material for this already half-exists and is entirely unused: `ProductVariant.attributes` is a free-form `Record<string, string>` the admin form collects (labelled "Attributes (e.g. storage, color)") and no storefront component ever reads. It has no vocabulary, no ordering, and no guarantee that two variants of the same product even use the same keys.

## What Changes

- **Options become first-class data.** A product owns an ordered list of named options (`Colour`, `Size`, `Weight`), each with an ordered list of values (`Red`, `Green` / `S`, `M`, `XL`). Order is authored by the merchant, so sizes render S → M → XL rather than alphabetically.
- **A variant is defined by the values it selects, not by its name.** Each variant links to one value per option. `variant.name` survives as a display label but stops being the source of truth for what the variant *is*.
- **The product page renders one control per option instead of one flat list.** Picking a value on each option resolves to a variant; price, compare-at price, stock, SKU and availability follow that resolution as they do today.
- **The number and kind of options is dynamic.** One option, two options, or none (a simple product) all render from the same data with no product-type-specific code. A merchant configures this per product without a developer.
- **An option declares how its values are presented.** A colour renders as a swatch, a size as a labelled chip. The presentation is part of the option's definition, so the same mechanism serves dresses, cakes and earbuds.
- **Unavailable combinations are shown as unavailable, not hidden.** A shopper who picks "Red" must be able to see that Red is only made in M — the sizes that do not exist in Red stay visible and disabled, rather than vanishing and silently changing the meaning of the control.
- **BREAKING (admin authoring): the variants step is restructured.** The merchant defines options and values first, and variants are generated from those combinations rather than typed one by one as free text. The existing free-text variant name and loose attribute pairs are replaced.
- **Existing products keep working.** Products already in the database have variants with names and no options. They must not break, and there must be a defined path from what they have now to the new structure.

## Capabilities

### New Capabilities
- `storefront/product-options`: How a product's options and their values are presented to a shopper, how a selection across multiple options resolves to a variant, how values that no variant provides are treated, and how a product with no options behaves. Covers the shopper-facing contract only.

### Modified Capabilities
<!-- None. `storefront/product-catalog` and `storefront/product-quick-view` do not exist under `openspec/specs/` — the changes that introduced them were never archived — so there is no existing requirement to restate or amend here. -->

## Impact

**Depends on** — this change is inert without both:
- `electrode-server`: new `ProductOption` and `ProductOptionValue` models plus the variant↔value join, a Prisma migration, a backfill for existing variants, option data on the public detail payload and the admin product payload, and validation that a variant selects exactly one value per option.
- `electrode-admin`: the variants step of `product-form-page.tsx` (currently lines 733-853, a `Form.List` of free-text rows plus nested attribute pairs) is rebuilt around defining options and values and generating variants from them.

**Storefront code**
- `src/types/product.ts` — new option and option-value types; `ProductVariant` gains its selected values. `attributes` stays for now as product-level specs are unaffected.
- `src/services/product.ts` — `toProduct` / `toVariant` map the new shapes.
- `src/components/product/ProductDetail.tsx` — the flat variant button list (273-305) becomes one control per option; the selection state changes from "chosen variant id" to "chosen value per option", with variant resolution derived from it.
- `src/components/product/ProductQuickView.tsx` — the same selector exists here (60-113) with its own copy of the logic and must not be left on the old model.
- A new shared selection module, since two call sites need identical resolve-variant-from-values behaviour and the existing duplication between these two components is already a maintenance hazard.

**Interaction with other in-flight changes**
- `fix-variant-image-thumbnails` filters the gallery by selected variant. That contract is unchanged here — this change alters *how* a variant gets selected, not what selecting one does to the gallery. The two touch the same component and should be sequenced deliberately.

**Not in scope**
- No option-based filtering or faceting on listing pages ("show me all red things").
- No option-level inventory rules beyond the stock a variant already carries.
- No shared/global option library across products — options are defined per product in this change.
- No URL state for the selected options.
- No change to cart, checkout or order lines: they reference a variant id, which still exists.
