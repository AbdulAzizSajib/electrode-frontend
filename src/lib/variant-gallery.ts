import type { ProductImage } from "@/types/product";

/**
 * How a product's images relate to its variants: which photo a selection leads
 * to, and which variant a chosen photo depicts. Pure and shared, because the
 * product page and the in-listing quick view must answer both questions
 * identically.
 */

/**
 * The first image depicting `variantId`, or `undefined` when that variant has
 * no photo of its own — including when nothing is selected yet.
 *
 * This is the photo a variant change moves the main image to. `undefined` is
 * what makes "a variant with no photo of its own leaves the shopper's view
 * alone" fall out of the ordinary path rather than needing a special case at
 * the call site. A shared image (`variantId: null`) depicts no variant, so it
 * is never the answer.
 *
 * "First" is first in the order given, which is `pickImages`'
 * primary-then-`sortOrder` sequence — so it is the variant's primary photo.
 *
 * This replaces `visibleImages`, which returned the whole image list reordered
 * so the selected variant's photos led. That reordering was introduced to keep
 * the selected photo out of the middle of a long strip, but it moved the
 * *strip* on every selection instead of moving the highlight: the selected
 * image was always reordered into position one, so the ring sat permanently on
 * the first thumbnail while the photos shuffled underneath it. A shopper reads
 * that as a selector that does not respond. The strip now keeps its authored
 * order, the ring moves, and `ProductGallery` scrolls the selected thumbnail
 * into view — which is what the ordering was actually reaching for.
 *
 * The reason `visibleImages` existed at all — that the gallery must never hide
 * an image — is unaffected: both call sites now hand `ProductGallery` the full
 * list directly, which is strictly less filtering than before.
 */
export function firstImageForVariant(
  images: ProductImage[],
  variantId: string | null,
): ProductImage | undefined {
  if (variantId === null) return undefined;
  return images.find((image) => image.variantId === variantId);
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
