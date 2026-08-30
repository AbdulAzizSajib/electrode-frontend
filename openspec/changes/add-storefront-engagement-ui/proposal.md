## Why

The backend change `add-storefront-engagement-apis` (in `electrode-server`) shipped the endpoints four storefront surfaces need, and they are live and verified. The storefront consumes none of them:

- **Ratings do not exist in this app at all.** A repo-wide search for `review|averageRating|reviewCount` returns zero hits. `StarRating` (`src/components/ui/StarRating.tsx`) is rendered exactly once — with a hardcoded `rating={5}` on static testimonials (`src/components/home/Testimonials.tsx:16`). `ProductCard` and `ProductDetail` render no rating markup, and `ApiProduct`/`Product` carry no rating fields. Meanwhile `GET /products` already returns `averageRating` and `reviewCount` on every product (verified against a running server).
- **Related products are synthesized.** `src/app/products/[handle]/page.tsx:29-45` re-queries the catalog by category with `limit: 7`, filters the current product out, falls back to re-querying the *entire* catalog when the category yields nothing, and slices to 6 — plus a whole category-tree fetch just to translate a slug to an id. `GET /products/:slug/related` now does this properly server-side, with relevance scoring.
- **There is no review UI whatsoever.** The product-detail tab strip is hardcoded to exactly two tabs (`["description", "shipping"]`), there is no review list, no rating histogram, no way to write a review, and no `/account/reviews` page.
- **The wishlist is a 17-line static empty state** whose own copy admits it: "once wishlist syncing is connected to a backend." The header shows a literal `"0 Reorder"` string, the "Wishlist" button on product detail has no `onClick`, and `ProductCard` has no save control at all.

## What Changes

### Product ratings (catalog)

- Add `averageRating` and `reviewCount` to `ApiProduct` and `Product`, mapped in `toProduct` — the single place both server- and client-fetched products converge, so ratings appear everywhere a product does with no per-surface work.
- `averageRating` arrives as a **decimal string** (`"0"`, `"4.50"`) like every other money/decimal field on this API, so it is parsed to a number at the mapping boundary rather than in components.
- Render stars plus review count in `ProductCard` and `ProductDetail`. A product with `reviewCount === 0` shows **no rating at all** rather than an empty five-star row — an unrated product must not look one-star-rated.

### Related products (catalog)

- Replace the synthesized query in `src/app/products/[handle]/page.tsx` with `getRelatedProducts(slug, limit)` calling `GET /products/:slug/related?limit=6`. `ProductDetail` already takes a `related: Product[]` prop and needs no change.
- Drops the `resolveCategorySlug` slug→id round trip and the whole-catalog fallback: the endpoint backfills with featured/newest ACTIVE products itself, so it does not return an empty list on a populated catalog.

### Product reviews (new capability surface)

- A **Reviews tab** on product detail: the published review list (paginated), each with rating, author name, and date, plus a rating summary histogram built from `meta.ratingBreakdown` (`{average, total, counts: {1..5}}`).
- A **write path** for signed-in customers. The backend permits a review only from a customer with a qualifying completed order for that product, and at most one review per product — so the UI must treat 403 and the duplicate case as ordinary, explainable outcomes rather than errors, and offer editing instead of a second submission.
- An **`/account/reviews` page** listing the customer's own reviews across all statuses, including `PENDING` and `REJECTED`, with edit and delete. Editing an approved review returns it to `PENDING` for re-moderation — the UI states this before the customer submits.

### Wishlist (new capability surface)

- A real `/wishlist` page: paginated, listing saved products with current catalog price and availability, with remove and "move to cart".
- A **heart toggle** on `ProductCard` and on the currently-dead `ProductDetail` "Wishlist" button, reflecting saved state and toggling it.
- A **live count badge** in the header, replacing the hardcoded `"0 Reorder"`, matching how the cart badge already works.
- **BREAKING (internal)**: none externally. `/wishlist` is already auth-gated in `src/proxy.ts`, so the page's audience does not change.

## Capabilities

### New Capabilities

- `storefront/product-reviews`: Shoppers read a product's published reviews and its rating breakdown; verified purchasers write, edit, and withdraw their own review and track its moderation status.
- `storefront/wishlist`: A signed-in shopper saves products, sees an accurate saved count wherever it is shown, and manages the saved set including moving an item into the cart.

### Modified Capabilities

- `storefront/product-catalog`: Products carry an aggregate rating and review count that are displayed in listings and on detail; related products come from a dedicated relevance-scored endpoint rather than a category re-query.

## Impact

**New files:**
- `src/types/review.ts`, `src/types/wishlist.ts` — wire (`Api*`) and view-model shapes, following the two-layer convention in `src/types/product.ts`.
- `src/services/review.ts` — server-side fetchers for the public review list (public, cookie-free, so direct to the backend).
- `src/store/reviewApi.ts`, `src/store/wishlistApi.ts` — RTK Query slices; both must be registered in `src/store/index.ts` in **both** the `reducer` map and the `middleware` concat list.
- `src/app/api/wishlist/**`, `src/app/api/reviews/**` — BFF route handlers using `proxyRequest`, mirroring `src/app/api/addresses/`.
- `src/app/account/reviews/page.tsx`, review components, wishlist components.

**Modified:**
- `src/types/product.ts`, `src/services/product.ts` (`toProduct`) — rating fields.
- `src/components/product/ProductCard.tsx` — rating row + heart toggle (neither exists today).
- `src/components/product/ProductDetail.tsx` — rating row, a third tab (the tab state is currently a two-member union type), wire up the dead Wishlist button.
- `src/app/products/[handle]/page.tsx` — related products.
- `src/app/wishlist/page.tsx` — replaced entirely.
- `src/components/layout/Header.tsx` — wishlist count badge.
- `src/app/account/page.tsx` — a Reviews entry in the account shortcuts.
- `src/store/index.ts` — register the two new API slices.

**Authentication boundary:** wishlist calls and review writes are cookie-authenticated, so they **must** go through Next route handlers — the backend sets httpOnly cookies on its own domain that a cross-site browser fetch cannot carry (`src/lib/api-proxy.ts:4-17`). Public review reads and the ratings on products are cookie-free and go direct, matching `productApi`.

**Out of scope** — these appear in `dynamic-storefront-roadmap`'s aspirational specs but the backend does not support them, and this change does not invent them: guest (signed-out) wishlists and guest→account merge on sign-in (every wishlist endpoint resolves a customer from `userId` and returns 401 otherwise), "mark review helpful" vote counts (no such field exists), and clearing the whole wishlist in one action (no endpoint). Also out of scope: `GET /settings/public` and the header/footer/branding work it feeds — explicitly excluded from this change by request.
