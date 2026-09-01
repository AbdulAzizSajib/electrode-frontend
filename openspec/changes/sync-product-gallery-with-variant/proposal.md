## Why

On a product detail page the gallery and the option buttons sit side by side and ignore each other. `ProductGallery` receives a flat `string[]` of image URLs and owns its selected index internally; nothing recomputes it when the shopper picks a different option. A shopper looking at a two-colour earbud sees four photos in a fixed order, clicks the navy one, and the page keeps quoting the mint price, the mint SKU and the mint stock count. The photo they are looking at and the product they are about to buy are different things.

The cart drawer already gets this right — `toCartLine` prefers `item.variant?.image` over the product's primary image — so a shopper who adds to cart sees the correct variant photo appear in a drawer over a product page still showing the wrong one.

The API change (`electrode-server` / `link-product-images-to-variants`) makes each image report the variant it depicts, or that it is shared across all of them. That is the missing input: with it the gallery can show the images belonging to the selected option, and a thumbnail can identify the option it belongs to.

## What Changes

- **Selecting an option filters the gallery.** Choosing a variant shows that variant's images plus the shared ones (charging case, box contents), and moves the main image to the first of them. Images belonging to other variants are not shown.
- **Selecting a thumbnail selects its variant.** Clicking a photo that belongs to a variant selects that variant, so the price, compare-at price, discount, stock, availability and SKU all update to match the photo on screen. Clicking a shared photo changes nothing but the displayed image.
- **A variant with no images of its own falls back rather than showing an empty gallery.** If the selected variant has neither its own images nor any shared ones, the full image set is shown, so the page is never image-less because of how an admin assigned photos.
- **Products with no assignments behave exactly as today.** When every image is shared — which is every product until an admin assigns otherwise — the gallery is the flat, unfiltered list it is now.
- **The gallery's selection becomes controlled by the page.** `ProductGallery` currently owns its active index in internal state with no way in or out. It gains a controlled selection and a change callback, so the page can drive it from the variant and be told when a thumbnail is picked.
- **"Buy It Now" uses the image the shopper is looking at.** It currently hardcodes `images[0]` for the order intent's display image, which is wrong as soon as the gallery is variant-aware.
- **The quick view gets the same behaviour.** `ProductQuickView` renders the same gallery beside the same kind of variant selector and has the same defect; fixing the gallery without fixing its second call site would leave the bug half-fixed.

## Capabilities

### New Capabilities
- `storefront/product-gallery`: How a product's images relate to the option a shopper has selected — which images are shown for a selection, what selecting an image does to the selection, how the two stay consistent, and how the gallery behaves for products whose images carry no option information at all. This is added as its own capability rather than folded into `storefront/product-catalog` because it governs a specific interaction between two controls, and because the same behaviour is required in both the detail page and the quick view, which belong to different capabilities today.

### Modified Capabilities
<!-- None. `storefront/product-catalog` and `storefront/product-quick-view` do not exist under `openspec/specs/` yet — the changes that introduced them were never archived — so no requirement of theirs is being restated or amended here. -->

## Impact

**Depends on**
- `electrode-server` change `link-product-images-to-variants`, for images to report their variant.
- `electrode-admin` change `link-product-images-to-variants-admin`, for that data to exist on real products. Until an admin assigns images, every product takes the unchanged fallback path — this change is safe to ship before assignments exist, but has no visible effect until they do.

**Types**
- `ApiProductImage` already carries the fields; `variantId` is added to it.
- `Product.images` is currently `string[]`, flattening away every image's id, alt text, sort order and primary flag. It becomes a list of image objects carrying at least the URL and the variant reference, since a bare URL cannot express which variant a photo belongs to. This is the widest-reaching part of the change: `toProduct`, `pickImages`, and every consumer of `product.images`.

**Components**
- `ProductGallery` — controlled selection and change callback; two call sites (`ProductDetail`, `ProductQuickView`).
- `ProductDetail` — derives the visible image list from the selected variant, maps a chosen thumbnail back to a variant, fixes the Buy It Now display image.
- `ProductQuickView` — same wiring, against its own variant state.

**Not in scope**
- No change to how variants are chosen, priced, or added to the cart — only to which images are shown alongside that choice.
- No zoom, lightbox, or carousel; the gallery stays a thumbnail strip and a main image.
- No change to product cards or listings, which show one primary image and have no variant selector.
- No URL state for the selected variant or image (not deep-linkable in this change).
