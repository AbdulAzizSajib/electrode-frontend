## 1. Backend — data model (`electrode-server`)

- [x] 1.1 Add `viewCount Int @default(0)` to `Product` in `prisma/schema/product.prisma`, with a doc comment matching the house style used for `totalSold` and `averageRating` — state that it is denormalized, what maintains it, and that it is a lifetime total with no live-window meaning. Added, with the "says nothing about the present moment" constraint stated explicitly so no future reader presents it as a live count.
- [x] 1.2 Add `@@index([viewCount])` — it becomes a public sort field in 3.2. Added.
- [x] 1.3 Add a `ProductView` model as the dedup ledger: product reference, an opaque viewer key, and a window marker. Document that it is never read to answer "how many viewers now" and is safe to prune (design Decision 2). Added `prisma/schema/ProductView.prisma`, plus a `@@index([windowStart])` to support pruning.
- [x] 1.4 Add a unique constraint across (product, viewer key, window) so a duplicate insert fails instead of being prevented by a read-then-write race. `@@unique([productId, viewerKey, windowStart])`, documented as the mechanism rather than a nicety.
- [x] 1.5 Generate the migration under `prisma/migrations/`, with the explanatory SQL header this repo uses (see `20260901000000_add_product_image_variant`). Confirm it is purely additive. `20260903081821_add_product_view_tracking`, applied and verified. **The three `pg_trgm` `DROP INDEX` statements reappeared exactly as the previous migration's note warned** — removed again, note carried forward. Verified post-deploy that all three trigram indexes survived and the new table exists.

## 2. Backend — recording a view

- [x] 2.1 Create the `productView` module following the repo's five-file convention (route/controller/service/validation/interface), mounted so the record endpoint sits under the product path. Follow `review.route.ts`'s nested-router pattern and mount above `router.use("/products", ...)`. Added `src/app/module/product-view/` (5 files), mounted at `/products/:id/views` above `/products` so the product router's `/:slug` cannot capture it first.
- [x] 2.2 Derive the viewer key: the authenticated customer id when present, otherwise a hash of IP + user-agent using a server-side secret. Never store the raw IP (design Risks). `req.ip` is already trustworthy — `app.set("trust proxy", 1)` is configured. `viewerKeyFor` HMACs IP + user-agent with `BETTER_AUTH_SECRET` — already a required env var, so no new required config.
- [x] 2.3 Reuse `optionalAuth` so a signed-in shopper is identified and a guest still counts. Applied on the route; being signed in only changes how the viewer is identified, never whether the view counts.
- [x] 2.4 Insert the dedup row and increment `Product.viewCount` in one transaction, using an atomic `{ increment: 1 }` (design Decision 4). A unique-constraint violation means "already counted" — succeed without incrementing, do not surface an error. Both in one `$transaction`; the catch treats a constraint violation (and a product deleted mid-flight) as the ordinary path.
- [x] 2.5 Reject requests whose user-agent matches a crawler list, and require the marker distinguishing "a shopper opened this page" from any other call. Both checks server-side (design Decision 3). `isBotUserAgent` covers 13 patterns and treats a missing UA as non-browser; the marker is a Zod `literal("product_detail")`, so a new caller must be added deliberately rather than by passing any label.
- [x] 2.6 Return quickly and identically whether or not the view was counted — the response must not let a caller probe whether a viewer key has already been seen. Always 202 with the same body. `recordView` returns `void` precisely so the controller cannot leak the distinction.
- [x] 2.7 Confirm the endpoint never throws into the product page's path: any failure is a non-2xx the storefront ignores. The service swallows its own failures, and the storefront fires this after paint and ignores the result — so even a 500 leaves the page rendering normally.

## 3. Backend — exposing the count

