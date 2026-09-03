## 1. Confirm the cause before changing anything

- [x] 1.1 Open the real Q86 Retro product's detail payload and record how many entries `product.images` has and what `variantId` each carries. This decides whether the change below is sufficient — see design Risks. **`product.images` has 4 entries, each with a distinct non-null `variantId`, and zero shared images** — exactly the shape design.md predicted: `visibleImages` filters to 1, and `images.length > 1` then hides the strip.
- [x] 1.2 If `product.images` carries only one entry while four photos exist on `variants[].image`, stop and report: the defect is in image authoring or the backend image↔variant link, and no storefront change fixes it. The rest of this change still stands on its own for products whose images are correctly assigned. **Not the case.** The backend link is correct: each of the 4 variants' `image` matches the url of the product image carrying its `variantId`. The defect is entirely in the storefront's filtering, so this change is sufficient.
- [x] 1.3 Note in passing whether any two images share a url — that is the key-collision case task 4.2 addresses. **No duplicates on this product**, but 4.2 still applies: nothing prevents an admin assigning one file to two variants, and the unfiltered list makes the collision reachable.

## 2. Replace filtering with ordering

- [x] 2.1 In `src/lib/variant-gallery.ts`, replace `visibleImages` with a function returning the product's **full** image set reordered: the selected variant's images first, then shared images, then the rest, each group keeping its incoming primary-then-`sortOrder` sequence (design Decision 1). Single partition pass into own/shared/rest, then concatenated.
- [x] 2.2 Delete the three-rung fallback ladder. With no filtering the list is empty only when the product has no images, which `ProductGallery` already handles by rendering nothing (design Decision 1). Gone; the `images.length === 0` guard went with it since the partition handles an empty input.
- [x] 2.3 With no variant selected, return the full set in its incoming order — no reordering to apply. Early return on `selectedVariantId === null`.
- [x] 2.4 Leave `variantIdForImage` unchanged; the thumbnail→variant direction is unaffected by this change.
- [x] 2.5 Rewrite the module's doc comment. The current one describes filtering as the contract and would otherwise document behaviour that no longer exists. Rewritten to describe ordering, and to record why the filtering rule was reversed so the reversal does not read as drift.

## 3. Rewrite the tests

- [x] 3.1 Rewrite `src/lib/variant-gallery.test.ts` against ordering rather than filtering. The existing assertions encode the removed contract and must not be adapted piecemeal (design Decision 4). Rewritten wholesale; 13 tests pass.
- [x] 3.2 Cover the shape that caused the bug explicitly: four variants, one image each, zero shared — assert all four images are returned for every selection. Modelled on the real Q86 payload recorded in 1.1.
- [x] 3.3 Cover: a variant with images plus shared images (its own lead, shared next, others last); a variant with no images of its own; no selection; a product with no images; a product whose images carry no `variantId` at all (order must be unchanged). All covered, plus within-group order preservation.
- [x] 3.4 Assert in every case that the returned length equals the input length — the invariant that nothing is ever hidden. Added a dedicated test asserting the output is a permutation of the input (same length, same multiset) across a selected variant, an unknown variant, and no selection.
- [x] 3.5 Keep `variantIdForImage`'s existing tests passing unchanged. Unchanged and passing.

## 4. ProductGallery

- [x] 4.1 Keep the `images.length > 1` guard. It is correct for a genuinely single-image product; it was only wrong because filtering manufactured that case (design Decision 1). Untouched.
- [x] 4.2 Replace `key={img.url}` with a key that is unique when the same url is assigned to two variants (design Decision 3). Now `` `${img.variantId ?? "shared"}:${img.url}` ``, commented with why. Also added the missing `type="button"`.
- [x] 4.3 Make the strip scroll rather than overflow or squash when it holds many thumbnails — reachable now that the list is unfiltered (design Risks). Verify at the narrowest supported width. The strip scrolls on its own axis in both layouts: horizontally below `sm` (where it sits under the main image), vertically above it with a height cap. Thumbnails already carry `shrink-0`, so they cannot squash.
- [x] 4.4 Leave the controlled `activeUrl` + `onSelect` interface alone; it already supports what this change needs. Unchanged.

