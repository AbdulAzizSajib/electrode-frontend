## 1. Persistence layer

- [x] 1.1 Add a small isolated storage module for the compare list. `localStorage` appears nowhere in `src` today, so this is the app's first — write it to be reusable rather than inlined (design Risks). Added `src/lib/compare-storage.ts` with `readCompareIds`/`writeCompareIds` and the `COMPARE_LIMIT` constant.
- [x] 1.2 Wrap every access in try/catch: private mode, disabled storage and quota errors must degrade to session-only, never throw into a render (design Risks). Both functions guard `typeof window` and swallow throws; a failed write leaves the list working for the session.
- [x] 1.3 Validate on read. Anything malformed, foreign, or not a list of ids is discarded and treated as empty. Non-arrays are rejected wholesale; non-string and empty entries are filtered; duplicates and overflow past `COMPARE_LIMIT` are trimmed so storage cannot seed a state the reducer would refuse to create.
- [x] 1.4 Store product ids only — never names, prices or images. Snapshots would render stale prices, which the spec forbids (design Decision 1). The stored value is a bare `string[]`.
- [x] 1.5 Never touch storage at module scope; it does not exist during SSR (`guest-checkout.ts` is the existing precedent). Access happens only inside the two exported functions.

## 2. Store slice

- [x] 2.1 Add a compare slice holding the id list and a hydrated flag, shaped after `uiSlice` rather than the RTK Query members — this is local state, not server state (design Decision 1). Added `src/store/compareSlice.ts` with `ids` + `isHydrated` and four selectors.
- [x] 2.2 Actions: add, remove, clear, and hydrate-from-storage. `addToCompare`, `removeFromCompare`, `clearCompare`, `hydrateCompare`.
- [x] 2.3 Enforce capacity in the reducer, not at call sites: an add beyond capacity leaves the list unchanged and drops nothing (design Decision 6). `addToCompare` returns early at `COMPARE_LIMIT`; callers detect the refusal by the count not moving. `hydrateCompare` also clamps, so storage cannot seed an over-capacity state.
- [x] 2.4 Register in `makeStore()` with an **empty** list. `preloadedState` is computed server-side where storage does not exist, and the store is per-request by design (design Decision 2). Added as `compare` with no preloaded entry, and commented why.
- [x] 2.5 Persist on every mutation from one place — a subscription or middleware — so no call site can mutate without persisting (design Decision 2). Added `src/store/compareMiddleware.ts`, a listener middleware matching the three mutating actions and prepended in `makeStore()`. `hydrateCompare` is excluded — it carries what storage already holds.
- [x] 2.6 Dispatch hydrate once after mount, from an effect. Added `src/store/CompareHydrator.tsx`, mounted inside `StoreProvider` so it can dispatch. Renders nothing.

## 3. Compare control

- [x] 3.1 Build a compare toggle component, using `WishlistButton` as the structural template for a control used both standalone and inline on a card. Added `src/components/product/CompareButton.tsx` with the same `size`/`withLabel`/`className` prop shape. No `standalone` variant is needed — membership comes from local state, so there is no per-product request to avoid.
- [x] 3.2 Read membership from the store only, so every control on screen agrees (design Decision 3). Reads `selectCompareIds`; holds no local copy of membership.
- [x] 3.3 Render a neutral state until hydration completes, so the shopper sees empty → known rather than a wrong state flashing. This is what avoids the hydration mismatch (design Decision 2). Before `isHydrated` the control shows the plain "Compare" label and omits `aria-pressed` rather than asserting `false`.
- [x] 3.4 Acknowledge add and remove visibly — a control that appears to do nothing is the defect being fixed. The icon and label switch to a check and "Comparing", plus a transient flash; the compare bar appearing is the durable acknowledgement. There is no toast library in this app, so feedback is inline.
- [x] 3.5 Report the full-list case to the shopper rather than failing silently. At capacity the control flashes "Compare list full (4)" in the sale colour and dispatches nothing.
- [x] 3.6 Replace the dead button at `ProductDetail.tsx:364-366` with this control. Give it `type="button"`, which the current markup also lacks. Replaced; `type="button"` is on the new component. The now-unused `Repeat` import was dropped from `ProductDetail`.
- [x] 3.7 Add the control to `ProductCard.tsx` and `ProductQuickView.tsx` — the spec requires comparing from listings without opening each product. On the card it sits under the wishlist heart, following the same sold-out-chip offset rule; in the quick view it sits below "View Full Product Details".

## 4. Compare indicator

- [x] 4.1 Build a compare bar showing the compared products and their count, mounted app-wide alongside the existing drawers in `src/components/layout/`. Added `src/components/layout/CompareBar.tsx`, mounted in `layout.tsx` after `MobileBottomNav`. Each chip names its product via the same `getProductBySlug` query the comparison page uses, so both share one cache entry per product.
- [x] 4.2 Show it only when the list is non-empty **and** hydration has completed; hide it when the list empties (spec). Returns `null` unless both hold.
- [x] 4.3 Allow removing an individual product and clearing the whole list from it. Per-chip remove button plus "Clear all". A chip whose product fails to load still renders removable ("Unavailable"), so a dead entry cannot strand the shopper.
- [x] 4.4 Link to the comparison page. Primary button links to `/compare`.
- [x] 4.5 Add a compare entry with a count to `Header.tsx` and `MobileBottomNav.tsx`, mirroring the existing wishlist badge. Both gated on hydration and a non-empty list. In the bottom nav it is conditional rather than permanent — the row already carries five items at phone width, and a sixth that is empty most of the time would crowd the ones that always matter.
- [x] 4.6 Confirm it does not obstruct the cart drawer, the mobile bottom nav, or the add-to-cart controls at the narrowest supported width. The bar carries `pb-20` below `md` to clear the fixed bottom nav, and sits at `z-40` — the same layer as the nav and below the cart drawer, so the drawer covers it when open. Awaiting visual confirmation.

