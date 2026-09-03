import type { ProductImage } from "@/types/product";

/**
 * How a product's images are ordered for a selected variant, and which variant a
 * chosen image depicts. Pure and shared, because the product page and the
 * in-listing quick view must answer both questions identically.
 */

/**
 * The product's images ordered for `selectedVariantId`:
 *
 *   1. the selected variant's images
 *   2. the shared images
 *   3. everything else, in the order given
 *
 * Every image is always returned. Ordering, not filtering, is what the
 * variant-to-image link drives.
 *
 * This deliberately replaces an earlier rule that showed only the selected
 * variant's images plus the shared ones. The common way a small catalogue is
 * photographed — one photo per variant, no packaging shots — left that rule
 * returning a single image, and `ProductGallery` hides its thumbnail strip when
 * there is only one image, so a four-photo product showed one photo and no way
 * to reach the other three. Nothing is hidden now: the selection decides which
 * image leads, not which images exist.
 *
 * Order within each group is the order given, which is `pickImages`'
 * primary-then-sortOrder sequence. With no selection, or on a product whose
 * images carry no variant at all, the result is the input unchanged.
 */
export function visibleImages(
  images: ProductImage[],
  selectedVariantId: string | null,
): ProductImage[] {
  if (selectedVariantId === null) return images;

  const own: ProductImage[] = [];
  const shared: ProductImage[] = [];
  const rest: ProductImage[] = [];

  for (const image of images) {
    if (image.variantId === selectedVariantId) own.push(image);
    else if (image.variantId === null) shared.push(image);
    else rest.push(image);
  }

  // Nothing to reorder when the selection matches no image and none are shared,
  // which is every product whose images predate variant assignment.
  if (own.length === 0 && shared.length === 0) return images;

  return [...own, ...shared, ...rest];
}

/**
 * The variant a chosen image depicts, or `null` for a shared image.
 *
 * `null` is what makes "clicking a packaging shot leaves my choice alone" fall
 * out of the ordinary path rather than needing a special case at the call site.
 */
export function variantIdForImage(image: ProductImage | undefined): string | null {
  return image?.variantId ?? null;
}
