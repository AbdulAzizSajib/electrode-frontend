import type { ProductImage } from "@/types/product";

/**
 * Which images to show for a selected variant, and which variant a chosen image
 * depicts. Pure and shared, because the product page and the in-listing quick
 * view must answer both questions identically.
 */

/**
 * The images visible for `selectedVariantId`, as an ordered fallback:
 *
 *   1. the selected variant's images, plus the shared ones
 *   2. the shared images alone
 *   3. every image
 *
 * The first non-empty rung wins. Rungs 2 and 3 exist so the gallery is never
 * empty because of how an admin assigned photos — a variant with no photos of
 * its own still shows the packaging shots, and a variant on a product where
 * every photo belongs to some *other* variant still shows something.
 *
 * Order within a rung is the order given, which is `pickImages`' primary-then-
 * sortOrder sequence. With no selection, or on a product whose images carry no
 * variant at all, rung 1 already yields the full list unchanged — which is what
 * keeps products predating image-to-variant assignment behaving exactly as
 * they did.
 */
export function visibleImages(
  images: ProductImage[],
  selectedVariantId: string | null,
): ProductImage[] {
  if (images.length === 0) return images;

  const shared = images.filter((img) => img.variantId === null);

  if (selectedVariantId !== null) {
    const forSelection = images.filter(
      (img) => img.variantId === null || img.variantId === selectedVariantId,
    );
    if (forSelection.length > 0) return forSelection;
  } else if (shared.length > 0) {
    // No selection yet: shared images describe the product as a whole.
    // Falls through to the full set when every image belongs to a variant.
    return shared;
  }

  if (shared.length > 0) return shared;

  return images;
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
