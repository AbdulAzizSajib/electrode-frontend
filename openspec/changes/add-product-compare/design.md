## Context

See proposal.md — Why. The design-relevant constraints:

- **`makeStore()` is called per request** (`src/store/index.ts:11-18`), with a comment stating a module singleton "would leak carts across visitors". Any persisted state must respect that.
- **`localStorage` appears nowhere in `src`** — zero hits. The only client storage is `sessionStorage` in `src/lib/guest-checkout.ts`, read inside effects precisely because storage does not exist during SSR.
- Every store member (`cartApi`, `wishlistApi`, …) is RTK Query over **server** state. Compare is local state, so `uiSlice` is the structural precedent, not the API pattern.
- `ProductAttribute` rows (`{ name, value }`) are the comparison's raw material and are **only on the detail payload**; `PUBLIC_PRODUCT_LIST_SELECT` omits them.
- `WishlistButton.tsx` is the template for a control used both standalone on the detail page and inline on a card.

## Goals / Non-Goals

**Goals:**
- Works signed-out, with no account prompt.
- Survives reload and navigation without hydration mismatch.
- One source of truth for membership, so every compare control on screen agrees.

**Non-Goals:**
- Server persistence or cross-device sync (proposal — Not in scope).
- Storing product data. The list holds identifiers only.

## Decisions

### A plain slice holding product slugs, persisted to `localStorage`

The persisted value is **product identifiers and nothing else**. Storing snapshots would render stale prices after a price change, which the spec forbids ("prices are current"). Product data is fetched fresh for the comparison.

**The identifier is the slug, not the id.** This was corrected during implementation: the public product endpoint resolves by slug only (`GET /products/:slug` returns 404 for an id), and `productApi` is keyed accordingly, so a list of ids could not be fetched at all without new backend work — which this change explicitly excludes. Every call site already has `product.slug` in hand, and the comparison page needs the slug regardless to link each column back to its product.

The trade-off is that renaming a product changes its slug and orphans a stored entry. That is the same failure as a deleted product and takes the same path: the entry is dropped and pruned on load. An id would survive a rename but cannot be fetched, which is worse.

The slice sits alongside `uiSlice` in the per-request store. Since `makeStore()` runs per request and the server has no access to `localStorage`, the store is **always** created with an empty compare list and hydrated client-side after mount.

- **Alternative — RTK Query against `/api/compare`**: rejected. There is no backend endpoint, and the proposal excludes building one. Compare must work signed-out, which a server-owned list makes awkward.
- **Alternative — `preloadedState`**: impossible. `preloadedState` is computed server-side where `localStorage` does not exist.

### Hydrate after mount; render the empty state first

This is the one genuinely delicate part, and the spec has a scenario for it ("the page renders before the stored list is available… without flashing incorrect compare state").

Server-rendered HTML cannot know the compare list. If a compare control renders its "in list" state immediately on the client, the first client render disagrees with the server HTML — a hydration mismatch. So:

- Server and first client render both show the **not-in-list** state.
- A hydrate action dispatches after mount, reading `localStorage` in an effect (the pattern `guest-checkout.ts` already uses).
- Controls render a neutral state until hydration completes, so the transition is empty → known, never wrong → corrected. The compare indicator stays hidden until hydrated, which also satisfies "the indicator disappears when empty" for free.

Writes persist on change via a subscription or middleware, in one place rather than at each call site — a control that mutates without persisting would silently lose the list on reload.

### Membership lives only in the store

Every compare control reads membership from the slice. This is what makes the spec's "the same product added from two places" and "removing from the indicator updates the product page's control" hold without cross-component coordination.

### Fetch full detail per compared product on the comparison page

Attributes are absent from the list projection, so the comparison needs the detail payload for each product. `productApi` (RTK Query) already fetches product detail client-side for `ProductQuickView` — reused rather than duplicated.

A product id in the list may no longer resolve (deleted or deactivated). The page drops it and continues rather than failing the whole comparison, and the stored list is cleaned so the dead id is not re-fetched forever.

### Align rows by attribute name, with explicit absence

Rows are the **union** of attribute names across compared products, in a stable order. A product lacking an attribute renders an explicit "not specified" marker in that cell — never a blank that shifts alignment.

"Only show differences" filters the union: a row is a difference if the set of values across products has more than one distinct member, where *absent* counts as a distinct value. This is what makes the spec's "partially recorded specification counts as a difference" fall out of the same comparison rather than needing a special case.

### Capacity is enforced in the reducer

The reducer rejects an add beyond capacity and the UI reports it. Enforcing at the store rather than per control means no call site can bypass it, and "the list is unchanged, with no product silently dropped" is structural rather than a convention.

## Risks / Trade-offs

- **First client render shows not-in-list, then corrects** → mitigated by the neutral-until-hydrated state, so the shopper sees empty → known rather than a wrong state flashing.
- **`localStorage` unavailable** (private mode, disabled, quota) → all access wrapped; on failure compare works for the session and does not persist. Never throws into a render.
- **A malformed or foreign value under the storage key** → validated on read; anything unexpected is discarded and treated as an empty list.
- **First client-persisted store in the app** → the persistence layer is written as a small isolated module so a future persisted feature reuses it rather than inventing a second pattern.
- **N detail fetches on the comparison page** → N is capped by the list capacity, and `productApi` caching means products opened while browsing may already be cached.
- **A stale entry in storage for a deleted or renamed product** → dropped on load and pruned from storage. Renaming is reachable because the stored identifier is the slug; it fails the same way a deletion does and is handled by the same path.

## Migration Plan

Frontend-only. No backend, no admin, no migration, no data. Ships as one unit — the slice, persistence, controls, indicator and page are useless separately.

Rollback is a revert; orphaned `localStorage` entries are inert.

## Open Questions

- The exact capacity limit (3 or 4). It changes no requirement — the spec states the behaviour at capacity, not the number — and no task. Settle it against the narrowest supported viewport during implementation.
