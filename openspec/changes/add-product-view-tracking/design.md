## Context

See proposal.md — Why. The design-relevant constraints:

- The detail page (`src/app/products/[handle]/page.tsx`) is an **async server component** that calls `getProductBySlug` with `revalidate: 60`. Recording a view is a write; performing it during render would both violate the render-is-pure expectation and be wrong under caching — a cached render serves many shoppers without executing.
- The backend has **no redis, no rate-limit middleware, no cache layer**. The one existing rate limit (`enforceGuestOrderLimits`, `order.service.ts:292`) is DB-counted, and its comment states the reasoning explicitly: an in-memory counter "would be wrong the moment there are two instances and lost on every restart."
- `app.set("trust proxy", 1)` is already configured, so `req.ip` is the real client address.
- `Product` already carries denormalized counters maintained by services — `totalSold` via `applyTotalSoldDelta` in `payment.service.ts:46`, `averageRating`/`reviewCount` via `ReviewService.recalculateProductRating`. A view counter is the same shape of thing.
- `PUBLIC_PRODUCT_SCALARS` and `PUBLIC_PRODUCT_SORT_FIELDS` (`product.validation.ts:116`) gate what the public payload exposes and what it can be sorted by. The file's stated rule: a field belongs in the sort allowlist only if it is already in the public payload.
- The storefront cannot call the backend directly for anything needing cookies; `src/lib/api-proxy.ts` and route handlers under `src/app/api/` exist for that.

## Goals / Non-Goals

**Goals:**
- A view count that means "people who looked", surviving restarts and correct across multiple backend instances.
- Recording a view never delays or breaks the product page.
- Dedup that costs one storage row per viewer-product-window, not one per request.

**Non-Goals:**
- Exactness. A view counter is a merchandising signal; losing a view to a race or a failed request is acceptable, double-counting systematically is not.
- Real-time. The count may lag the current request.
- Any live-viewers window (see proposal — Not in scope).

## Decisions

### The proxy must forward the real client's identity

Discovered during implementation. The storefront's `/api/*` routes run on the
server, so a request reaching the backend through `proxyRequest` carries that
process's address and no browser user-agent. Every guest would have hashed to
one viewer key, and the dedup window would have counted **one view per product
per six hours across all visitors**.

`FORWARDED_HEADERS` in `api-proxy.ts` therefore gained `user-agent` and
`x-forwarded-for`. The mechanism already existed — the list is explicitly
documented as "anything the backend needs has to be copied across explicitly or
it is silently dropped," which is exactly what would have happened here.

### Record the view from the client, not the server render

The page is a cached server component; a view must be recorded per *shopper*, not per *render*. So the record call is a `useEffect` in a client component mounted on the detail page, firing once per mount against a storefront route handler that proxies to the backend.

- **Alternative — record inside `getProductBySlug`**: rejected. It is a write inside a cached read, so it under-counts on cache hits and fires for every non-shopper caller of that function (`generateMetadata` already calls it a second time per page load, which would double every view).
- **Alternative — Next.js middleware**: rejected. Runs on prefetches and asset requests, and cannot distinguish a shopper opening a page from a hover-prefetch.
- **Consequence**: shoppers with JavaScript disabled are not counted. Acceptable for a merchandising signal.

The call must be fire-and-forget: no await blocking paint, failures swallowed, and it must not be part of any RTK Query cache that could re-fire on refocus.

### Dedup with a `ProductView` row per viewer-product-window, in the database

Deduplication needs shared state. With no redis and multiple potential instances, that means Postgres — the same conclusion `enforceGuestOrderLimits` reached.

A `ProductView` table holds one row per (viewer, product, window). The record endpoint inserts; a unique constraint on the viewer key makes a duplicate insert fail harmlessly, and only a genuinely new row increments `Product.viewCount`. This makes dedup a database invariant rather than a read-then-write race between instances.

