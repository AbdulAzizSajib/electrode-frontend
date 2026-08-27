## Context

See `proposal.md` — Why. The constraints that shape the approach, all verified against the running backend:

- **Prices are decimal strings.** `"79.99"`, not `79.99`. Every price, compare-at price, and variant price. Arithmetic on these without conversion silently produces string concatenation.
- **Cart responses carry no money at all.** `GET /cart` returns `{ id, customerId, guestToken, createdAt, updatedAt, items, discount }`. A cart item is `{ id, cartId, productId, variantId, quantity, product, variant }` — no unit price, no line total, no subtotal. The storefront computes every total.
- **All 5 products are `VARIABLE` and every one has variants**, priced differently from the base (Xiaomi Hub: base `79.99`, Standard `79.99`, Pro `109.99`). The list endpoint omits `variants`; only `GET /products/:slug` includes them.
- **The backend does not enforce stock on add.** Adding 999 of a 30-stock item returns 201.
- **The backend does not require a `variantId` for a VARIABLE product.** Adding without one returns 201 and prices at base — which is exactly the silent-mispricing trap the spec forbids.
- **Cart identity lives in httpOnly cookies on the API's domain** — `guestToken` and `appliedCoupon`. Same cross-site problem the auth work already solved: cookies the backend sets are invisible to this app.
- **Existing shape mismatch.** Current `Product` uses `handle`/`title`/`vendor`/`image`; the API uses `slug`/`name`/`brand.name`/`images[]`. Six files import `@/data/products`.
- **The detail page uses `generateStaticParams`** over the static array — meaningless once products come from an API.

## Goals / Non-Goals

**Goals:**

- One product shape, converted once at the service boundary, so no component ever parses a price string.
- A cart that is server-truth, works for guests, and cannot be double-submitted.
- Preserve the existing card/listing/drawer visual design — this is a data and state change, not a redesign.

**Non-Goals:**

- Checkout and order placement. The cart feeds it later; this change stops at the cart.
- Wishlist (auth-only, separate UX).
- Client-side price or discount calculation beyond line totals and subtotal — tax, shipping and free-shipping thresholds are applied by the backend at checkout.
- Reworking filters into server-driven query params beyond what the listing already exposes.

## Decisions

### D1: Redux Toolkit for the cart, via RTK Query

The user chose Redux Toolkit. Worth stating once: the cart is becoming *server-owned* state, and a plain Redux slice would solve storage while leaving fetching, caching, invalidation, and in-flight tracking to hand-rolled thunks. RTK Query ships inside `@reduxjs/toolkit` at no extra dependency and is purpose-built for exactly that, so this change uses RTK Query rather than raw slices — the user gets Redux and its devtools, without reimplementing a cache.

Shape: one `cartApi` with a `Cart` tag. Queries/mutations: `getCart`, `addItem`, `updateItemQuantity`, `removeItem`, `applyCoupon`, `removeCoupon`. Every mutation invalidates `Cart`, so the refetch that follows is what satisfies the spec's "displayed cart reflects what the server holds".

*Alternative rejected:* a `cartSlice` with `createAsyncThunk`. More code, and every mutation would need manual loading/error/refetch bookkeeping that RTK Query gives for free.

*Alternative rejected:* keeping React Context. Viable and dependency-free, but the user chose Redux.

### D2: Cart calls go through Next Route Handlers, not straight to the backend

RTK Query runs in the browser, but the cart's `guestToken` and `appliedCoupon` cookies are httpOnly and set on the API's domain — a browser fetch cannot carry them cross-site, and JS could not read them anyway. So `cartApi`'s `baseUrl` is a local `/api/cart/*` set of Route Handlers that forward to the backend, relay the request cookies, and re-issue `Set-Cookie` on this app's own domain.

*Why not Server Actions:* they were right for auth (form-driven, one-shot, server-rendered result). The cart is different — RTK Query needs an HTTP endpoint to own the cache, and the drawer updates without navigation. Route Handlers give RTK Query something to talk to while keeping cookie handling server-side.

*Consequence:* a new `src/app/api/cart/` surface. It is a thin proxy — no business logic — and it is the only place cart cookie plumbing lives.

### D3: One `Product` shape, converted at the boundary

The service layer converts every API product into a view model with **numbers** for money and a single `image` chosen from `images[]` by `isPrimary` (falling back to the first, then to a placeholder). Components never see `"79.99"` or an image array.

