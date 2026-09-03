## Why

The product page tells every shopper a number it made up. `ProductDetail` renders "22 people are viewing this right now" from `useState(14)` plus a `useEffect` that replaces it with `8 + Math.floor(Math.random() * 20)` — a different lie on every mount, with an eslint-disable holding it in place. This is the same class of fabrication as the "Deal Ends In" countdown that was deliberately removed from this page earlier; the viewers line survived that cleanup.

The number is also the only signal a merchant would want and cannot get. `Product` already carries denormalized `averageRating`, `reviewCount` and `totalSold`, but nothing records that a product was *looked at*. A merchant can see what sold and what was reviewed, and has no way to tell a product nobody finds from a product everyone finds and rejects — the two look identical in the admin list.

## What Changes

- **Product views are counted for real.** A new lifetime `viewCount` on `Product`, incremented when a shopper opens a product detail page. It is a lifetime total, not a live-window count.
- **BREAKING (copy, not API): the "right now" line is replaced.** "22 people are viewing this right now" becomes a plain statement of the real lifetime count — "1,240 people viewed this" — because a lifetime total cannot honestly claim anything about *right now*. No live-viewers window is introduced in this change; a product with no recorded views shows nothing rather than a zero.
- **The count is deduplicated per viewer.** A single shopper reloading the page, or Next.js re-rendering it, must not inflate the number. Dedup is per viewer per product within a window, so the count means "how many people looked", not "how many requests arrived".
- **Bots and the merchant's own traffic do not count.** A crawler hitting every product page must not make every product look popular.
- **The admin product list gains a Views column.** Sortable, so a merchant can rank the catalogue by attention and compare it against sales.
- **`viewCount` becomes part of the public product payload** so the storefront can render it, and becomes an allowlisted public sort field so "most viewed" ordering is possible later.

## Capabilities

### New Capabilities
- `storefront/product-view-count`: What counts as a product view, how views are deduplicated per viewer, which traffic is excluded, and how the recorded count is presented to a shopper on the product page — including what is shown when a product has no views yet. This is its own capability rather than part of `storefront/product-catalog` because it governs a write the storefront performs as a side effect of rendering, with its own correctness rules (dedup, bot exclusion) that have nothing to do with how a product is displayed.

### Modified Capabilities
<!-- None. `storefront/product-catalog` does not exist under `openspec/specs/` — the changes that introduced it were never archived — so there is no existing requirement to amend. -->

## Impact

**Depends on**
- `electrode-server`: a `viewCount` column on `Product`, a Prisma migration, an endpoint to record a view, dedup and bot-exclusion logic, `viewCount` added to `PUBLIC_PRODUCT_SCALARS` and to `PUBLIC_PRODUCT_SORT_FIELDS` in `product.validation.ts`, and exposure on the admin product list projection. This change is inert until that ships.
- `electrode-admin`: a Views column on `products-list-page.tsx` and its sort wiring.

**Storefront code**
- `src/components/product/ProductDetail.tsx` — delete the `viewers` state and its randomizing effect (lines 141-146) and the eslint-disable that props it up; replace the rendered line (260-262).
- `src/types/product.ts` — `viewCount` on `ApiProduct` and `Product`.
- `src/services/product.ts` — map it in `toProduct`.
- A record-view call path. Because the detail page is a server component and the record is a write, this needs a deliberate choice of where the call originates — see design.

**Not in scope**
- No live "N people viewing now" window, and therefore no `ProductView` row table. If that is wanted later it is a separate change with its own storage.
- No view tracking on listing pages, cards, or quick view — only the detail page.
- No per-customer view history, "recently viewed", or recommendations built on view data.
- No analytics dashboard charts; the admin surface here is one column on an existing list.