- **Viewer identity**: the authenticated customer id when signed in, otherwise a hash of IP + user-agent. Not raw IP — see Risks.
- **Window**: a truncated timestamp forms part of the unique key, so the row for a new window is a new row and no expiry job is needed to make a return visit count again.
- **Note**: the proposal says no `ProductView` *row table for live viewers*. This table is the dedup ledger, not a live-viewers window — it is never queried to answer "how many now". Rows are prunable on any schedule without affecting `viewCount`.
- **Alternative — cookie-based dedup**: rejected. Trivially cleared, and gives a wrong answer per-device rather than per-person for signed-in shoppers.
- **Alternative — no dedup, count requests**: rejected outright; it makes the number meaningless, which is the defect being fixed.

`Product.viewCount` stays as the denormalized total so the admin list and the public payload never need an aggregate query — consistent with how `totalSold` is handled.

### Exclude bots at the endpoint, not the client

Bots that execute JavaScript exist; the storefront's own `apiFetch` calls also must not count. The endpoint rejects on user-agent match against a crawler list, and the client sends a marker distinguishing "a shopper opened this page" from any other call. Both checks are server-side, since a client-side check is advisory only.

### Increment atomically

`{ increment: 1 }` in the same transaction as the dedup insert. A read-modify-write would lose views under concurrency, which is precisely when a product is worth counting.

### Presentation

The storefront formats the count and omits the line entirely at zero (per spec). Formatting large numbers compactly is a display concern in `src/lib/format.ts` alongside `formatPrice`.

The existing `viewers` state and its `eslint-disable` in `ProductDetail.tsx:141-146` are deleted, not adapted — the disable comment exists solely to suppress the warning caused by the randomization being removed.

## Risks / Trade-offs

- **Storing IP linked to browsing history is personal data** → hash IP + user-agent with a server-side secret; never store the raw address. The hash is only ever compared, never reversed. Prune rows on a retention window.
- **Shared IPs (office, mobile carrier NAT) collapse many people into one viewer** → under-counts. Accepted: under-counting a real signal beats inflating it, and including the user-agent in the hash separates most devices.
- **One extra request and one extra DB write per product page view** → the write is a single indexed insert that usually conflicts and stops. If it becomes a load problem, the endpoint can batch, since exactness is explicitly not a goal.
- **The `ProductView` table grows unboundedly** → it is a dedup ledger with no read path; prune it on a schedule. `viewCount` is unaffected by pruning.
- **Adding `viewCount` to `PUBLIC_PRODUCT_SCALARS` publishes it** → intended; the spec requires the storefront to display it.
- **A merchant refreshing their own product pages inflates counts** → partially mitigated by dedup. Full exclusion of staff traffic is not attempted.

## Migration Plan

1. Backend: migration adding `Product.viewCount Int @default(0)` (with an index, since it becomes sortable) and the `ProductView` table with its unique constraint. Existing products start at 0 — accurate, since no views were ever recorded.
2. Backend: record endpoint, dedup, bot exclusion; add `viewCount` to the public scalars, the sort allowlist, and the admin list projection.
3. Storefront: types, mapper, record-view client component, replace the fabricated line.
4. Admin: Views column and sort wiring.

Steps 3 and 4 are independent of each other and both depend on 1–2. Rollback is per-layer: the storefront line falls back to rendering nothing at zero, and the column can be removed without touching data. The migration is additive and needs no rollback.

### The admin column sorts on the server

Decided during implementation. The `DataTable` already supports client-side
sorting, but the product listing is paginated server-side — an in-table sort
would reorder only the ten rows already fetched, so "which products does nobody
find?" would silently mean "of these ten". That is the exact question the column
exists to answer, so `ListParams` gained `sortBy`/`sortOrder` (the backend's
`QueryBuilder` already accepted them) and the page holds the sorting state,
resetting to page 1 on change. This is the app's first sortable column; the
pattern is now available to the other listings.

## Open Questions

- The exact dedup window length and the row retention period. Both are tunable numbers that change no requirement, no interface, and no task. The `StoreSetting` singleton already holds comparable thresholds (`maxGuestOrdersPerIpPerHour`) and is the natural home if they should be merchant-tunable rather than constants.