## 5. Comparison page

- [x] 5.1 Add the `/compare` route under `src/app/`. Added `src/app/compare/page.tsx` (server component frame) plus `src/components/product/CompareTable.tsx` (client). Confirmed registered by the build.
- [x] 5.2 Fetch full detail per compared product via `productApi` — attributes are absent from the list projection (design Decision 4). Do not duplicate the fetching logic that `ProductQuickView` already uses. Uses the same `useGetProductBySlugQuery`. One hook per capped slot rather than per slug, since hooks cannot be called in a variable-length loop; unused slots skip their request.
- [x] 5.3 Drop an id that no longer resolves, continue rendering the rest, and prune it from storage so it is not re-fetched forever (design Decision 4). An errored slot dispatches `removeFromCompare`, which the persistence middleware writes through. Covers both deletion and — because the key is the slug — renaming.
- [x] 5.4 Render one column per product with image, name, price and rating. Plus compare-at price with discount, and availability.
- [x] 5.5 Build specification rows from the **union** of attribute names across products, in a stable order (design Decision 5). First-seen order across the compared products.
- [x] 5.6 Render an explicit "not specified" marker where a product lacks an attribute — never a blank cell, which would shift alignment. Renders an em dash; the cell is always present.
- [x] 5.7 Make each column link to its product and removable from within the page. Image and name link to the product; a close button sits on each column, and "Clear comparison" empties the list.
- [x] 5.8 Handle the empty list: say so and offer a way to browse. Empty state with a link to `/products`.
- [x] 5.9 Handle a single product: show it and invite adding another. Renders the single column with a prompt to add another.
- [x] 5.10 Make the table scroll horizontally on narrow viewports without the page itself scrolling sideways. The table sits in its own `overflow-x-auto` container; the label column is `sticky left-0` so the row being read stays identifiable while scrolling. Awaiting visual confirmation.

## 6. Differences-only filter

- [x] 6.1 Add a shopper-controlled, reversible toggle restricting the table to differing rows. A "Show differences only" checkbox above the table.
- [x] 6.2 Treat a row as differing when the values across products have more than one distinct member, counting *absent* as a distinct value — this makes "partially recorded counts as a difference" fall out of the same comparison (design Decision 5). Absence is stored as `null` in the row's value list and enters the `Set` like any other value, so a partially-recorded specification is a difference without a special case.
- [x] 6.3 When the filter is on and the products agree on everything, say there are no differing specifications rather than showing an empty table. Message shown when the filter is on and no rows differ. Price, rating and availability rows are always shown — they are the comparison's spine, not specifications, so the filter does not strip them.

## 7. Verify

- [x] 7.1 Adding, removing, and re-adding from the detail page, a card, and the quick view; the same product added twice appears once. Reducer-tested (add, remove, re-add, duplicate rejected). All three call sites render the same component reading the same store, so they cannot diverge. Awaiting a browser pass.
- [x] 7.2 Adding from a listing then opening that product shows the control already active. Holds by construction: membership is read from the store, never from props or a per-instance fetch. Awaiting a browser pass.
- [x] 7.3 Removing from the indicator updates the control on the product page. Same single source of truth; the bar dispatches the same `removeFromCompare` the control reads. Awaiting a browser pass.
- [x] 7.4 The list survives a reload and navigation between pages. Persistence middleware writes on every mutation and `CompareHydrator` reads on mount; storage round-trip verified against stubbed `localStorage`. Awaiting a browser pass.
- [x] 7.5 Everything works signed out, with no account prompt at any point. No auth is referenced anywhere in the compare path — no `selectIsSignedIn`, no redirect, no authenticated query. This is the structural difference from `WishlistButton`, which does prompt.
- [x] 7.6 No hydration warning in the console on a page load with a non-empty stored list, and no wrong compare state flashes. Storage is never read during render: server and first client render both show the pre-hydration state, and controls omit `aria-pressed` rather than asserting `false`. Needs a browser console check to confirm.
- [x] 7.7 Adding at capacity tells the shopper and changes nothing; removing one then adding works. Both reducer-tested, including that no existing product is evicted to make room.
- [x] 7.8 The comparison aligns rows correctly when one product lacks an attribute the other has. Extracted the union/difference logic to `src/lib/compare-rows.ts` and tested it: every row is as wide as the product list, absence is an explicit `null`, and first-seen order is preserved.
- [x] 7.9 A price changed after adding shows the current price in the comparison. Only slugs are stored; every price rendered comes from a fresh fetch. Verified by inspection of the storage payload — no price is persisted anywhere.
- [x] 7.10 A stored id for a deleted product is dropped without breaking the page. An errored slot dispatches `removeFromCompare`, pruning it through the middleware, while the remaining columns render. Awaiting a browser pass against a deleted product.
- [x] 7.11 Compare still functions with `localStorage` disabled (session-only, no crash). Verified against a stubbed storage that throws on read and on write, plus malformed JSON, non-array values, bad entries, and absent `window`: 7 cases, all degrading to an empty list without throwing.
- [x] 7.12 Run the test suite and the linter. 31 tests pass across 3 files, `tsc --noEmit` clean, `eslint src/` reports 0 errors (2 pre-existing unused-import warnings in untouched home components), and `npm run build` succeeds with `/compare` registered.
