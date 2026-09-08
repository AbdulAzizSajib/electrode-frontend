import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/services/seo";
import { getStoreSettings } from "@/services/store-settings";
import type { SeoContentType } from "@/types/store-settings";

/**
 * The generated sitemap, served at `/sitemap.xml`.
 *
 * The site had none until now. Its contents come from `/seo/sitemap-entries`,
 * which applies the per-type toggles and the global noindex switch server-side —
 * the backend owns those settings, and a sitemap is exactly the surface where
 * "the client forgot to check" means publishing URLs a merchant asked to keep
 * out of search.
 *
 * Requires `siteUrl`: a sitemap entry must be an absolute URL, and guessing an
 * origin would point crawlers at the wrong host. Without one this returns empty
 * rather than emitting relative paths no crawler could follow.
 */

/** Mirrors the backend's `pathForSlug`, which builds the same paths for the admin. */
const pathForSlug = (contentType: SeoContentType, slug: string): string => {
  switch (contentType) {
    case "product":
      return `/products/${slug}`;
    // No dedicated category route — the storefront filters the product list.
    // The real URL, rather than a `/category/<slug>` that would 404.
    case "category":
      return `/products?category=${encodeURIComponent(slug)}`;
    case "page":
      return `/${slug}`;
    case "blogPost":
      return `/blogs/${slug}`;
    case "landingPage":
      return `/lp/${slug}`;
  }
};

/**
 * How often each kind of page is worth re-crawling. A hint, not a promise —
 * crawlers weigh it against what they observe.
 */
const CHANGE_FREQUENCY: Record<SeoContentType, "daily" | "weekly" | "monthly"> = {
  product: "daily",
  category: "daily",
  page: "monthly",
  blogPost: "weekly",
  landingPage: "weekly",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getStoreSettings();

  let origin: string;
  try {
    origin = new URL(settings.siteUrl ?? "").origin;
  } catch {
    // No canonical origin configured, or a malformed one. An empty sitemap is
    // the honest answer — better than absolute URLs built on a guessed host.
    return [];
  }

  // The kill switch is applied on the backend too; repeated here so a stale
  // cached entry list cannot outlive a merchant switching indexing off.
  if (settings.seoConfig.robots.globalNoindex) return [];

  const entries = await getSitemapEntries();

  const urls: MetadataRoute.Sitemap = entries.map((entry) => ({
    url: `${origin}${pathForSlug(entry.contentType, entry.slug)}`,
    lastModified: new Date(entry.updatedAt),
    changeFrequency: CHANGE_FREQUENCY[entry.contentType],
  }));

  // The homepage is not a record in any of the five tables, so nothing upstream
  // can produce it — and it is the one URL a sitemap should never omit.
  return [
    {
      url: origin,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    ...urls,
  ];
}
