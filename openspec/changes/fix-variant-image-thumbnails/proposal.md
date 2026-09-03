## Why

A product with four photos shows one, and the thumbnail strip beside the main image is empty. On the Q86 Retro earbud page — four variants, one photo each, no shared photos — the shopper sees a single image and no way to reach the other three.

This is not a bug in one line; it is two rules meeting. `visibleImages` shows "the selected variant's images plus the shared ones", and `ProductDetail` auto-selects a variant on first render, so the page opens already filtered to that one variant's single photo. `ProductGallery` then hides the entire thumbnail column behind `images.length > 1`, so the one surviving photo takes the strip down with it. Each rule is defensible alone — filtering keeps the gallery honest about what is selected; hiding a one-item strip avoids a pointless lone thumbnail — and together they delete three quarters of the product's photography.

The shape that triggers it is the normal shape. "One photo per colour, no packaging shots" is how a small catalogue is actually photographed, and the previous change's own fallback ladder was built to stop the gallery being *empty*, not to stop it being *singular*. So the more carefully an admin assigns images to variants, the fewer photos the shopper sees.

## What Changes

- **The gallery shows the whole product's photography, not just the selected variant's.** Every image stays reachable; selecting a variant changes which photo leads, not which photos exist. This reverses the filtering rule introduced by `sync-product-gallery-with-variant` while keeping the connection it was built for.
- **Selecting a variant moves the main image to that variant's photo.** The behaviour the shopper actually wanted from filtering — the picture matching the option — is preserved without hiding anything.
- **Selecting a thumbnail still selects its variant.** Unchanged: clicking a photo that depicts a variant selects that variant; clicking a shared photo leaves the selection alone.
- **Thumbnails belonging to a variant other than the selected one remain visible and clickable.** They are the mechanism by which a shopper browses colours, which is the ordinary way people shop this kind of product.
- **A single-image product still shows no strip.** The `length > 1` guard is right for a genuinely one-photo product; it was only wrong because filtering manufactured that case.
- **The strip is ordered so the selected variant's images lead.** With filtering gone the strip is longer, and the photo the shopper just selected should not be somewhere in the middle of it.
- **Duplicate image urls stop colliding as React keys.** `key={img.url}` breaks if the same file is assigned to two variants, which the new unfiltered list makes reachable.

## Capabilities

### Modified Capabilities
- `storefront/product-gallery`: The requirement that selecting an option filters the gallery to that variant's images plus shared ones is replaced. Images belonging to other variants are no longer excluded; the selection now determines which image leads rather than which images exist. The reciprocal requirement — that selecting a thumbnail selects its variant — is unchanged and is restated only where the filtering rule was entangled with it. The fallback ladder for a variant with no images of its own becomes unnecessary in its current form and is restated.

### New Capabilities
<!-- None. `storefront/product-gallery` was created by `sync-product-gallery-with-variant`; this change amends it. -->

## Impact

**Storefront code**
- `src/lib/variant-gallery.ts` — `visibleImages` and its three-rung fallback ladder are the filtering rule being replaced. What remains is an ordering concern, not a visibility one. `variantIdForImage` is unaffected.
- `src/lib/variant-gallery.test.ts` — the existing tests encode the filtering behaviour directly (including "shows the shared images when nothing is selected yet") and must be rewritten alongside it, not merely extended.
- `src/components/product/ProductGallery.tsx` — the `images.length > 1` guard stays; `key={img.url}` needs a stable unique key.
- `src/components/product/ProductDetail.tsx` — the variant→lead-image effect replaces variant→filter.
- `src/components/product/ProductQuickView.tsx` — second call site with the same wiring; it has the same defect and must change with it.

**Data**
- No backend or admin change. `ApiProductImage.variantId` already arrives on the detail payload and is enough for this.
- If a product's four photos live on `variant.image` rather than as product images carrying `variantId`, this change alone will not surface them — that is a data/authoring question, and the storefront's rejection of matching images to variants by url string still stands. Verify against a real product before implementing.

**Interaction with other in-flight changes**
- `add-product-option-types` rewrites how a variant gets selected in the same two components. This change assumes only that *some* variant is selected, so the two are compatible, but they collide textually and should be sequenced deliberately.

**Not in scope**
- No zoom, lightbox, or carousel — the gallery stays a thumbnail strip and a main image.
- No change to product cards or listings, which show one primary image.
- No URL state for the selected image.
- No change to how images are uploaded or assigned in the admin.
