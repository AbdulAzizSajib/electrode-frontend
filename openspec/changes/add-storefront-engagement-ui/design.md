## Context

See proposal.md — Why. Design-relevant constraints, all verified in this codebase and against a running backend rather than assumed:

- **This is Next.js 16.3.1 / React 19.2.8**, which `AGENTS.md` explicitly flags as diverging from model training data. Any App Router / caching / route-handler API used here must be checked against `node_modules/next/dist/docs/` before it is written, not recalled.
- **The two-layer type convention** (`src/types/product.ts:1-11`): `Api*` interfaces are the wire shape (money as decimal **strings**), unprefixed interfaces are the view model (money as `number`). Conversion happens once at the service boundary so `"79.99" * 2` never reaches a component.
- **`toProduct` (`src/services/product.ts:61-101`) is shared by server and client** — imported by the `src/services/*` fetchers and by `src/store/productApi.ts:42`. A field added there appears on every product everywhere, server- or client-fetched. This is why ratings need no per-surface plumbing.
- **The BFF rule** (`src/lib/api-proxy.ts:4-17`): the backend authenticates via httpOnly cookies on *its own* domain, which a cross-site browser fetch cannot carry and JS cannot read. Cookie-authenticated calls therefore go through a local `/api/*` route handler that forwards cookies and rewrites `Set-Cookie` onto the storefront's host. Public, cookie-free reads go direct (`productApi` does, and documents why).
- **`proxyRequest` forwards an allowlist of cookies** (`api-proxy.ts:29-35`: `guestToken`, `appliedCoupon`, `accessToken`, `refreshToken`, `better-auth.session_token`) and only the `idempotency-key` header. Anything else is dropped silently.
- **Verified backend response shapes** (queried against a running server, not read off the proposal):
  - `GET /products` and `/products/:slug` already return `averageRating` as a **decimal string** (`"0"`, `"4.50"`) and `reviewCount` as a **number**.
  - `GET /products/:slug/related` returns the *same product shape* as the catalog list, so `toProduct` maps it unchanged.
  - `GET /products/:id/reviews` returns `meta.ratingBreakdown = { average: number, total: number, counts: { "1".."5": number } }`, alongside the usual pagination meta.
  - Public reviews include `customer: { id, firstName, lastName, avatar }`; `GET /reviews/me` includes `product: { id, name, slug }`.
  - Every `/wishlist*` endpoint returns **401 unauthenticated** — there is no guest wishlist.
- **Review eligibility is enforced server-side** (`review.service.ts:64-89`): a review requires a qualifying order in a completed status (**403** otherwise) and is limited to one per product. Editing an approved review resets it to `PENDING`.
- `/wishlist` and `/account/*` are already auth-gated in `src/proxy.ts:18-23`, which is an optimistic redirect, not the authorization boundary.

## Goals / Non-Goals

**Goals:**
- Consume the endpoints that already exist, in the patterns this codebase already established (`addressApi` + `/api/addresses` for authenticated CRUD; `productApi` for public reads).
- Make the two "lying" surfaces honest: the hardcoded `"0 Reorder"` header count and the wishlist page that says syncing is not connected.
- Keep rating display truthful — an unrated product shows nothing, not zero stars.

**Non-Goals:**
- No guest wishlist and no guest→account merge. Every wishlist endpoint resolves a customer from `userId`; there is nothing to call for a signed-out shopper. The roadmap spec's guest requirements stay unbuilt and are called out as such in proposal.md.
- No "mark review helpful" — no such field exists on the backend.
- No "clear entire wishlist" — no endpoint.
- No `GET /settings/public` / header-footer-branding work. Excluded from this change by request.
- No admin-side review moderation UI (that is `electrode-admin`).
- No change to `Testimonials.tsx`. Its hardcoded `rating={5}` is site testimonial content, not product review data, and rewiring it is a separate concern.

## Decisions

**1. Ratings enter through `toProduct`, and absence is modelled as `undefined` rather than `0`.**
`ApiProduct` gains `averageRating: string` and `reviewCount: number`; `Product` gains `rating?: number` and `reviewCount: number`. In `toProduct`, `rating` is set **only when `reviewCount > 0`** — parsing `"0"` to a literal `0` and handing it to `StarRating` would render a zero-star row on every unrated product, which the spec forbids and which reads as "rated badly" rather than "not yet rated". `StarRating`'s existing `rating = 0` default already renders five empty stars, so the guard must live in the mapper, not the component.
- Reuses the existing `toPrice`-style parse helper for the decimal string; `averageRating` is the same decimal-string-over-the-wire situation as `price`.
- *Alternative considered*: keep `rating: number` always and have each call site check `reviewCount`. Rejected — three call sites, three chances to forget, and the type would not express that a rating can be genuinely absent.

**2. Reviews split across two transports by audience, not by convenience.**
Public review reads (list + breakdown) are cookie-free, so `src/services/review.ts` fetches them server-side via `apiFetch` for the initial product-detail render — the reviews tab is content, and server-rendering it keeps it in the document. Everything authenticated — submit, edit, withdraw, and the `/account/reviews` list — goes through `/api/reviews/*` route handlers, because those carry the session cookie.
- The Reviews tab therefore takes server-fetched first-page reviews as a prop and uses RTK Query only for pagination beyond page 1 and for the write path. This mirrors how the product page already server-renders the product and lets `productApi` handle client-side needs.

