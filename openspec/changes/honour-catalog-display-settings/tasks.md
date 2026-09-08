## 1. Carry the flags into the storefront

- [x] 1.1 Add `catalogConfig: CatalogConfig` to `StoreSettings` in `src/types/store-settings.ts`, with `CatalogConfig` as `{ showWishlist, showCompare, showQuickView }` — all `boolean`. Mirror the backend's field exactly.
- [x] 1.2 Add the all-enabled default to `FALLBACK_SETTINGS` in `src/services/store-settings.ts`, so a failed settings read leaves every feature offered rather than withdrawing them.

  Also backfilled per-key in the response mapper, matching how `checkoutConfig` is handled there — a whole-block `??` would report a newly-added fourth flag as `undefined`, which is falsy and would withdraw that feature by accident.

- [x] 1.3 Create `src/lib/catalog-features.ts` holding the flags at module scope behind `setCatalogFeatures` / `getCatalogFeatures`, with an all-enabled fallback. Doc-comment it by pointing at `lib/format.ts`, whose reasoning and single-store caveat this inherits.
- [x] 1.4 Create `src/components/providers/CatalogFeaturesProvider.tsx` as a `"use client"` component calling `setCatalogFeatures` in its body — during module evaluation, not in an effect — and rendering its children. Model it on `CurrencyFormatProvider`.
- [x] 1.5 In `src/app/layout.tsx`, call `setCatalogFeatures` for the server pass and mount `CatalogFeaturesProvider` for the client pass, beside the currency handling that already does both.

## 2. Product surfaces

- [x] 2.1 `ProductCard.tsx`: render `WishlistButton` only when `showWishlist`, and `CompareButton` only when `showCompare`. Check the remaining overlay positions still line up when one or both are gone — the sold-out chip and the two buttons currently offset each other.

  They did not line up, so the corner was restructured. The chip, heart and compare control each carried the offset its neighbours implied (`top-14` for compare, `top-23` when the chip took the corner), which only worked while all three were unconditional — gating the heart out left compare floating in its gap. They are now one `absolute right-3 top-3 flex flex-col items-end gap-3` stack that spaces whatever is present, so no combination can drift. Verified in the rendered markup.

- [x] 2.2 `ProductCard.tsx`: hoist the action's `className` to a module constant and resolve the action in the order given in design.md — out of stock first (disabled button), then no-variants (add), then variants-with-preview (open quick view, `aria-haspopup="dialog"`), then variants-without-preview (`Link` to `/products/[slug]`, no `aria-haspopup`).

  The icon-and-label contents are hoisted into a shared `actionContent` fragment too, so they cannot drift between the four renderings either.

- [x] 2.3 `ProductCard.tsx`: render `ProductQuickView` only when `showQuickView`.
- [x] 2.4 `ProductDetail.tsx`: gate its `WishlistButton` and `CompareButton` on the same two flags.

  The row wrapping them is gated as well, so neither feature being offered leaves no empty flex container and no stray top margin.

- [x] 2.5 `ProductQuickView.tsx`: gate its `CompareButton` on `showCompare`.

## 3. Navigation and routes

- [x] 3.1 `Header.tsx`: gate the wishlist link and its count on `showWishlist`, and the compare link and its count on `showCompare`. Skip the `useGetWishlistCountQuery` subscription entirely when the wishlist is off.

  Reads the flags from the `settings` prop it already receives rather than from `getCatalogFeatures()`. The module-scope copy exists for components with no props path; the header has one.

- [x] 3.2 `Header.tsx`: filter `mainNav` so an entry (or child entry) pointing at a disabled feature's route is not rendered.

  Filtering lives in `lib/catalog-features.ts` as the pure `filterNavForFeatures` / `isHrefOffered`, which compare the path only so `/wishlist?from=menu` and a trailing slash resolve the same. Applied once in the header, since the same list is handed to the mobile drawer.

- [x] 3.3 `MobileBottomNav.tsx`: gate its wishlist and compare entries on the same flags.

  Correction: this bar has no wishlist entry — only compare, which is now gated. The original task text assumed one.

- [x] 3.4 `CompareBar.tsx`: render nothing when `showCompare` is off.
- [x] 3.5 `src/app/(shop)/wishlist/page.tsx` and `src/app/(shop)/compare/page.tsx`: read the settings and call `notFound()` when their feature is off.

## 4. Minimal verification

Happy path only. There is one existing test file in reach (`src/lib/chrome-services.test.ts`, covering `getStoreSettings`); extend it rather than adding a suite, and check the UI by hand.

- [x] 4.1 Add one test to `chrome-services.test.ts`: a settings response with no `catalogConfig` yields all three flags enabled. That is the default-safety property everything else rests on.
- [x] 4.2 With all three flags on (or the backend not yet deployed), confirm the storefront behaves exactly as it does today — this is the regression that matters most.

  Verified by diffing the live dev server's rendered home page against a capture taken before this change: `Add to cart` ×3, `aria-haspopup="dialog"` ×3, `lucide-shopping-cart` ×3, `lucide-heart` ×4, `lucide-repeat` ×3 — identical on both sides.

The server change has since been applied, so the flags below were exercised by writing `catalogConfig` straight to the settings row, fetching the storefront, and restoring the column to null afterwards.

- [x] 4.3 Wishlist off: no heart on cards or the product page, no header link or count, no mobile-nav entry, and `/wishlist` returns not-found.

  Controls verified gone — zero `lucide-heart` in the rendered home page, against four with the feature on. The route could not be confirmed: `/wishlist` is in `PROTECTED_ROUTES` in `src/proxy.ts`, so an unauthenticated request is answered `307 → /account/login` before the page component runs, exactly as design.md's risk note predicted. The `notFound()` is reached only once signed in, which this environment cannot simulate. `/compare`, whose page is identical in shape and not auth-gated, does return 404 — see 4.4.

- [x] 4.4 Compare off: no compare control on cards, the product page, or inside quick view; no header link or count; no compare bar; and `/compare` returns not-found.

  Zero `lucide-repeat` in the rendered page, against three with the feature on, and `/compare` returns a clean 404.

- [x] 4.5 Quick view off: a variable product's Add to cart navigates to its product page, a simple product still adds directly from the listing, and no quick view panel is mounted.

  With the preview off, `aria-haspopup="dialog"` drops to zero while all three cards still read `Add to cart` — so the action became the `<Link>` branch without changing its label. No simple product exists in the dev database to confirm that half.

- [ ] 4.6 Confirm a sold-out variable product stays disabled with quick view off — the out-of-stock branch must win before the navigating branch.

  Still blocked: the dev database holds one product and it is in stock, so the out-of-stock branch cannot be reached. The ordering is enforced structurally — out-of-stock is the first test in the chain — but that is an argument, not a check.

- [x] 4.7 Turn a feature off and back on and confirm previously saved wishlist items and compare selections are still there.

  The flags were turned off and restored, and the storefront returned to offering all three. Nothing in this change calls a delete: the compare list is untouched in `localStorage` and the wishlist API is never gated. Not confirmed against a signed-in account holding saved items.
- [x] 4.8 Run the project's lint, type check, and existing tests.

  `npx tsc --noEmit` clean; `npm run lint` 0 errors (one pre-existing unused-var warning in `ProductSection.tsx`, unrelated); `npm test` 115/115 across 8 files, including the new default-safety test.
