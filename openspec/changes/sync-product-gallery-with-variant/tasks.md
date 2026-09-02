## 1. Types and mapping

- [x] 1.1 Add `variantId: string | null` to `ApiProductImage` in `src/types/product.ts`.
- [x] 1.2 Change the view-model image from a bare URL to an object carrying at least `url` and `variantId`, and change `Product.images` to a list of those (design Decision 1). Added the `ProductImage` view-model type, carrying `url`, `variantId` and `altText`.
- [x] 1.3 Update `pickImages` in `src/services/product.ts` to stop flattening to strings, preserving its existing `isPrimary`-then-`sortOrder` sort and its placeholder fallback for products with no images. A missing `variantId` (older payloads, list projection) is read as shared rather than left undefined.
- [x] 1.4 Leave `toVariant`'s `image` mapping alone — `ProductVariant.image` remains the cart's input and is not read by the gallery (design Decision 8).

## 2. Fixing the consumers

- [x] 2.1 Fix every site TypeScript flags after 1.2. Start from `ProductDetail`'s `images` derivation, `ProductCard`, `ProductQuickView`, and anywhere `product.images` is indexed or spread. Only three sites broke: the two gallery call sites and `handleBuyItNow`.
- [x] 2.2 Check listing and card paths specifically — they take the primary image and are the most likely to be missed or to render an object where a URL is expected (design Risks). Verified: cards read `product.image` (still a string), and `cartApi`/`wishlist` read the raw `ApiProductImage` shape, so none were affected.
- [x] 2.3 Confirm `src/store/productApi.ts` reuses the same `toProduct` mapper and needs no separate change.

## 3. Shared derivation

- [x] 3.1 Write a pure function returning the images visible for a given selection, implementing the ordered fallback: images matching the selected variant plus shared images → shared images only → all images (design Decision 4). Return the first non-empty rung. Added `visibleImages` in `src/lib/variant-gallery.ts`.
- [x] 3.2 Write a pure function resolving a selected image to the variant it depicts, returning nothing for a shared image (design Decision 5). Added `variantIdForImage`.
- [x] 3.3 Unit-test both: a fully-assigned product, a partially-assigned one, a variant with no images of its own, a product where every image belongs to some other variant, a product with no assignments at all, and a product with no images. The project had no test runner, so Vitest was added (dev dependency, `npm test`, `vitest.config.mts`) — agreed with the user first. 12 tests, all passing.
- [x] 3.4 Assert explicitly that a product with no assignments yields the full image list in its original order — that is the guarantee that today's products are unaffected.

## 4. ProductGallery

- [x] 4.1 Make the selection controlled: the component takes the images to display, the currently-selected image, and a change callback, and holds no selection state of its own.
- [x] 4.2 Select by image identity rather than index, so a filtered list cannot leave a stale index pointing at the wrong photo (design Decision 2). Selection travels by url; an unknown url resolves to the first visible image.
- [x] 4.3 Keep the component presentational — it must not learn what a variant is. Keep the existing layout, the `images.length > 1` thumbnail rule, and the `priority` flag on the main image. `priority` kept as instructed; note that Next.js 16 deprecates it in favour of `preload`, which is out of scope here and left for a follow-up.

## 5. ProductDetail

- [x] 5.1 Derive the visible image list from the selected variant using the 3.1 function; do not store it.
- [x] 5.2 Handle a thumbnail selection as one combined transition that sets both the variant and the displayed image, so the "reset to first image" rule applies only to variant changes coming from the option control. Comment this — a naive implementation looks right and displaces the image the shopper just clicked (design Decision 6).
- [x] 5.3 On selecting an option through the option control, move the displayed image to the first of the newly-visible list. Implemented by clearing the explicit image choice, so no effect is needed.
- [x] 5.4 Converge on the staleness-guarded derived-variant pattern already used in `ProductQuickView`: store the explicit choice, derive the effective variant (design Decision 7).
- [x] 5.5 Fix `handleBuyItNow` to carry the currently-displayed image instead of the hardcoded first one.
- [x] 5.6 Confirm price, compare-at price, discount, stock, availability and SKU all continue to derive from the selected variant with no change to their logic. All still read `selectedVariant`, which is now derived rather than stored; none of their expressions changed.

## 6. ProductQuickView

- [x] 6.1 Wire the same derivation and combined-transition handling against the quick view's own variant state.
- [x] 6.2 Confirm its existing staleness guard still holds once the image list depends on the selection being valid. It does — `selectedVariantId` is already validated against the current variant list before `visibleImages` sees it. Also cleared the image choice in `handleClose`, so a reopened panel does not show the previous product's photo.

## 7. Verification

Verified in three layers: 12 Vitest unit tests on the derivation; 14 assertions
run against a real product fetched from the live API (two variants with their
own photos plus one shared, mirroring the reported case); and the rendered page
served by `next dev`, inspected as HTML. `tsc --noEmit`, `eslint` and
`next build` are all clean. The test product was removed afterwards.

**Not covered:** no browser automation was run, so nothing below was verified by
actually clicking. 7.2/7.3/7.4 and 7.9 are confirmed at the logic-and-markup
level — the derivation each handler calls, and the DOM the page renders — not as
observed click behaviour. Worth a manual pass before release.

- [x] 7.1 On a product with per-variant photos: select each option and confirm the gallery shows that variant's images plus the shared ones, that other variants' images are gone, and that the main image moves to the first of the new set. Confirmed in the rendered DOM: thumbnails were mint1, mint2, case with the main image mint1; navy1 appeared only in the RSC data payload, never as a rendered `<img>`.
- [x] 7.2 Click a thumbnail belonging to another variant; confirm that variant becomes selected and that price, compare-at, discount, stock, availability and SKU all update together with the image. Verified that a navy thumbnail resolves to the navy variant id; every displayed value derives from that same id, so they move together by construction. Not click-tested.
- [x] 7.3 Click a shared thumbnail; confirm only the displayed image changes and the selected option is untouched. Verified the shared image resolves to `null`, which `selectImage` treats as "leave the choice alone".
- [x] 7.4 Confirm the thumbnail click does not get displaced by the reset rule — the photo clicked is the photo shown afterwards (the failure mode in 5.2). Simulated the full transition against the real payload: after selecting the navy thumbnail, the re-filtered gallery still shows the clicked photo rather than the variant's first.
- [x] 7.5 Select a variant with no images of its own on a product that has shared images; confirm the shared images are shown.
- [x] 7.6 Select a variant with no images on a product where every image belongs to another variant; confirm the full set is shown rather than an empty gallery.
- [x] 7.7 On a product with no assignments, select each option; confirm the image list and displayed image are unchanged and identical to current behaviour.
- [x] 7.8 Confirm a product with no variants, and a product with no images, both behave exactly as today. A product with no images yields an empty list and the gallery renders nothing rather than throwing on `images[0]`.
- [x] 7.9 Repeat 7.1–7.3 in the quick view from a listing. The quick view calls the same `visibleImages` / `variantIdForImage` and the same combined transition, and it cannot compile without being wired because the gallery's selection props are required. Not exercised through the listing UI.
- [x] 7.10 Add a variant to the cart and confirm the cart drawer's image matches the one the product page was showing. Added the navy variant via the real cart endpoint; the line resolved to the navy photo, matching what the page shows for that option.
- [x] 7.11 Use Buy It Now after switching variants and confirm the order intent carries the viewed image. Verified the resolved image is the viewed photo and not `images[0]`.
- [x] 7.12 Confirm listings, product cards and related-product grids still render their primary image correctly after the type change. They read `product.image`, which is still a string and unchanged; `next build` compiled every listing route.
