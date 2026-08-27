## 1. Dependencies and types

- [x] 1.1 Add `@reduxjs/toolkit` and `react-redux`; remove the bogus `"root": "git+https://github.com/tanstack/react-query.git"` entry from `package.json` (design, Migration Plan)
- [x] 1.2 Add `src/types/product.ts`: the raw API shapes (`ApiProduct`, `ApiProductVariant`, `ApiProductImage`, `ApiProductAttribute`, paginated `meta`) with money as `string`, and the view model `Product` / `ProductVariant` with money as `number` (design D3)
- [x] 1.3 Add `src/types/cart.ts` for `ApiCart` / `ApiCartItem` — note there are no price or total fields on either; totals are derived (design, Context)
- [x] 1.4 Delete the old `Product`/`CartLine` interfaces from the previous `src/types/product.ts` content, keeping nothing that references `handle`/`title`/`vendor`

## 2. Product service

- [x] 2.1 Add `src/services/product.ts` with `getProducts(params)` calling `GET /products`, passing through `page`/`limit`/`searchTerm`/`category`/`brand`/`minPrice`/`maxPrice`, and returning both the mapped products and the `meta` block
- [x] 2.2 Add `getProductBySlug(slug)` calling `GET /products/:slug`, returning the product with its `variants` and `attributes` mapped
- [x] 2.3 Write the API→view-model mapper: parse `price`/`compareAtPrice`/variant prices to numbers, pick the primary image (`isPrimary`, else first, else placeholder), flatten `brand.name` and `category.name` (design D3). Also handles `campaignPrice`: when a campaign is active it becomes the effective price and the base price becomes the comparison
- [x] 2.4 Use `apiFetch`'s `revalidate` option with a 60s window for product reads (design D5)
- [x] 2.5 Return an empty result on failure for listings, and `null` from `getProductBySlug` for a 404, so callers can render an empty state or `notFound()` (spec: "Listings degrade safely")
- [x] 2.6 Verify against the live backend: 5 products returned, prices parsed as numbers, primary image selected, `meta.total` present. Added `roundMoney()` to `src/lib/format.ts` after this check exposed float drift (79.99×3 = 239.96999…), so line totals and subtotals cannot disagree by a cent

## 3. Migrate product display

- [x] 3.1 Update `ProductCard.tsx` to the new `Product` shape: `name`, `slug`, `brand`, primary `image`, numeric prices; keep the existing visual design (spec: "A product displays its identifying and commercial details"). Dropped `StarRating` from the card — the catalog API exposes no rating field
- [x] 3.2 Branch the card's button on `type`: `VARIABLE` → **Options** linking to the detail page; `SIMPLE` → **Add to cart** (design D4; spec: "Products requiring a choice are distinguished from those that do not")
- [x] 3.3 Disable Add to cart and show an unavailable indicator when `stockQuantity` is 0 (spec: "Product availability is communicated honestly")
- [x] 3.4 Render a placeholder when a product has no image, keeping it selectable (spec: "Product image is missing") — handled in the service's `pickImages`, so every consumer benefits
- [x] 3.5 Convert `ProductListing.tsx` to render server-fetched products; keep search/category/brand filtering working, driven by the API rather than a local array (spec: "Shoppers can narrow the catalog"). Filters now live in the URL and query the API server-side; `src/app/products/page.tsx` owns the fetching
- [x] 3.6 Update `ProductFilters.tsx` to source its category and brand options from real data rather than `@/data/products`. Added `src/services/brand.ts`, and `resolveCategorySlug()` in the category service to translate link slugs into the ids `GET /products` filters on
- [x] 3.7 Add loading and empty/error states to the listing, with the empty state distinguishable from a failure (spec: "Listings degrade safely")
- [x] 3.8 Ensure the shopper can reach matches beyond the first page, using `meta.totalPages` (spec: "More matches than fit on one page")

## 4. Product detail page

- [x] 4.1 Convert `src/app/products/[handle]/page.tsx` to fetch via `getProductBySlug`; remove `generateStaticParams` (design D5)
- [x] 4.2 Call `notFound()` when the product does not exist or is inactive (spec: "Product not found")
- [x] 4.3 Update `generateMetadata` to use the fetched product's `name`
- [x] 4.4 Update `ProductDetail.tsx` to present each variant as a selectable choice, with the displayed price following the selected variant (spec: "Detail view presents the available choices"). Out-of-stock variants render disabled; price, compare-at, discount, SKU and stock all follow the selection
- [x] 4.5 Add to cart from the detail page sends the selected `variantId`; block adding until a variant is chosen for a `VARIABLE` product (design D4). First in-stock variant is pre-selected so the choice is explicit but not obstructive
- [x] 4.6 Render the product's `attributes` (e.g. Brand, Connectivity) in the detail view

## 5. Cart proxy route handlers

- [x] 5.1 Add `src/app/api/cart/route.ts` — `GET` forwards to `GET /cart`, relaying request cookies and re-issuing `Set-Cookie` (notably `guestToken`) on this app's domain (design D2). Shared plumbing extracted to `src/lib/cart-proxy.ts`, which also strips `Domain=` and (in dev) `Secure` so the cookie binds to the storefront host over http
- [x] 5.2 Add `src/app/api/cart/items/route.ts` — `POST` forwards to `POST /cart/items` with `{ productId, variantId?, quantity }`
- [x] 5.3 Add `src/app/api/cart/items/[itemId]/route.ts` — `PATCH` (quantity) and `DELETE` forwarding to the matching `/cart/items/:itemId` routes
- [x] 5.4 Add `src/app/api/cart/coupon/route.ts` — `POST` forwards to `POST /cart/apply-coupon`, `DELETE` to `DELETE /cart/coupon`; relay the `appliedCoupon` cookie both ways
- [x] 5.5 Relay backend error status and message through the proxy unchanged, so the client can surface e.g. "Coupon not found" (spec: "Invalid coupon is rejected")
- [x] 5.6 Verify with the backend running that a guest add issues a `guestToken` cookie on the storefront's own domain and that a follow-up `GET /api/cart` returns the same cart — verified, plus PATCH/DELETE and the invalid-coupon 404 relaying verbatim

