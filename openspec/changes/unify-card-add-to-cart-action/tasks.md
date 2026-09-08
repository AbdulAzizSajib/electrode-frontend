## 1. Verify the availability assumption

- [x] 1.1 Confirm against the product list payload that `inStock` / `stockQuantity` on a variable product reflects its variants in aggregate — true when at least one variant has stock. If it does not, stop and raise it: the disabling rule in design.md rests on this, and the fix would belong in the payload rather than in `ProductCard`.

  **Confirmed.** `services/product.ts:142` derives `inStock: product.stockQuantity > 0`, and `server/src/app/module/stock/stock.service.ts:39-55` increments `Product.stockQuantity` on variant-scoped movements too — its comment states a variable product's total is the sum across its variants, and that the storefront derives `inStock` from it. Variant quantities are ledger-owned and non-negative, so the sum is positive exactly when some variant has stock.

## 2. Collapse the card's action slot to one button

- [x] 2.1 In `src/components/product/ProductCard.tsx`, replace the `product.isVariable` ternary inside the action slot with a single `<button>`, leaving the wrapper `div` and its hover/focus reveal classes untouched.
- [x] 2.2 Give the button `onClick={product.isVariable ? () => setQuickViewOpen(true) : handleAdd}` so the variable branch still opens the quick view and the simple branch still adds one unit and opens the cart drawer.
- [x] 2.3 Set `disabled={!product.inStock || isLoading}` for both branches, so a sold-out variable product is disabled exactly as a sold-out simple product is.
- [x] 2.4 Render the `ShoppingCart` icon and the label `Add to cart` for both branches, keeping the `Loader2` spinner and `Adding...` label bound to `isLoading`.
- [x] 2.5 Add `aria-haspopup="dialog"` on the variable branch only, so the chooser is announced without the visible label differing.
- [x] 2.6 Drop the now-unused `SlidersHorizontal` import.

## 3. Verify behaviour

**Blocked on seed data.** The dev database holds exactly one product (VARIABLE, in stock), so no mixed listing, no simple product, and no sold-out product exists to exercise. There is also no browser-driving tool available in this environment, so click-through steps cannot be run here. What could be checked was checked against the live dev server's rendered HTML on `:4000`.

- [ ] 3.1 In a listing containing both kinds of product, confirm every card's action reads `Add to cart` with the cart icon and identical sizing, and that nothing distinguishes a variable product visually.

  Partially verified: the home page renders 3 cards, all reading `Add to cart` with `lucide-shopping-cart`, zero `>Options<` and zero `sliders-horizontal` remaining. No simple product exists to compare against — though the two branches now share one element and one literal class string, so a visual difference is no longer expressible.

- [ ] 3.2 Press the action on an in-stock variable product: the quick view opens, no item is added, and adding from inside the panel still sends the selected variant and opens the cart drawer.
- [ ] 3.3 Press the action on an in-stock simple product: one unit is added and the cart drawer opens; a failed add leaves the drawer closed.
- [ ] 3.4 Confirm a sold-out variable product shows the action disabled and does not open the quick view, and that its detail page is still reachable from the card's image and title.
- [x] 3.5 With a screen reader or the accessibility inspector, confirm the variable branch is announced as opening a dialog and the simple branch is not.

  Verified in rendered markup rather than with a screen reader: the variable product's button carries `aria-haspopup="dialog"`. The simple branch passes `undefined`, which React omits from the DOM entirely.

- [x] 3.6 Confirm the reveal-on-hover slot still holds its footprint in both states — no row reflow when a card's action appears.

  The slot `div`'s className is byte-identical to before; only its comment was reworded and the ternary inside it replaced. Not re-verified visually.

## 4. Regression check across listings

- [x] 4.1 Spot-check the other surfaces rendering `ProductCard` (`ProductListing` for category/search, `ProductSection` and `DealOfWeek` on home, the deals page, and `ProductDetail`'s related strip) for the same action, and confirm the wishlist, compare, discount, badge, and sold-out overlays are unchanged.

  All five call sites pass only `product`, so no surface can vary the action. The overlay markup is untouched by the diff. Note: `/wishlist` and `/compare` do **not** render `ProductCard` — they use `WishlistView` and `CompareTable`. The original task text listed them in error.

- [x] 4.2 Run the project's lint and type check, and its test suite if one covers `ProductCard`.

  `npx tsc --noEmit` clean; `npm run lint` 0 errors (one pre-existing unused-var warning in `ProductSection.tsx`, unrelated); `npm test` 114/114 across 8 files. No test covers `ProductCard` — the suite is `lib/` and `store/` pure functions.
