## Why

The wishlist, product comparison, and quick view are wired into the storefront unconditionally. A merchant who does not want one has no way to remove it, because nothing in the storefront asks whether it should be offered.

The backend is gaining that answer — a `catalogConfig` block of three flags on the public settings payload (`server` change `add-catalog-display-settings`), editable from the admin panel (`admin` change `add-catalog-settings-page`). This change is the half that acts on it: the storefront stops offering a feature its merchant has turned off.

## What Changes

- The storefront reads `catalogConfig` from the settings payload it **already** fetches in its root layout, so no new request and no new cache.
- **Wishlist off** removes every wishlist surface: the heart on the product card, the save control on the product detail page, the header's saved link and count, the mobile bottom-nav entry, and `/wishlist` stops serving a page.
- **Compare off** removes every compare surface: the card's compare control, the one on the detail page, the one inside quick view, the header's compare link and count, the persistent compare bar, the mobile bottom-nav entry, and `/compare` stops serving a page.
- **Quick view off** means a product with variants goes to its **full product page** when the shopper presses Add to cart in a listing, instead of opening the preview panel. A product without variants is unaffected and still adds directly. The quick view is not rendered at all.
- Merchant-authored navigation is filtered: a `mainNav` entry pointing at a disabled feature's route is not shown, so the merchant cannot leave a link to a page that no longer serves.
- All three default to enabled, so a store that has not configured them behaves exactly as it does today.

Builds directly on `unify-card-add-to-cart-action`, which gives every card one **Add to cart** action; this change adds a third destination for that one action.

## Capabilities

### New Capabilities

- `storefront/catalog-feature-availability`: which catalog features the storefront offers is a merchant decision, and a feature that is off is offered nowhere — no control, no navigation entry, no route.

### Modified Capabilities

- `storefront/product-catalog`: the listing's purchase action for a product with variants gains its second destination — the preview when quick view is offered, the product's own page when it is not.

## Impact

- New `src/lib/catalog-features.ts` and `src/components/providers/CatalogFeaturesProvider.tsx`, mirroring `lib/format.ts` + `CurrencyFormatProvider` — the pattern this codebase already uses for a singleton settings value read by both server and client components.
- `src/app/layout.tsx` — sets the features for the server pass and mounts the provider for the client pass, beside the currency format it already does this for.
- `src/components/product/ProductCard.tsx`, `ProductDetail.tsx`, `ProductQuickView.tsx` — gate the wishlist and compare controls; the card gains the quick-view-off destination.
- `src/components/layout/Header.tsx`, `MobileBottomNav.tsx`, `CompareBar.tsx` — gate their wishlist and compare entries; `Header` also filters `mainNav`.
- `src/app/(shop)/wishlist/page.tsx`, `src/app/(shop)/compare/page.tsx` — `notFound()` when the feature is off.
- No change to `wishlistApi`, `compareSlice`, `compare-storage`, or any backend call. Turning a feature off hides it; it does not discard what shoppers saved.
- Depends on the `server` change being deployed. Until then the field is absent and every feature reads as enabled — which is the current behaviour, so this change is safe to ship in either order.