## 6. Redux store and cart API

- [x] 6.1 Add `src/store/index.ts` with `configureStore`, and `src/store/StoreProvider.tsx` as a client component wrapping `<Provider>`. Store is built per client via `makeStore()` rather than a module singleton, so a server render cannot leak one visitor's cart into another's
- [x] 6.2 Mount `StoreProvider` in `src/app/layout.tsx`, replacing `CartProvider` (keep the server-side `user` and `categories` props intact)
- [x] 6.3 Add `src/store/cartApi.ts` via `createApi` with a `Cart` tag and `baseUrl: "/api/cart"`; endpoints `getCart`, `addItem`, `updateItemQuantity`, `removeItem`, `applyCoupon`, `removeCoupon` (design D1)
- [x] 6.4 Invalidate the `Cart` tag from every mutation so the cart refetches and matches the server (spec: "Server rejects a change")
- [x] 6.5 Add selectors/helpers deriving line unit price (variant price when a variant is set, else product base price), line totals, subtotal, and item count (design D3; spec: "A line is priced by what the shopper actually chose"). Added `src/store/uiSlice.ts` for cart-drawer open state, which the old context also owned and RTK Query does not cover

## 7. Migrate cart UI

- [x] 7.1 Update `CartDrawer.tsx` to read from `useGetCartQuery` and mutate via the RTK Query hooks
- [x] 7.2 Update `src/app/cart/page.tsx` the same way, including line quantity controls and removal. Shared stepper/remove extracted to `src/components/cart/CartLineControls.tsx` so both views behave identically; stepping below 1 removes the line, since the API rejects quantity 0
- [x] 7.3 Update the header item count to come from the cart query, updating without a page reload (spec: "Count updates after a change")
- [x] 7.4 Add optimistic item-count updates via `onQueryStarted`; leave money strictly server-derived (design D6)
- [x] 7.5 Disable add/update controls while their mutation is in flight (spec: "Double submission is prevented")
- [x] 7.6 Add a coupon input and remove control on the cart page, showing the discount in the summary (spec: "Shoppers can apply and remove a coupon")
- [x] 7.7 Show an empty-cart state with a link back to browsing, and a distinct "cart unavailable" state on fetch failure (spec: "Empty cart", "Cart service unavailable")

## 8. Clean up

- [x] 8.1 Delete `src/contexts/cart-context.tsx` and `src/data/products.ts`; confirm no remaining imports of either. Also migrated `src/app/checkout/page.tsx`, which consumed the old context — it stays a UI-only mock but no longer clears the cart client-side, since only a real order should empty a server-owned cart
- [x] 8.2 Update `src/app/page.tsx` (homepage sections) and `src/app/deals/page.tsx` to server-fetch real products; deals filters on a present `compareAtPrice`
- [x] 8.3 Remove now-unused static product helpers (`getProductByHandle`, `getRelatedProducts`) and any leftover placeholder imagery references — removed wholesale with `data/products.ts`

## 9. Verify

- [x] 9.1 With the backend running, confirm the listing shows the 5 real products with correct names, prices, brands, and Cloudinary images — all 5 verified, "5 Products" count correct
- [x] 9.2 Confirm a `VARIABLE` product's card shows **Options** and reaches the detail page; selecting Pro vs Standard changes the displayed price — 5/5 cards show Options; both variants render with distinct prices. Fixed a bug found here: a variant whose price equalled the product's base price rendered with no price while its siblings showed theirs, which read as a rendering fault. Prices now show on every chip whenever the variants differ from each other
- [x] 9.3 Add from the detail page with a variant; confirm the cart line is priced at the variant's price, not the base price (spec: "Variant price is used") — Pro Edition priced at $109.99, not the $79.99 base
- [x] 9.4 Re-add the same product+variant and confirm the quantity increments rather than creating a duplicate line; add a different variant and confirm a separate line (spec: "Re-adding the same selection increments it") — verified; subtotal $299.97 matched the sum of line totals exactly
- [x] 9.5 As a guest, add an item, reload, and confirm the cart persists; then sign in and confirm the guest cart merged into the account (spec: "Guest cart carries into the account on sign-in") — guest cart persisted across requests and stayed isolated from another guest; on login the items carried over, the cart became customer-owned, and `guestToken` was cleared
- [x] 9.6 Apply an invalid coupon and confirm the message surfaces and the cart is unchanged (spec: "Invalid coupon is rejected") — 404 "Coupon not found" relayed verbatim, cart bytes identical before and after
- [x] 9.7 Stop the backend and confirm listings and cart show their unavailable states while pages still render (spec: "Catalog unavailable", "Cart service unavailable") — every page returned 200; listing showed "No products are available right now", deals its own message, categories menu hidden, cart proxy a clean 503
- [x] 9.8 Run `npx next build`, `npx eslint src --max-warnings=0`, and `npx tsc --noEmit` clean
