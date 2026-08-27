## Context

See `proposal.md` — Why. This design covers how the five phases are built across two repositories.

Constraints that shape the approach, all established by the three preceding changes:

- **Two repos, one contract.** The storefront (this repo) and `electrode-server` (Express + Prisma) are separate. `postman/Ecom.postman_collection.json` is the de-facto contract document. The backend leads every phase.
- **Two established read paths.** Server Components read the backend directly through `apiFetch` in [api-client.ts](src/lib/api-client.ts). Browser code reads through RTK Query pointed at a local `/api/*` route handler, which forwards to the backend via [api-proxy.ts](src/lib/api-proxy.ts). The proxy exists for one reason: the backend sets httpOnly cookies on its own domain, which a cross-site browser fetch cannot carry. Its cookie allowlist is at [api-proxy.ts:29-35](src/lib/api-proxy.ts#L29-L35).
- **Money is decimal strings.** Shipping prices and order totals arrive as `"80"`, parsed to numbers at the service boundary. Gift card balances must follow the same rule.
- **Services swallow errors into empty results.** `getBrands`, `getCategoryTree`, and `getShippingMethods` return `[]` rather than throwing, so a failed fetch omits a section instead of breaking a page. The specs' "degrade safely" requirements formalise what those three already do.
- **`src/data/content.ts` is the target.** Its own header says "Swap for CMS-driven content once the backend is wired up." This change empties it.

## Goals / Non-Goals

**Goals:**

- One decision per surface about which read path it uses, and why, so implementation is mechanical.
- Backend-first sequencing within each phase, verified against a real endpoint before the storefront consumes it.
- Phases independently shippable and independently abandonable.
- Cache windows chosen deliberately, with the merchant-visible delay stated rather than discovered.

**Non-Goals:**

- Backend schema design at the column level. Models are named and their relationships stated; migrations belong to the backend repo.
- A generic CMS. Banners and posts are two fixed content types, not a page builder.
- Retrofitting existing catalog, cart, or checkout code beyond what the two modified specs require.

## Decisions

### 1. Read path per surface: public reads server-side, shopper-owned reads through the proxy

The rule: **if the response depends on who is asking, it goes through an `/api/*` proxy handler; otherwise it is read server-side with `apiFetch`.**

| Surface | Path | Why |
|---|---|---|
| Settings, banners, blog, brands, categories, testimonials | `apiFetch`, Server Component | Public, identical for everyone, cacheable, needed in the initial HTML |
| Product ratings | `apiFetch` (embedded in product payload) | Public, and must not cost a request per card |
| Wishlist, review submission, order history | RTK Query → `/api/*` proxy | Cookie-authenticated, mutated from the browser, needs optimistic UI |
| Guest order tracking, gift card balance | Server Action or route handler | Public but takes user input; must not put an order number or card code in a URL |

Alternative considered: route everything through the proxy for uniformity. Rejected — it forces public, cacheable content into a client fetch, losing SSR and the revalidation window, for no gain.

### 2. Wishlist mirrors the cart's guest-token model rather than inventing one

The cart already solves guest identity: the backend issues a `guestToken` cookie, the proxy relays it via the allowlist, and merging into the account happens on sign-in. The wishlist has the same shape — guest-writable, must survive sign-in, must not duplicate on merge.

Reusing it means no new cookie, no new allowlist entry, and merge-on-sign-in handled in the same backend code path as the cart. `localStorage` was the alternative: rejected, because it cannot satisfy the spec's "wishlist follows the account across devices", and it would need reconciliation logic that the guest-token path already has.

### 3. Ratings are embedded in the product payload, not a separate resource

`storefront/product-reviews` requires listings to show ratings without a request per product. So `GET /products` and `GET /products/:slug` gain `rating` and `reviewCount`, maintained as denormalised aggregates on the product row.

Recomputing on read was the alternative — correct by construction, but it puts an aggregate query per product into the hot listing path. Instead the backend recomputes the aggregate on every event that changes it: review approved, rejected, edited, or withdrawn. That set is small and entirely within the moderation code path, which is where the recompute belongs.

The consequence: the aggregate can drift if a write path forgets to recompute. Mitigated by a reconciliation task (see Risks) rather than by accepting per-read cost.

**BREAKING (internal):** `src/types/product.ts` gains two fields. Optional on arrival, so a backend that has not yet shipped Phase 4 simply omits them and no rating renders — which is exactly what the spec requires for an unreviewed product.

### 4. Sorting moves to the server, and `/deals` becomes a real query

[ProductListing.tsx:50-51](src/components/product/ProductListing.tsx#L50-L51) sorts the current page in the browser. On page 1 of 5, "price, low to high" sorts twelve items and presents the result as if it were the cheapest overall. `/deals` has the same defect in a different form: it fetches everything and filters on `compareAtPrice` client-side.

Both become server query parameters — `sort`, `minPrice`, `maxPrice`, `rating`, `inStock`, `onSale`. Sort state moves into the URL alongside the existing `category`, `brand`, `q`, `page`, which makes an ordered listing shareable and fixes the nav links under "Shop" that pass `?sort=new` and `?sort=best` to a page that never reads them.

`sort` is a closed enum (`featured | newest | best_selling | price_asc | price_desc | rating`), not a free-form field expression, so the backend cannot be induced to order by an arbitrary column.

### 5. Settings is one document, cached for five minutes

Everything in `GET /settings` is read on every page and changes rarely. Splitting it into per-concern endpoints would mean several requests per page for values that always travel together.

Cache window: **300 seconds**, matching the existing category and brand caching. A merchant edit is therefore visible within five minutes, not instantly. This is a deliberate trade recorded here because the spec requires the bound be documented — the announcement bar is the surface where a merchant is most likely to notice the delay and assume the edit failed. The merchant admin should say so at the point of editing.

Banners take the same 300s window. Blog posts take 60s, matching products, since publishing is a more deliberate act with a more immediate expectation.

### 6. Scheduled banners are filtered by the backend, never by the browser

A banner's eligibility depends on the current time against its window. Two ways to get this wrong: filter in the browser (ships unpublished promotions to anyone reading the payload), or filter at build time (a scheduled promotion never starts).

The backend filters on `isActive` and the window, and returns only eligible banners. Combined with the 300s cache, a promotion starts within five minutes of its scheduled time — acceptable for a marketing banner, and the reason `startsAt` should be set slightly early rather than exactly.

### 7. Draft posts 404, they do not 403

`storefront/blog` requires that an unpublished post not disclose its existence. A `403` on a draft slug confirms the slug is real. So an unpublished post returns the same not-found result as a slug that was never used.

The same reasoning drives guest order tracking and gift card balance lookup: a wrong email against a real order number, and a code that does not exist, produce indistinguishable failures. Otherwise the forms become oracles for enumerating order numbers and card codes.

### 8. Gift card balance is deducted transactionally at order placement

The dangerous case is double-spend: the same card applied to two carts, or one order submitted twice.

Deduction happens inside the same transaction that places the order, conditional on the balance still covering the amount — a compare-and-deduct, not a read-then-write. `POST /orders` already carries an `Idempotency-Key` header ([orderApi.ts:33-39](src/store/orderApi.ts#L33-L39)), which covers the resubmission case. Applying a card to a cart reserves nothing; it only records intent, so an abandoned cart never strands a balance.

Card codes are never placed in a URL — balance lookup is a POST, per the spec's requirement that a code not appear in a shareable address.

### 9. Contact and newsletter get a honeypot plus rate limiting

Two measures, as the spec requires: a hidden field that a human never fills and a bot usually does, plus per-origin rate limiting. Neither response reveals which measure rejected a submission, and the newsletter returns an identical acknowledgement whether or not the address was already subscribed, so it cannot be used to test membership.

A CAPTCHA was considered and rejected for now: it adds a third-party dependency and a consent surface for what is, at this scale, a low-value target.

### 10. Category product counts come from the existing tree, not a second endpoint

`GET /categories` gains a `productCount` per node. Adding a separate counts endpoint would mean the grid makes two requests to render one tile.

The count reflects active, publicly visible products only — a category whose only products are deactivated counts zero, not the raw row count, since the count sits next to a link that would lead to an empty listing.

## Risks / Trade-offs

- **Denormalised rating aggregates drift from the underlying reviews** → Recompute on every moderation event, and add a periodic reconciliation task in the backend that recomputes all aggregates and logs discrepancies. Drift then self-heals and is observable rather than silent.
- **A merchant edits a setting and does not see it for five minutes, concludes it failed, edits again** → State the propagation window in the admin UI at the point of editing. This is a documentation fix, not a caching fix; shortening the window to make the confusion less likely would cost a backend request on every page view.
- **Phase 4's sorting change alters `/products` behaviour for anyone with a bookmarked URL** → The new parameters are additive and optional; an existing URL without `sort` behaves exactly as before. Only the previously-inert `?sort=new` links change, and they change from doing nothing to doing what they say.
- **Guest wishlist merge conflicts with cart merge on sign-in** → Both run in the same backend sign-in path against the same guest token. Sequence them explicitly and make each idempotent; a merge that runs twice must not duplicate. The cart already has this property and the wishlist spec requires it.
- **Blog bodies are merchant-authored HTML rendered into the storefront** → Sanitise on write in the backend, not on read in the storefront, so exactly one code path decides what is permitted. A stored-XSS in a blog post would execute on a page that also renders the cart.
- **Eight new capabilities is a large surface to leave half-finished** → Phases are independently shippable by construction. If the roadmap stalls after Phase 2, Phases 3–5 have written no storefront code and left no dead abstractions; `content.ts` shrinks incrementally rather than being deleted up front.
- **Gift cards are the largest phase and the least certain** → Deliberately last. If it is dropped, nothing earlier depends on it, and the `/gift-cards` stub stays as it is today.

## Migration Plan

Each phase follows the same sequence, and **the backend step completes before the storefront step begins**:

1. **Backend** — model and migration, public read endpoint, merchant CRUD where applicable, then the Postman collection updated to match.
2. **Verify** — exercise the endpoint against real data through Postman. This is the gate; the storefront is not touched until an endpoint answers correctly.
3. **Storefront** — service function, then component wiring, then delete the corresponding entry from `content.ts`.
4. **Confirm** — the removed hardcoded data is gone and the page renders from the API, including its empty and failure states.

Deleting from `content.ts` last, per surface, means the tree is always in a working state. If a phase is abandoned mid-way, the remaining hardcoded data still renders.

**Rollback:** per surface, restore the `content.ts` entry and revert the component. No data migration is involved on the storefront side, and no existing storefront behaviour is replaced until its replacement is proven, so rollback is a revert rather than a recovery. Backend rollback is per-migration and additive — every new model is a new table; the only column additions to existing tables are `rating`/`reviewCount` on products and `productCount` derivation for categories, both of which the storefront treats as optional.

**Ordering within the roadmap:** Phase 1 first, since it is mostly deletion and needs no new patterns. Phases 2, 3, and 5 are mutually independent. Phase 4 extends `storefront/product-catalog` and `storefront/category-navigation`, which earlier phases read but do not modify, so it composes with them in any order.

## Open Questions

- **Blog body format** — HTML or Markdown. Affects the sanitiser and the renderer, not the spec, the endpoint shape, or the task breakdown. Decide when Phase 2 is picked up.
- **Testimonial storage** — a curated flag on an approved review, or a separate merchant-authored model. Both satisfy the spec; the choice depends on whether the merchant wants to promote real reviews or write their own. Ask before starting Phase 4.
- **Gift card expiry** — whether cards expire at all, and after how long. The spec covers the expired case without requiring that expiry exist. Merchant policy question, needed only at Phase 5.