*Why:* the string-vs-number trap is real and would surface as `"79.99" * 2 = NaN` deep in a total. Converting once, in one file, means a component cannot get it wrong.

*Money representation:* parse to `number`. Values here are small two-decimal amounts and totals are a sum of products; `number` is exact enough at this scale and avoids a decimal library. Revisit if multi-currency or interest-style math ever appears.

### D4: `VARIABLE` ⇒ Options button; `SIMPLE` ⇒ Add to cart

The card branches on the product's `type`, not on whether variants were returned — the list endpoint never returns variants, so "has variants" is unknowable there. `type: "VARIABLE"` renders **Options** linking to the detail page; `type: "SIMPLE"` renders **Add to cart**.

*Why not add VARIABLE at base price:* the backend permits it (verified 201), which makes it a trap rather than a feature — the shopper is charged base price for a variant they never picked. The spec forbids this outright.

*Note:* the card already has this exact branch today (`product.options`), so this is a change of predicate, not of structure. In practice every current product is VARIABLE, so every card shows Options until a SIMPLE product exists.

### D5: Product data is fetched server-side; only the cart is client state

Listings and the detail page are Server Components calling the product service directly. Products are public, cacheable, and SEO-relevant — sending them through RTK Query would push rendering to the client and lose that for no gain.

So the split is: **products = server-fetched, cached; cart = client, RTK Query.** Redux holds only the cart.

`generateStaticParams` is dropped from the detail page — it enumerated the static array, and pre-rendering the catalog at build time would serve stale prices. The page becomes dynamic, consistent with every other route (all are already `ƒ Dynamic` because the layout reads cookies).

Product fetches reuse the `revalidate` option added to `apiFetch` by `add-dynamic-category-menu`, with a short window: catalog data changes more often than categories, so 60s rather than 300s.

### D6: Optimistic item count, authoritative everything else

The header's item count updates optimistically via RTK Query's `onQueryStarted`, then reconciles on the invalidation refetch. Line totals and the subtotal are never optimistic — they are rendered from server data only.

*Why the split:* the count is the one thing a shopper watches for immediate feedback after clicking Add; showing money that later corrects itself is worse than showing money a moment later. Add controls disable while their mutation is in flight, satisfying the spec's double-submission requirement.

## Risks / Trade-offs

- **Redux for a single slice of state** → RTK Query keeps it to one `createApi` call plus a provider, so the overhead is small and the store is there if more client state arrives. Noted in D1 as the user's explicit choice.
- **`number` for money** → Exact for two-decimal values at this magnitude; the failure mode (fractional-cent drift) needs far more accumulation than a cart subtotal. Documented so a future multi-currency change revisits it.
- **The proxy is a new surface to keep correct** → Kept deliberately dumb: forward method, body, and cookies; relay status and `Set-Cookie`. No logic means little to get wrong, and it is the single place cart cookies are handled.
- **Stock is not enforced on add** → The storefront disables Add for zero-stock items but must not promise availability (spec: "Stock changes between browsing and adding"). Real enforcement belongs at checkout, out of scope here.
- **Deleting `src/data/products.ts` touches six files at once** → Sequenced in tasks so the type and service land first and consumers migrate one at a time, rather than one commit that breaks every page.
- **Guest carts can accumulate server-side** → Every anonymous visitor who adds an item creates a cart row. A backend concern, not a storefront one; noted for the merchant's awareness.

## Migration Plan

No data migration. One frontend release, plus a dependency change.

1. Add `@reduxjs/toolkit` + `react-redux`; remove the bogus `"root"` dependency.
2. Add product/cart types and the product service. No behavior change yet.
3. Migrate product consumers to the service, one file at a time (listing → card → detail → homepage → deals).
4. Add the cart Route Handlers, the RTK Query api, and the store provider.
5. Switch the drawer, cart page, and header count to RTK Query; delete `cart-context.tsx` and `data/products.ts`.

**Rollback:** revert the release. Server-side carts created in the interim remain valid and are simply no longer read by the reverted client.

**Note on shopper carts:** existing `localStorage` carts are *not* migrated — they reference fictional product ids the backend would reject. They are abandoned; a returning shopper starts with an empty server cart. Acceptable because no real order was ever placeable from them.

## Open Questions

- Should applying a coupon be exposed on the cart page only, or also in the drawer? Placement does not change the specs, the endpoints, or the task breakdown — the cart page is assumed and the drawer can gain it later.
