## Why

A product card currently labels its action by the mechanism it triggers rather than the outcome the shopper wants: variable products show **Options** with a sliders icon, simple products show **Add to cart** with a cart icon. Two labels for one intent makes a grid read as two kinds of product, and "Options" does not tell the shopper that buying starts here — so a variable product looks less purchasable than the simple product sitting next to it.

The underlying routing is already correct and stays correct: a variable product must not be added without a variant choice. Only the label the shopper reads is wrong.

## What Changes

- The product card presents **one** purchase action, labelled **Add to cart** with the cart icon, for every product regardless of whether it has variants.
- Pressing it on a product **with** variants opens the quick view, where the choice is made and the add is completed — the behaviour that "Options" has today, unchanged.
- Pressing it on a product **with no** variants adds a single unit to the cart directly and opens the cart drawer — unchanged.
- **BREAKING (shopper-visible):** a sold-out product with variants now shows the action **disabled**, matching sold-out simple products. Today its "Options" button stays enabled and opens the quick view. The quick view remains reachable for those products from the product detail page.
- The button announces that it opens a chooser rather than adding immediately, so a screen reader user is not told "Add to cart" and then dropped into an unexpected dialog.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `storefront/product-catalog`: the requirement distinguishing products that need a choice gains a rule that the listing's purchase action carries the **same label** whichever branch it takes, and that the action is unavailable when the product cannot be purchased at all — including variable products, which are currently exempt.

## Impact

- `src/components/product/ProductCard.tsx` — the only affected file. Its two-branch action slot collapses to a single button whose `onClick` and `disabled` differ by `product.isVariable`; the `SlidersHorizontal` import is dropped.
- No change to `ProductQuickView`, `cartApi`, the `Product` type, or any server endpoint. The quick view still owns variant selection and the add for variable products.
- Affects every listing that renders `ProductCard` (home, category, search, wishlist, compare entry points) uniformly, since all five share this component.
