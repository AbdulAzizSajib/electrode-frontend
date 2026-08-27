## Context

See `proposal.md` — Why, for motivation. The constraints that shape the approach:

- **The header is a client component.** `Header.tsx` is `"use client"` (it owns dropdown state, the search box, and the mobile drawer), so it cannot fetch server-side itself. The established pattern in this codebase is already set by the auth work: `layout.tsx` is an async Server Component that fetches and passes data down as a prop (`<Header user={user} />`). Categories follow the same path.
- **The header renders on every route.** `layout.tsx` wraps every page, so anything it awaits is on the critical path for all navigation.
- **The products listing is still static.** `ProductListing.tsx` filters the hardcoded `@/data/products` array client-side, comparing `p.category` against the raw `?category=` string. It does not call `GET /products` at all. So "resolve the slug to a category id and filter server-side" cannot be completed end-to-end in this change — the listing has no API integration to resolve *into*.
- **The API returns two levels.** `GET /categories` nests one level of children; grandchildren are not returned. The live tree is 4 parents / 10 children.
- **`apiFetch` defaults to `cache: "no-store"`** (see `src/lib/api-client.ts`), which is wrong for data this static and this hot.

## Goals / Non-Goals

**Goals:**

- Establish the server-fetch → prop → client-render path for categories, mirroring the existing `user` prop pattern so the header keeps a single, consistent data-flow story.
- Make a categories outage strictly non-blocking for page render.
- Introduce the slug-based link contract now, so category URLs are stable before the products page is wired to the API.

**Non-Goals:**

- Wiring `ProductListing` to `GET /products`. That is a substantial separate change (pagination, filters, loading states, product-shape migration). This change makes category links *correct and stable*; it does not migrate the listing off static data.
- Making `CategoryGrid` or `categoryTabs` dynamic — see proposal, out of scope.
- Supporting more than two levels of category nesting. The API returns two; the UI renders two.

## Decisions

### D1: Fetch in `layout.tsx`, pass as a prop

Fetch the tree in the root layout and pass it to `<Header categories={...} />`, alongside the existing `user` prop.

*Why over the alternatives:* A client-side `useEffect` fetch in the header would make the menu pop in after hydration and put a request on every page load from every visitor. A separate `/api/categories` route handler would just add a hop — the server can call the backend directly. Fetching in the layout matches what `getCurrentUser()` already does, so there is one pattern to learn, not two.

*Trade-off:* it couples the layout to one more await. D2 and D3 address the cost.

### D2: Cache the tree with a revalidation window

Fetch with `next: { revalidate: 300 }` rather than `apiFetch`'s default `no-store`. This requires threading a cache option through `apiFetch`, which currently hardcodes `cache` per call.

*Why:* categories change on the order of days; refetching per request on every page is pure waste. Five minutes bounds staleness after a merchant edit while collapsing essentially all traffic to one upstream call.

*Alternative rejected:* long cache plus explicit revalidation on merchant edit — the storefront has no hook into admin-panel writes, so there is nothing to trigger it.

### D3: Failure returns an empty tree, never throws

The category service catches everything and returns `[]`. The header renders no menu for an empty array.

*Why:* an uncaught throw in the root layout takes down every page. The spec requires the menu to degrade while the rest of the page renders, so the failure must be absorbed at the service boundary. This mirrors `getCurrentUser()`, which already returns `null` rather than throwing.

*Consequence:* "empty catalog" and "backend down" are indistinguishable to the header. That is acceptable — the shopper-visible behavior is identical in both cases, and the spec specifies the same outcome for both.

### D4: Map the API shape to a small view model

Transform the API response into a minimal `{ id, name, slug, children }` shape at the service boundary rather than passing raw category objects through.

*Why:* the API returns 14 fields per category (`seoTitle`, `banner`, `createdAt`, …); the menu uses four. Passing the raw objects would serialize all of them into the RSC payload for every page load, on every page. Mapping also gives one place to sort by `sortOrder` and to drop `status: false` entries defensively, so the component stays presentational.

*Note:* `GET /categories` already filters to active categories, so the status filter is belt-and-braces against the endpoint changing.

### D5: Links carry the slug; slug→id resolution is deferred

Category links become `/products?category=<slug>`.

*Why the slug:* readable, shareable, stable across renames of the display name, and SEO-friendly — confirmed with the user.

*Why resolution is deferred:* the listing is still static (see Context). Resolving a slug to a category id is only meaningful once the listing queries `GET /products?category=<id>`. Doing it now would mean building a resolver with no consumer.

*What this change does instead:* `ProductListing` matches the `?category=` slug against a slugified form of the static products' category names, so existing static filtering keeps working and no link 404s. When the listing is migrated to the API, the resolver replaces that matching, and the URLs — already slugs — do not change. This is the reason for choosing slugs now rather than after the migration.

*Alternative rejected:* keep display-name links until the listing is migrated. That would mean changing every category URL twice and breaking any link shared in the interim.

## Risks / Trade-offs

- **A slow or hanging backend delays every page render** → D2's cache means at most one request per 5-minute window pays the latency. The fetch must also carry a timeout so a hung connection cannot pin the layout open; without one, `revalidate` does not help the request that is actually stuck.
- **The layout becomes dynamic / uncacheable** → It already is: `getCurrentUser()` reads cookies, so every route is server-rendered on demand today (confirmed by the build output — all routes are `ƒ Dynamic`). Adding a cached fetch does not regress this.
- **Slug collisions across the tree** → Two categories under different parents could share a slug, making `?category=<slug>` ambiguous. The live data has no collisions and the backend generates slugs with a uniqueness suffix (note `power-emergency-gadgets-2` in the sample). Accepted; if it ever occurs, the resolver added during the listing migration is where disambiguation belongs.
- **Interim slug matching is approximate** → Until the listing is migrated, matching a real catalog slug against slugified static product categories will not line up for every category, so some menu entries may show an empty listing. This is strictly better than today, where the menu's categories do not exist at all; and it disappears with the listing migration.
- **Two-level assumption** → If the backend later nests deeper, the UI silently truncates. Low likelihood, and the public endpoint's documented contract is one level of children.

## Migration Plan

No data migration, no schema change, no new dependency. Deploy is a single frontend release.

1. Add category types and the service (no behavior change until wired).
2. Thread the cache option through `apiFetch` — additive, existing callers keep their current behavior.
3. Wire `layout.tsx` → `Header`, delete the static `categoriesMenu`.
4. Update `ProductListing` slug matching.

**Rollback:** revert the release. Nothing persists, so there is no cleanup. If the API misbehaves post-deploy without a rollback, D3 already degrades the menu to hidden rather than erroring.

## Open Questions

- Should a parent category also be clickable to a listing of everything beneath it, or only expandable? Current behavior (expand only) is preserved; this is a merchandising preference that can change later without touching the specs or this design.
