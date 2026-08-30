## Why

The product card currently spends a permanent row of vertical space on an action button that is only relevant once a shopper has shown interest in that specific product. On a dense grid this makes every card shout at once, and it fixes the card's visual weight around a control most shoppers scroll straight past.

Worse, the two actions behave inconsistently. A simple product adds to the cart in place, but a variable product's "Options" button is a link that throws the shopper out of the grid onto the detail page just to pick a colour or size — losing their scroll position, their filters, and their place in the listing. Coming back means navigating back and finding where they were. The choice a shopper needs to make is small; the interruption it costs them is not.

This change reveals the action on hover so the grid stays calm until a shopper engages, and replaces the navigation-to-choose with a quick-view modal that presents the full product — gallery, price, description, variants — over the listing, so the shopper can decide and add to the cart without ever leaving the page they were browsing.

## What Changes

- **Card actions are hidden until the card is hovered or keyboard-focused.** Both branches of the existing action slot — "Options" (variable products) and "Add to cart" (simple products) — are affected, so cards keep a uniform height and the reveal reads as one consistent behaviour rather than a per-product quirk. The transition animates rather than snapping.
- **The reserved space is permanent.** The action slot keeps its footprint whether revealed or not, so revealing a button never reflows the grid or shifts the card beneath the shopper's cursor.
- **Touch and keyboard shoppers are not locked out.** Devices with no hover capability show the action permanently — a hover-only reveal would make the primary action unreachable on a phone. Keyboard focus reveals it the same way hover does.
- **"Options" stops navigating and opens a quick-view modal instead.** The modal shows the product as the detail page does: image gallery with thumbnails, brand, name, rating, price with any comparison price and discount, short description, variant/attribute pickers, and a quantity control.
- **The modal can add to the cart directly.** After a successful add the modal closes and the cart drawer opens — the same confirmation the shopper already gets when adding from a card or the detail page.
- **The modal offers "View Full Product Details"**, which navigates to that product's detail page for shoppers who want reviews, specifications, and the full description.
- **The modal fetches the product's variants on open.** Listing responses carry no variants (`GET /products` omits them), so the modal cannot render a variant picker from the data the card already holds; it loads the full product by slug when opened.
- **A new reusable modal primitive is introduced.** The project has no dialog library and no shared modal component — only two hand-rolled overlays. This adds one accessible modal (focus trap, Escape to close, scroll lock, `role="dialog"`) that the quick view uses.

Explicitly out of scope: the wishlist and compare buttons on the detail page remain non-functional stubs; no quick-view entry point is added to the cart drawer or search results; the detail page itself is unchanged.

## Capabilities

### New Capabilities
- `storefront/product-quick-view`: How a shopper previews and buys a product without leaving the listing — when the card's action is revealed, what the quick view presents, how a variant is chosen and added to the cart from it, how it degrades when the product cannot be loaded, and how it behaves for keyboard, screen-reader, and touch shoppers.

### Modified Capabilities
- `storefront/product-catalog`: Two requirements change. "Products requiring a choice are distinguished from those that do not" currently mandates that acting on a variable product from a listing *takes the shopper to the detail view* — the quick view replaces that navigation with an in-place choice, so the requirement must permit resolving the choice without leaving the listing while keeping the guarantee that nothing is added before a variant is picked. "A product displays its identifying and commercial details" gains the condition that a listing's actions may be revealed on engagement rather than shown permanently, provided they remain reachable without hover.

## Impact

- **Code**: `src/components/product/ProductCard.tsx` (hover-reveal wrapper on the action slot; "Options" becomes a button that opens the quick view instead of a `Link`). New: a shared modal primitive under `src/components/ui/`, a `ProductQuickView` component, and a client-side single-product fetch. `src/app/globals.css` may gain a keyframe if the reveal is not expressible in Tailwind utilities alone.
- **Blast radius**: `ProductCard` has five consumers — `app/deals/page.tsx`, `ProductListing.tsx`, `ProductDetail.tsx` ("You May Also Like"), `home/DealOfWeek.tsx`, and `home/ProductSection.tsx`. The hover behaviour and quick view appear in all five. `ProductDetail` rendering a card that opens a quick view over the detail page is acceptable but worth confirming visually.
- **APIs consumed**: `GET /products/:slug` (public, no auth) newly called from the browser rather than only the server. `POST /cart/items` via the existing `useAddItemMutation`, which already accepts `variantId`.
- **Dependencies**: none added. No animation library is installed and none is needed — CSS transitions cover the reveal. The modal is hand-written rather than pulling in a dialog library, consistent with the project's existing hand-rolled overlays.
- **Accessibility**: this is the project's first real dialog. The existing `CartDrawer` and mobile nav have no focus trap, no Escape handler, and no `role="dialog"`; the new primitive sets the standard rather than copying that gap.
- **Performance**: one extra API request per quick-view open. Repeat opens of the same product should not refetch. The listing itself gains no new requests — nothing is prefetched on hover.
- **Risk**: a hover-only reveal that misses the touch case would make "Add to cart" unreachable on mobile across the entire storefront. The no-hover fallback is the highest-stakes detail in this change.
