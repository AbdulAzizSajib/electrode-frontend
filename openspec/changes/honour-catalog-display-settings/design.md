## Context

See proposal.md — Why.

Three facts about this codebase decide the whole approach:

- **The settings are already fetched.** `app/layout.tsx` awaits `getStoreSettings()` on every render, tagged and cached. The flags arrive with it; nothing new is fetched.
- **The consumers straddle the server/client boundary.** `ProductCard`, `ProductDetail`, `ProductListing`, `Header`, `MobileBottomNav`, and `CompareBar` are all `"use client"`. The `/wishlist` and `/compare` route files are server components. A React hook cannot serve the server half; an `await`ed read cannot serve the client half.
- **That exact problem has already been solved here.** `lib/format.ts` holds the currency format at module scope, set by the root layout for the server pass and by `CurrencyFormatProvider` during module evaluation for the client pass. Its doc-comment lays out the reasoning in full: `formatPrice` is called from both halves, `StoreSetting` is a singleton so concurrent server requests all want the same value, and threading it explicitly would mean prop-drilling a deployment-constant through every tree that renders a price.

The catalog flags have identical shape — singleton, deployment-constant, read from both halves, needed by Redux-connected components with no props path from the layout.

## Goals / Non-Goals

**Goals:**

- One source of truth for the flags, read the same way from a server component and a client component.
- A feature that is off leaves no trace: no control, no count, no link, no route, no mounted panel.
- Defaults and read failures both land on "everything offered", so this can ship before the backend does.

**Non-Goals:**

- Gating the wishlist or compare **APIs**, or clearing saved data. The spec requires the opposite: withdrawing a feature must not delete what shoppers saved.
- Per-listing or per-category overrides. These are shop-wide.
- Making the compare list's `localStorage` contents disappear when compare is off. It is inert while the feature is withdrawn and correct again when restored.

## Decisions

**Mirror `lib/format.ts` + `CurrencyFormatProvider` exactly, rather than inventing a context.**
A new `lib/catalog-features.ts` holds the flags at module scope behind `setCatalogFeatures` / `getCatalogFeatures`, with a fallback of all-enabled. `app/layout.tsx` calls the setter for the server pass and mounts a `CatalogFeaturesProvider` — which calls it during module evaluation, not in an effect — beside the `CurrencyFormatProvider` it already mounts. A React context was considered and rejected on the same grounds `format.ts` documents: the route files that must call `notFound()` are server components and cannot consume a context, so a context would solve only half the problem and the other half would need a second mechanism anyway.

The safety argument is inherited wholesale from `format.ts`, including its caveat: it rests on there being exactly one store. If this ever becomes multi-tenant, both are wrong together and should be fixed together.

**The card's action resolves to one of four renderings, sharing one `className` constant.**
`unify-card-add-to-cart-action` collapsed the card's action to a single `<button>` on the grounds that a shared class string permits the branches to drift. Adding a navigating destination revises that, because a navigation should be an `<a>` — middle-click, open-in-new-tab, and copy-link-address are all things a shopper legitimately does with a product, and a `router.push` in an `onClick` takes them away. So the resolution becomes:

| product state | element |
|---|---|
| out of stock | disabled `<button>`, no handler |
| in stock, no variants | `<button onClick={handleAdd}>` |
| in stock, variants, preview offered | `<button onClick={openQuickView} aria-haspopup="dialog">` |
| in stock, variants, no preview | `<Link href={/products/[slug]}>` |

The visual sameness the earlier change bought structurally is preserved by hoisting the class string to a module constant all four share. That is weaker than one element, and it is the price of using the right element for a navigation. Out-of-stock is resolved *first*, so the disabled rule from `unify-card-add-to-cart-action` still holds regardless of the preview setting — a `Link` cannot be disabled, and this is why that branch is never reached when the product cannot be bought.

**`ProductQuickView` is not rendered at all when the preview is off**, rather than rendered and never opened. It fetches on open and holds a Modal with a focus trap; leaving it mounted would be dead weight and one `setQuickViewOpen(true)` away from contradicting the setting.

**Route pages call `notFound()`; the nav filter is a separate guard.**
The two route files already `await` nothing expensive, so reading the flags and calling `notFound()` is the whole change there. Filtering `mainNav` in `Header` is a distinct concern — it protects against the merchant's own configuration rather than against a direct hit — and both are required by the spec because either alone leaves a hole.

**Controls are removed, not disabled.**
An inoperable heart is worse than no heart: it invites a click, explains nothing, and reads as broken. The spec states this so it cannot be quietly reinterpreted as a `disabled` attribute.

## Risks / Trade-offs

- **Module-scope state on the server is shared across concurrent requests** → inherited from `format.ts` along with its argument: one store, one correct value, and the only reachable anomaly is a render during the instant a merchant's save propagates. Accepted on the same terms, and noted in the new module's doc-comment so the two are found together.
- **Hoisting the card's class string to a constant is weaker than the single element it replaces** → mitigated by all four renderings consuming the same constant and by the table above living in this document; the alternative is a navigation that a shopper cannot open in a new tab.
- **`/wishlist` is gated in `src/proxy.ts`, which redirects an unauthenticated visitor to sign-in before the page runs** → so a signed-out visitor to a disabled `/wishlist` signs in first and *then* gets the 404. Mildly silly but not wrong, and the alternative is duplicating the flag read into the proxy. Left as-is; noted so it is not mistaken for a bug.
- **Shipping before the backend means the field is absent** → absent reads as all-enabled, which is today's behaviour, so the order of deployment does not matter for this change.

## Open Questions

None.
