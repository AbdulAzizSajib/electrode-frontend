import { apiFetch } from "@/lib/api-client";
import type { ApiBrand } from "@/types/product";

export interface Brand {
  id: string;
  name: string;
  slug: string;
}

const BRAND_REVALIDATE_SECONDS = 300;

/** The cache tag the backend invalidates after a brand is created, edited or deleted. */
export const BRANDS_CACHE_TAG = "brands";

/**
 * Active brands, for the listing's brand filter. Returns an empty list on
 * failure so the filter panel simply omits the brand section.
 */
export async function getBrands(): Promise<Brand[]> {
  try {
    const { data } = await apiFetch<ApiBrand[]>("/brands?page=1&limit=100", {
      revalidate: BRAND_REVALIDATE_SECONDS,
      tags: [BRANDS_CACHE_TAG],
    });

    if (!Array.isArray(data)) return [];

    return data
      .filter((brand) => brand.status)
      .map(({ id, name, slug }) => ({ id, name, slug }));
  } catch {
    return [];
  }
}