- [x] 3.1 Add `viewCount` to `PUBLIC_PRODUCT_SCALARS` so it reaches the detail payload. Added beside `totalSold`.
- [x] 3.2 Add `viewCount` to `PUBLIC_PRODUCT_SORT_FIELDS` in `product.validation.ts`. Note that file's stated rule — a field belongs in the allowlist only once it is in the public payload — so 3.1 comes first. Added after 3.1, honouring that rule.
- [x] 3.3 Add `viewCount` to the admin product list projection in `product.service.ts`, and confirm the admin list can sort by it. No change needed: the admin list uses `PRODUCT_LIST_INCLUDE` (an `include`, which returns every scalar), so `viewCount` arrives automatically — and admin sorting is deliberately not allowlisted, per the comment on `PUBLIC_PRODUCT_SORT_FIELDS`. Verified both by reading the projection.
- [x] 3.4 Confirm the list projection change does not alter `PUBLIC_PRODUCT_LIST_SELECT`'s deliberate omission of variant-level image data. Untouched — `viewCount` went into the shared scalars, not the image selection.

## 4. Storefront — types and mapping

- [x] 4.1 Add `viewCount: number` to `ApiProduct` and `Product` in `src/types/product.ts`. Optional on `ApiProduct` (a storefront may run ahead of the backend), required on the view model since the mapper always supplies it.
- [x] 4.2 Map it in `toProduct` in `src/services/product.ts`, defaulting to 0 when the field is absent so a storefront deployed ahead of the backend still renders. `product.viewCount ?? 0`.
- [x] 4.3 Add a compact number formatter to `src/lib/format.ts` alongside `formatPrice`, so large counts stay readable (spec: "readable at a glance"). `formatCount` — grouped thousands below 10,000, then `12.4K` / `1.2M`, trimming a trailing `.0`. 6 unit tests.

## 5. Storefront — recording the view

- [x] 5.1 Add a client component that records a view once per mount via a `useEffect`, mounted on the detail page. It must not be part of any RTK Query cache that could re-fire on window refocus (design Decision 1). Added `src/components/product/RecordProductView.tsx` — a plain `fetch`, not an RTK Query mutation, precisely so refocus cannot re-fire it. A ref guards against StrictMode's double effect.
- [x] 5.2 Add the storefront route handler proxying to the backend endpoint, following the existing `src/app/api/` proxy pattern so cookies are forwarded and a signed-in shopper is identified. Added `src/app/api/products/[id]/views/route.ts`. **Also had to widen `FORWARDED_HEADERS` in `api-proxy.ts` to carry `user-agent` and `x-forwarded-for`** — these routes run server-side, so without them every request reached the backend looking like it came from this one process and every guest would have collapsed into a single viewer key, breaking dedup across shoppers entirely.
- [x] 5.3 Make the call fire-and-forget: nothing awaited before paint, all failures swallowed, no error surfaced (spec: the page renders in full with no error). `void fetch(...).catch(() => {})` inside an effect; the response is never read.
- [x] 5.4 Confirm the call fires only from the detail page — not from listings, cards, quick view, related-products rows, or `generateMetadata`, which already calls `getProductBySlug` a second time per page load (design Decision 1). Verified by grep: the only caller is `RecordProductView`, and its only mount is `products/[handle]/page.tsx`. Mounted on the route rather than inside `ProductDetail` so it cannot be dragged into a preview later.
- [x] 5.5 Confirm nothing records a view inside `getProductBySlug` or any cached server path. Verified by grep — no view write exists anywhere in `src/services/`.

## 6. Storefront — presenting the count

- [x] 6.1 Delete the `viewers` state and its randomizing `useEffect` (`ProductDetail.tsx:141-146`) **and** the `eslint-disable` comment propping it up — the disable exists only because of the randomization. All three gone, and the now-unused `useEffect` import with them.
- [x] 6.2 Replace the rendered line (`ProductDetail.tsx:260-262`) with a plain statement of the real lifetime count, worded so it describes accumulated past views and claims nothing about the present moment (spec: "never claims to be live"). Now "1,240 people have viewed this product" — past tense, with singular/plural agreement. Commented alongside the existing note about the removed countdown, since it is the same principle.
- [x] 6.3 Render nothing at all when the count is zero — not a zero, not a placeholder. Guarded on `product.viewCount > 0`.
- [x] 6.4 Confirm the number is stable across re-renders of unchanged data. It is a prop read straight from the server payload; no state, no effect, no randomness remains in this path.