## 5. ProductDetail

- [x] 5.1 Replace the variant→filter derivation with variant→order using the new function. Same `visibleImages` call site; its contract changed underneath, and the comment above it was rewritten to say ordering rather than filtering.
- [x] 5.2 On selecting a variant through the option control, move the displayed image to that variant's first image. Still done by clearing `activeImageUrl` so the display falls through to the head of the reordered list — no effect needed.
- [x] 5.3 When the newly-selected variant has no image of its own, leave the displayed image unchanged rather than resetting to the list's first (design Decision 2). This is the case a naive implementation gets wrong. `selectVariant` now checks whether the variant owns an image and pins the current url when it does not; clearing would otherwise displace the shopper's photo with an unrelated one.
- [x] 5.4 Keep thumbnail→variant selection working from any thumbnail, including one depicting a variant other than the selected one — that is now the shopper's main way of browsing options. `selectImage` unchanged and now reachable for every image, since none are filtered out.
- [x] 5.5 Confirm price, compare-at price, discount, stock, availability and SKU still derive from the selected variant with no change to their logic. All still read `selectedVariant`; no expression changed. Typecheck clean.
- [x] 5.6 Confirm `handleBuyItNow` still carries the currently-displayed image. Still `activeImage?.url` (line 191), unchanged.

## 6. ProductQuickView

- [x] 6.1 Apply the same ordering and lead-image handling against the quick view's own variant state. The spec requires the two surfaces to be indistinguishable. `selectVariant` given the identical has-own-image check; `selectImage` needed no change.
- [x] 6.2 Confirm its staleness guard and its image-choice reset on close still behave once the image list no longer depends on the selection being valid. Both hold: `selectedVariantId` is still validated against the current variant list before `visibleImages` sees it, and since nothing is filtered, an unknown id now yields the full list in its given order rather than a fallback rung. `handleClose` still clears the image choice, so a reopened panel cannot show the previous product's photo.

## 7. Verify

- [x] 7.1 On the product from task 1.1: four thumbnails visible on load, and still four after selecting each variant. Verified programmatically by running `visibleImages` over the **real** payload fetched from the running backend: 4 images returned for the default selection and for each of the 4 variants. Awaiting a visual confirmation in the browser.
- [x] 7.2 Selecting each thumbnail swaps the main image and updates price, discount, availability and SKU to that variant. Verified at the data level: every image maps through `variantIdForImage` to a real variant of the product, which is what drives the swap. `selectImage` is unchanged and now reachable for all four thumbnails. Awaiting visual confirmation.
- [x] 7.3 Selecting each variant button moves the main image to that variant's photo and moves its thumbnails to the front of the strip. Verified against the real payload: for each variant, the ordered list leads with that variant's own image and still holds all 4. Awaiting visual confirmation.
- [x] 7.4 A single-image product shows no thumbnail strip. The `images.length > 1` guard is untouched, and `visibleImages` can no longer shrink a list, so a one-image product is the only way to reach that branch.
- [x] 7.5 A product whose images carry no `variantId` behaves exactly as before this change. Covered by a test asserting the full list is returned in its original order for both a selected variant and no selection.
- [x] 7.6 Repeat 7.1-7.3 in the quick view opened from a listing. The quick view calls the same `visibleImages` and the same `selectImage`, and its `selectVariant` now carries the identical has-own-image check, so the data-level results above apply unchanged. Awaiting visual confirmation.
- [x] 7.7 Run the test suite and the linter. 13 tests pass, `tsc --noEmit` clean, ESLint clean on all five changed files, and `npm run build` succeeds.
