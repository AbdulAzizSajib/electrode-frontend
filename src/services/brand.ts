import { cache } from "react";
import { apiFetch } from "@/lib/api-client";
import type { ApiBrand } from "@/types/product";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  /** The merchant's uploaded logo, or null when none has been added. */
  logo: string | null;
}

const BRAND_REVALIDATE_SECONDS = 300;

/** The cache tag the backend invalidates after a brand is created, edited or deleted. */
export const BRANDS_CACHE_TAG = "brands";

/**
 * Active brands — for the listing's brand filter and the homepage brand bar.
 * Returns an empty list on failure, so the filter panel omits its brand
 * section and the brand bar renders nothing.
 */
async function fetchBrands(): Promise<Brand[]> {
  try {
    const { data } = await apiFetch<ApiBrand[]>("/brands?page=1&limit=100", {
      revalidate: BRAND_REVALIDATE_SECONDS,
      tags: [BRANDS_CACHE_TAG],
    });

    if (!Array.isArray(data)) return [];

    return data
      .filter((brand) => brand.status)
      .map(({ id, name, slug, logo }) => ({ id, name, slug, logo }));
  } catch {
    return [];
  }
}

/**
 * Shared per request, so the homepage can start the read before `BrandBar`
 * renders and the component picks up that same in-flight request. See
 * `getStoreSettings` for why fetch memoization alone does not merge calls.
 */
export const getBrands = cache(fetchBrands);
