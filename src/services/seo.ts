import { apiFetch } from "@/lib/api-client";
import type { SeoContentType } from "@/types/store-settings";

/**
 * How stale the sitemap may get when the backend's revalidation ping never
 * arrives.
 *
 * An hour, where the settings payload uses thirty seconds — the two have
 * different readers. Settings back what a merchant sees the moment they reload
 * to check their own save; this backs a file crawlers fetch on their own
 * schedule, measured in hours or days. Rebuilding a five-table query every
 * thirty seconds to serve a reader who will not look again until tomorrow is
 * cost with no benefit.
 *
 * As everywhere else here, this is the floor of correctness rather than the
 * expected behaviour: a save invalidates the tag and the next request rebuilds.
 */
const SITEMAP_REVALIDATE_SECONDS = 3600;

/**
 * The cache tag the backend invalidates when SEO settings change.
 *
 * Separate from `store-settings` so an unrelated theme edit does not rebuild the
 * sitemap's five-table query. The backend fires BOTH on a settings save, because
 * `seoConfig` travels inside the settings payload as well.
 */
export const SEO_CONFIG_CACHE_TAG = "seo-config";

export interface SitemapEntry {
  contentType: SeoContentType;
  slug: string;
  /** ISO string over the wire; the sitemap route turns it into a Date. */
  updatedAt: string;
}

/**
 * Published, indexable records for the sitemap.
 *
 * Returns an empty list rather than throwing: `sitemap.ts` cannot render an
 * error, and a sitemap that is briefly empty is a far better failure than a
 * build-time exception on a route crawlers poll unattended. The backend already
 * applies the per-type toggles and the global noindex switch, so an empty list
 * here is also the legitimate answer when a merchant has turned indexing off.
 */
export async function getSitemapEntries(): Promise<SitemapEntry[]> {
  try {
    const { data } = await apiFetch<SitemapEntry[]>("/seo/sitemap-entries", {
      revalidate: SITEMAP_REVALIDATE_SECONDS,
      tags: [SEO_CONFIG_CACHE_TAG],
    });

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