**3. Review eligibility is presented, not probed.**
There is no "can I review this?" endpoint. Rather than inventing one or firing a speculative POST, the UI derives what it can and lets the backend be the authority on the rest:
- Signed out → show a sign-in prompt (the session is already known client-side; `src/proxy.ts` reads `accessToken`).
- Signed in, and `GET /reviews/me` shows a review for this product → offer **edit**, not a second form.
- Otherwise → show the form, and translate a **403** on submit into the explanatory "a completed purchase is required" message the spec asks for, rather than a red error toast.
This keeps the happy path one request and treats the rule as a rule rather than a failure.

**4. `wishlistApi` follows `addressApi` exactly, with one tag covering both list and count.**
`baseQuery: fetchBaseQuery({ baseUrl: "/api/wishlist" })`, `tagTypes: ["Wishlist"]`. The list query, the count query, and the per-product `contains` query all `providesTags: ["Wishlist"]`; every mutation invalidates it. That single tag is what keeps the header badge, the heart on a card, and the wishlist page from disagreeing after any toggle — the correctness property the spec's "count updates without a page reload" scenarios are really about.
- *Alternative considered*: per-product `contains` cache entries with granular tags. Rejected as premature — a wishlist is small, one invalidation refetches three cheap queries, and granular tags are how stale hearts appear.

**5. The heart toggle asks the list, not one `contains` call per card.**
A listing renders many `ProductCard`s; one `GET /wishlist/contains/:productId` per card would be a request storm for a set that fits in a single response. Instead the toggle reads saved state from the cached wishlist (a set of product ids derived once via an RTK Query `selectFromResult`), so N cards cost one shared query. `GET /wishlist/contains/:productId` is reserved for the product **detail** page, where exactly one product is in question and the wishlist list may not otherwise be loaded.
- Signed-out shoppers must not trigger the wishlist query at all — it would 401 on every listing render. The query is `skip`ped when there is no session.

**6. `move-to-cart` must invalidate the cart as well as the wishlist.**
The endpoint mutates both. `wishlistApi` owns `Wishlist`; the cart lives in a different API slice with its own `Cart` tag. So the mutation dispatches an invalidation into `cartApi` on success, the same cross-API pattern `orderApi` already uses (`orderApi.ts:44-46` writes into `cartApi`'s cache after checkout). Without it the header cart badge silently lags the wishlist page.

**7. Related products lose a whole round trip.**
`src/app/products/[handle]/page.tsx` currently resolves a category slug to an id (which pulls the entire category tree) purely to filter a catalog query. `getRelatedProducts(slug, 6)` replaces the resolve, the primary query, the fallback query, the self-filter, and the slice. Because the endpoint returns the standard product shape, the new service function is a thin `apiFetch` + `map(toProduct)`. `ProductDetail`'s `related: Product[]` prop is unchanged, so no component work.
- The endpoint 404s for an unknown slug; the page has already resolved the product by then, so a 404 here means a race, and the section is omitted rather than failing the page.

**8. The product-detail tab union has to widen, and that is a type change, not a string change.**
`ProductDetail.tsx:34` types tab state as `useState<"description" | "shipping">` and `:253` iterates a literal `(["description", "shipping"] as const)`. Adding reviews means widening both, plus the panel switch. Called out because the tab strip looks data-driven at a glance but is two hardcoded literals.

## Risks / Trade-offs

- **Next.js 16 / React 19 APIs may differ from what a model recalls.** → `AGENTS.md` says so explicitly. Route handlers, `params` handling in dynamic segments (already `await`ed in this codebase — see `products/[handle]/page.tsx`), and caching directives get checked against `node_modules/next/dist/docs/` before use. This is the single largest source of avoidable error in this change.
- **The wishlist query 401s for signed-out shoppers.** → Every wishlist query is `skip`ped without a session, and the save control renders a sign-in prompt instead of a toggle. Getting this wrong produces a console full of 401s on the home page.
- **`averageRating` is a string.** → Handled once in `toProduct`. Flagged because `reviewCount` beside it is a number, so the two look symmetrical and are not.
- **Editing an approved review silently unpublishes it.** → The spec requires telling the customer beforehand; the edit form states it before submission rather than surprising them after.
- **Reviews are moderated, so a customer's own new review does not appear in the public list.** → After submitting, the confirmation says it awaits moderation. Without that the customer refreshes, sees nothing, and submits again (which then 409s as a duplicate).
- **Scope is large — four surfaces, two of them greenfield.** → tasks.md is ordered so each surface is independently shippable: ratings and related products (small, no new transport) land before reviews and wishlist (new API slices, new proxy routes). If the change has to be cut short, the first two still deliver value.

## Migration Plan

No data migration — this is a pure consumer of endpoints that are already live.

Ordering is by dependency and risk:
1. **Types and mapper** (`types/product.ts`, `services/product.ts`) — everything rating-related depends on this and nothing depends on it.
2. **Ratings display** + **related products** — no new transport, immediately verifiable in the browser.
3. **Wishlist** — new proxy routes + new API slice, following `addressApi`.
4. **Reviews** — the largest surface: public read, write path, and the account page.
5. Verification per tasks.md section 7.

**Rollback**: each surface is additive and independently revertible. Reverting related products restores the old category re-query; reverting ratings leaves `toProduct` unchanged and the display markup unused. No backend or schema coupling.

## Open Questions

- Whether `/account/reviews` should also surface the merchant's reply to a review. The backend stores one (`replyToReview` exists), but the customer-facing value is unclear and it does not change the specs, the transport, or the task breakdown — it is a display addition that can be decided when the page is built.
