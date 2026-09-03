## Why

The Compare button on the product page does nothing. It is a `<button>` with an icon, a label, and no `onClick` — `ProductDetail.tsx:364-366`. A shopper who clicks it gets no feedback of any kind, which reads as a broken page rather than a missing feature.

Comparing is the deciding step for the products this store sells. Earbuds, headphones and speakers differ on a handful of spec rows that are individually small and collectively decisive, and the store already collects exactly that data as `ProductAttribute` rows rendered in the detail page's specifications table. Today a shopper who wants to weigh two of them against each other opens two tabs and scrolls.

## What Changes

- **The Compare button works.** It adds the product to a compare list and reflects that the product is in it, so a second click removes it. The button becomes a real toggle rather than decoration.
- **The compare list is client-owned and persists on the device.** Compare is a browsing aid, not an account feature — it must work for a signed-out shopper with no prompt to log in, and survive navigating between products and reloading the page. This introduces the app's first client-persisted store; cart and wishlist are both server-owned, so there is no existing pattern to follow.
- **A compare bar shows what is currently being compared.** Persistent while the list is non-empty, with each product removable from it and a way to clear it entirely — otherwise a shopper who added something three pages ago has no idea it is still there.
- **A dedicated compare page puts the products side by side.** Image, name, price, rating and the specification attributes aligned row by row, so equivalent specs line up and a missing spec on one product is visible as missing rather than as a shifted row.
- **Rows where every product agrees can be collapsed away.** The point of the page is the differences; identical rows are noise.
- **The list is capped.** Side-by-side comparison stops working past a few columns on a phone, so there is a maximum, and attempting to exceed it is handled explicitly rather than silently dropping the product.
- **Compare is reachable from listings, not only the detail page.** A shopper builds a comparison while browsing a category; requiring them to open each product first defeats it.

## Capabilities

### New Capabilities
- `storefront/product-compare`: What the compare list is, how products enter and leave it, how long it survives, what happens at its capacity limit, and how the comparison is presented — including how differing and identical specifications are treated, and how products that do not share a specification are aligned.

### Modified Capabilities
<!-- None. `storefront/product-catalog` does not exist under `openspec/specs/` — the changes that introduced it were never archived — so there is no existing requirement to amend. -->

## Impact

**Storefront code — this change is entirely frontend; no backend or admin work.**
- `src/store/` — a new compare slice. Every existing store member (`cartApi`, `wishlistApi`, …) is RTK Query over server state; compare is local state, so it follows `uiSlice`'s shape rather than the API pattern. Registered in `makeStore()`.
- Persistence layer — `localStorage` appears nowhere in `src` today. Hydration must not run during SSR, and the store is constructed per request (`makeStore()` exists specifically so state does not leak between visitors), so reading persisted state needs a deliberate client-side hydration step rather than a `preloadedState`.
- `src/components/product/ProductDetail.tsx:364-366` — the dead button becomes a real toggle.
- `src/components/product/ProductCard.tsx` and `ProductQuickView.tsx` — compare affordance added; `WishlistButton` is the structural template for a control used both standalone and inline on a card.
- New compare bar component, mounted app-wide alongside the existing drawers in `src/components/layout/`.
- New `/compare` route under `src/app/`.
- Header and mobile nav — a compare entry with a count, mirroring the existing wishlist badge.

**Data**
- The compare page needs full product detail (attributes are absent from the list projection), while the persisted list should hold identifiers only — storing product snapshots would show stale prices. Fetching detail for each compared product is required.

**Not in scope**
- No server-side compare list, no cross-device sync, no `/api/compare` proxy routes.
- No sharing a comparison by url.
- No restriction that compared products share a category, and no automatic "compare with similar" suggestions.
- No comparison of variants within a single product.
