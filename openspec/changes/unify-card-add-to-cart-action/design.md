## Context

See proposal.md — Why.

The card's action slot (`ProductCard.tsx`) is a single wrapper div holding a `product.isVariable` ternary that renders two structurally different buttons. The wrapper already carries the hover/focus reveal and keeps its footprint in both states, so the grid does not reflow — that machinery is untouched by this change and only the button inside it is reworked.

Two constraints shape the approach:

- **The card cannot know the variants.** `Product` as delivered to a listing carries `isVariable` and an aggregate `stockQuantity`/`inStock`, but no variant array — `ProductQuickView` fetches detail by slug on open. So the card can decide *whether* a choice is needed, never *what* the choice is. Any behaviour requiring per-variant knowledge belongs in the quick view, not here.
- **`ProductCard` is shared by five listings** (home, category, search, wishlist, compare). There is one place to change and no per-listing variation to reconcile.

## Goals / Non-Goals

**Goals:**

- One button element for both branches, so the two states cannot drift apart in label, size, icon, or disabled styling.
- The variable branch's disabled condition becomes identical to the simple branch's.
- The chooser-opening branch is distinguishable to assistive technology without being distinguishable visually.

**Non-Goals:**

- Changing what the quick view does once open — variant selection, per-variant stock, quantity, and the add all stay as they are.
- Surfacing per-variant availability on the card. The card has aggregate stock only; inferring anything finer would require a payload change.
- Touching the hover-reveal behaviour of the action slot, or the wishlist/compare/sold-out chip layout above it.

## Decisions

**One button with branching handlers, not two buttons sharing a class string.**
The ternary collapses to a single `<button>` whose `onClick` picks between `setQuickViewOpen(true)` and `handleAdd`, and whose `disabled` is one expression. The alternative — keeping two `<button>` elements and extracting the shared `className` to a constant — was rejected: a shared class string still permits the two branches to diverge in everything else (icon, label, `disabled`, spinner), which is exactly the drift that produced the current inconsistency. Collapsing to one element makes the sameness structural rather than maintained by discipline.

**`disabled` is `!product.inStock || isLoading` for both branches.**
`isLoading` comes from the add mutation, so it is always false on the variable branch — harmless, and keeping one expression rather than a branch-aware one is the point. This is the change the user chose: a sold-out variable product now shows the same greyed-out button as a sold-out simple product. The alternative — keeping the variable branch always-enabled so the quick view stays reachable — was rejected because the label now promises an add, and an enabled "Add to cart" on a product the shopper cannot buy is a false promise; a chooser that can only report "sold out" is not worth that. The product's detail view remains linked from both the image and the title, so the product stays inspectable.

**The cart icon is used for both branches; `SlidersHorizontal` is dropped.**
The label is the same, so a differing icon would reintroduce the visual tell the change exists to remove. The import goes with it.

**The chooser branch carries `aria-haspopup="dialog"`.**
This is the accessible half of "same label, different outcome": sighted shoppers learn the difference when the panel appears, and this is what tells everyone else. It is set only on the variable branch — announcing a dialog that never opens would be its own lie. Adding a visually-hidden label suffix instead was considered and rejected: it makes the accessible name differ from the visible one for no gain over the role-appropriate attribute.

**The spinner stays on the simple branch only.**
`isLoading` reflects the card's own add mutation. The variable branch's work happens inside the quick view, which has its own loading and error states; mirroring that state onto the card would mean lifting it out of the panel for no shopper-visible benefit.

## Risks / Trade-offs

- **A sold-out variable product may still have an in-stock variant if the aggregate `inStock` is computed loosely server-side** → the card would now hide a purchasable product behind a disabled button. Verify against the product payload during implementation that `inStock` for a variable product is true when *any* variant has stock; if it is not, the disabling rule is wrong at the source and the fix belongs in the payload, not the card.
- **Shoppers who learned "Options" as the signal for "this one needs a choice" lose that cue** → accepted deliberately; the proposal treats that cue as the defect, since it also read as "not directly purchasable". The quick view still opens on the first press, so the interaction cost is unchanged.
- **Removing the only listing-level entry point to the quick view for sold-out variable products** → accepted; the detail page presents the same choices, and a chooser whose every option is unavailable has nothing to offer.

## Open Questions

None.