## 7. Admin (`electrode-admin`)

- [x] 7.1 Add a Views column to `src/features/catalog/products/products-list-page.tsx`, alongside the existing price and stock columns. Added after Stock.
- [x] 7.2 Wire sorting in both directions against the backend sort field from 3.2. **Sorted on the server, not in the table.** The `DataTable` supports client-side sorting, but this listing is paginated server-side, so an in-table sort would only reorder the ten rows already fetched — "show me the least-viewed products" would silently mean "of these ten", which is precisely the question the column exists to answer. So `ListParams` gained `sortBy`/`sortOrder` (the backend's `QueryBuilder` already accepted them), `listProducts` forwards them, and the page holds the sorting state and resets to page 1 on change. This is the first sortable column in the app. Verified both directions against the live API.
- [x] 7.3 Add `viewCount` to the admin product type in `src/lib/api/products.ts`. Optional, so a console running ahead of the backend still renders.
- [x] 7.4 Show `0` rather than a blank cell for an unviewed product (spec: zero views is a meaningful finding). `(viewCount ?? 0).toLocaleString()` — never a dash, so "nobody looked" cannot be mistaken for "no data".

## 8. Verify

- [x] 8.1 Opening a product page increments its count by exactly one; reloading several times does not increment further. Verified against the live endpoint: 0 → 1 on the first post, then unchanged across two repeats.
- [x] 8.2 A second product's count is unaffected by viewing the first. Q10 stayed at 0 throughout while Q86 climbed to 4.
- [x] 8.3 Two different viewers each counted; a repeat within the window not counted. Verified **through the storefront proxy** with two `X-Forwarded-For` values: distinct viewers each counted, the repeat deduped. This is what proved the `FORWARDED_HEADERS` fix in 5.2 — without it both would have hashed to the same key.
- [x] 8.4 A request with a crawler user-agent increments nothing. `Googlebot/2.1` returned an indistinguishable 202 and left the count unchanged, both directly and through the proxy.
- [x] 8.5 Browsing a listing, opening a quick view, and loading a related-products row increment nothing. Structural: the marker is a Zod `literal("product_detail")` and the only caller is `RecordProductView`, mounted solely on the detail route. A missing or wrong marker was verified to return 400 and count nothing.
- [x] 8.6 With the record endpoint failing, the product page still renders fully and shows no error. Posting a bogus product id returned 202 (the service swallows it, keeping the response indistinguishable) and the page rendered 200 with no error.
- [x] 8.7 A product with zero views shows no view line. Verified in the served HTML: Q10 has no view text **and no eye icon**, while Q86 renders "2 people have viewed this product" with the icon. (The 2 rather than 4 is `getProductBySlug`'s 60s `revalidate`, not a bug.)
- [x] 8.8 The admin list shows the column, sorts both ways, and its numbers match the storefront's. Column added and the build passes; sorting verified against the live API in both directions, with the public allowlist still rejecting `costPrice`. The admin UI itself needs a browser click-through — the endpoint requires a session.
- [x] 8.9 Confirm no raw IP address is stored anywhere in `ProductView`. Queried every stored row: all `viewerKey`s are opaque `a:<hmac>` values, and a regex for IPv4/IPv6 shapes matched none.
- [x] 8.10 Run the test suite and the linter in each repo touched. Storefront: 64 tests pass (6 new for `formatCount`), `tsc` clean, `eslint src/` 0 errors (2 pre-existing warnings in untouched files), build succeeds with `/api/products/[id]/views` registered. Server: `tsc` clean. Admin: `tsc -b` clean, build succeeds, lint clean on all changed files. Neither sibling repo has a test suite.
