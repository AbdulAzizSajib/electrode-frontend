## Context

See proposal.md — Why. This section records only the constraints that shape the approach.

The relevant state of the codebase:

- **No dialog primitive exists.** No Radix, HeadlessUI, shadcn/ui, or `cn()` helper. The two overlays in the repo — `CartDrawer.tsx` and the mobile nav in `Header.tsx` — are hand-rolled `fixed inset-0` divs with a backdrop and an `if (!isOpen) return null`. Neither has `role="dialog"`, a focus trap, an Escape handler, or a scroll lock. There is no pattern to copy that satisfies the accessibility requirements in the spec.
- **No animation library.** Tailwind v4 (CSS-first, no `tailwind.config.js`; theme lives in `@theme inline` in `globals.css`) plus CSS transitions is the whole toolkit. `clsx` is available for conditional classes.
- **Listing responses carry no variants.** `services/product.ts:95` maps `(product.variants ?? [])`, and the `GET /products` list endpoint omits the field entirely — so `product.variants` is `[]` in every card context. A variant picker cannot be rendered from card props.
- **`apiFetch` is server-only in practice.** It sets `next: { revalidate }` / `cache` options and is called from server components. `getProductBySlug` is a server function. The client has no product-fetching path.
- **RTK Query is already the client data layer**, but only for cart, orders, and addresses — all routed through same-origin `/api/*` proxies because those endpoints need httpOnly cookies. `GET /products/:slug` is public and needs no cookies.
- **`ProductCard` has five consumers**, one of which is `ProductDetail` ("You May Also Like"), so the quick view can be opened from a product detail page.
- **`useAddItemMutation` already accepts `variantId`**, so adding a chosen variant needs no API work.

## Goals / Non-Goals

**Goals:**

- One reusable modal primitive that meets the spec's dialog requirements, usable beyond the quick view.
- Reveal behaviour that is CSS-only, reserves its space, and degrades to always-visible without hover — without JS device sniffing.
- Client-side product fetching that is cached across opens and immune to out-of-order responses.

**Non-Goals:**

- Retrofitting `CartDrawer` or the mobile nav onto the new modal primitive. Worth doing, but it changes cart behaviour and belongs in its own change.
- Grouping variants into per-attribute rows (Colour / Size). The detail page presents variants as one flat chip list; the quick view matches it. Changing both is a separate design question.
- Prefetching product details on hover.

## Decisions

### 1. Hover reveal via CSS `@media (hover: hover)`, not JS detection

The action slot is always rendered and always occupies its space. Concealment is layered on only where hovering exists:

```
@media (hover: hover) and (pointer: fine) {
  /* hidden at rest; revealed on group-hover / focus-within */
}
```

Everywhere else the actions are simply visible, which is the correct default and also what renders if CSS fails to load.

*Why:* the spec requires actions to be reachable without hover, and getting this wrong makes the entire storefront unbuyable on mobile. A CSS media query is evaluated by the browser per-device with no hydration gap. Alternatives rejected: a `useMediaQuery` hook (SSR renders the wrong branch, then flips on hydration — a visible flash on every card, and the wrong state entirely if JS fails); a `matchMedia` check in an effect (same flash); reveal-on-first-tap (spec explicitly forbids consuming the first tap).

`(pointer: fine)` is included to exclude hybrid touch-laptops, where `hover: hover` alone can be true while the user is actually touching.

Implementation is Tailwind's `group-hover:` / `group-focus-within:` on the existing `group` root, wrapped in a `@custom-variant` (Tailwind v4's CSS-first equivalent of a config variant) declared in `globals.css` so the media query is expressed once rather than repeated per utility.

*Reserving the space:* the slot animates `opacity` and `transform` (translate-y), never `height` or `display`. Layout is therefore identical in both states, satisfying the no-reflow requirement for free. `visibility: hidden` is paired with `opacity: 0` so hidden actions leave the tab order; `group-focus-within` restores both together, which is what makes keyboard reveal work.

*Reduced motion:* `motion-reduce:transition-none`, per the spec scenario.

### 2. Both action branches wrapped in a shared slot

Rather than adding reveal classes to the `Options` link and the `Add to cart` button separately, both branches of the existing `product.isVariable` ternary go inside one wrapper div that carries the reveal classes and the reserved margin.

*Why:* the spec requires the behaviour be uniform across cards — one product's action must not be revealed while another's is permanent. One wrapper makes that structurally true rather than a thing two class lists have to agree on.

### 3. A dedicated `Modal` primitive in `src/components/ui/`

A presentational component owning: portal to `document.body`, backdrop, `role="dialog"` + `aria-modal="true"` + `aria-labelledby`, Escape handling, focus trap, focus restore, and body scroll lock. It takes `isOpen`, `onClose`, a labelling id, and children.

*Why a portal:* the card is inside a CSS grid with `overflow-hidden` ancestors in some listings; a `fixed` overlay rendered in place can be clipped or trapped in a stacking context. `createPortal` to `body` makes correctness independent of where the card sits — which matters because there are five call sites, including inside the detail page.

*Why hand-rolled rather than adding Radix:* the project has deliberately hand-written every UI primitive; `@radix-ui/react-dialog` would be the first component dependency, for one dialog. The accessibility surface here is small and well-understood. Reconsider if a second and third dialog appear.

*Focus trap:* query focusable descendants on Tab and wrap at the ends. `inert` on the rest of the document would be cleaner, but React 19's `inert` support plus sibling-marking is more moving parts than a keydown handler for one dialog.

*Scroll lock:* set `overflow: hidden` on `document.body` while open and restore the prior value on close — restore the captured value, not a hardcoded `""`, so nesting or a future second modal cannot clobber it.

### 4. Fetch the product client-side with an RTK Query endpoint, direct to the backend

A new `productApi` RTK Query service with a `getProductBySlug` endpoint, `baseUrl: API_BASE_URL`, called from the quick view with `skip: !isOpen`.

*Why RTK Query:* it solves caching-across-opens, the loading flag, the error flag, and — critically — the out-of-order-response requirement, because a cache entry is keyed by slug and the hook only ever surfaces the entry for the slug currently asked for. A hand-rolled `useEffect` + `fetch` would need its own abort/staleness guard to satisfy the "dismissed before details arrive" scenario. The store, provider, and RTK Query setup already exist.

*Why direct to the backend, not a `/api/products/[slug]` proxy:* the cart proxies exist solely because cart cookies are httpOnly on the API's domain. `GET /products/:slug` is public and cookie-free, so a proxy would add a hop and a file for nothing.

*Response mapping:* `transformResponse` reuses the existing `toProduct` mapper from `services/product.ts`, so client-fetched products are mapped identically to server-fetched ones — same price parsing, same image fallback, same campaign-price logic. This requires `toProduct` to be importable from a client bundle; it is a pure function over plain data with no server-only imports (`placeholderImage` is likewise pure), so it can be imported directly. If a server-only import is later added to that module, the mapper moves to its own file rather than being duplicated.

*Cache lifetime:* `keepUnusedDataFor` set well above the default so reopening the same product within a browsing session does not refetch, per the spec.

### 5. Quick view state is local to the card, not Redux

`useState` in `ProductCard` for whether its quick view is open. The cart drawer uses Redux (`uiSlice`) because the header, the cards, and the drawer all touch it from unrelated places in the tree.

*Why:* nothing outside a card needs to know its quick view is open. Redux would make one card's state globally addressable for no benefit, and a single global "which quick view is open" slice would be actively wrong with five independent card call sites.

*Consequence:* the modal mounts per card, but only its open branch renders anything — the `Modal` returns `null` when closed and the RTK Query hook is skipped, so a 40-card grid pays for 40 `useState` calls and nothing else.

### 6. Add-to-cart mirrors the detail page, then closes and opens the drawer

`addItem({ productId, variantId, quantity }).unwrap()` → on success `onClose()` then `dispatch(openCart())`; on failure keep the modal open and show an inline message.

*Why close before opening the drawer:* both are `fixed inset-0 z-50`. Leaving the modal mounted under the drawer would stack two backdrops and two focus traps. Closing first also gives the spec's focus-restore a clean handoff.

*Gating:* reuse the detail page's `canAdd` shape — `availableStock > 0 && (!isVariable || selectedVariantId !== null)` — plus `!isLoading` so repeated activation cannot double-submit, and plus "details have loaded", since the spec forbids adding before the real choices are known.

*Quantity cap:* the quick view clamps quantity to the selected variant's `stockQuantity`, which the spec requires. Note the detail page currently does **not** clamp (`ProductDetail.tsx:183` increments unbounded). Fixing the detail page is out of scope for this change; the quick view is not built to match that gap.

### 7. Variant selection: flat chip list, preselect first in-stock

Copy the detail page's presentation (`ProductDetail.tsx:142-165`): one chip per variant, disabled + struck-through when out of stock, per-chip price shown only when variant prices differ. Preselect the first in-stock variant, resetting quantity to 1 on change.

*Why preselect:* consistency with the detail page, and it means a shopper indifferent to the choice is never blocked. The spec's "nothing added before a choice is made" is still honoured — for a variable product with no in-stock variant, the preselect yields `null` and the add stays disabled.

## Risks / Trade-offs

- **Hover-reveal makes the storefront unbuyable on a device the media query misjudges.** → The concealment is opt-in per-device: the default state is visible, and only `(hover: hover) and (pointer: fine)` opts a device into hiding. A misjudgement fails toward always-visible. Must be verified on a real touch device, not just a resized desktop window — DevTools device emulation does not reliably change the resolved `hover` media feature.
- **Actions hidden with `opacity: 0` alone stay in the tab order**, letting a keyboard shopper focus an invisible control. → Pair with `visibility: hidden`; `group-focus-within` lifts both. Verify by tabbing through a grid.
- **Two `z-50` overlays could collide** if the cart drawer opens before the modal unmounts. → Close the modal first (Decision 6). The modal sits at `z-50` alongside the drawer rather than above it, since they are never intentionally co-visible.
- **`toProduct` imported into a client bundle** pulls the mapping code into the browser. → It is small and pure; the alternative is duplicating price/image logic, which would drift. The real risk is a future server-only import in `services/product.ts` breaking the client build — noted in Decision 4 with the remedy.
- **A quick view opened from `ProductDetail`'s related-products carousel** puts a product dialog over a product page. → Permitted and coherent, but must be checked visually; it is the one call site where the layered content resembles what is behind it.
- **Five call sites inherit the behaviour at once**, including the homepage. → That is the intent, but it means a regression is storefront-wide rather than contained. The reveal is CSS-only, which keeps the blast radius to styling.
- **One extra API request per open.** → Cached per slug for the session, so repeat opens are free. Nothing is prefetched on hover, so browsing a grid without opening anything costs zero additional requests.

## Migration Plan

No data migration and no API change. Deployment is a normal frontend release.

Rollback is a revert: the change is additive except for `ProductCard`'s action slot, and reverting restores the `Options` link's navigation. No persisted state or cart data is written in a new shape, so a rollback after shoppers have used the quick view leaves nothing inconsistent — carts receive exactly the same `{ productId, variantId, quantity }` payload they do today.
