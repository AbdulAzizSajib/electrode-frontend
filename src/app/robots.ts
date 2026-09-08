import type { MetadataRoute } from "next";
import { getStoreSettings } from "@/services/store-settings";
import type { SeoRouteGroup } from "@/types/store-settings";

/**
 * The generated `robots.txt`. The site had none until now.
 *
 * Built from the merchant's per-route-group checklist rather than from
 * free-form path patterns: a closed set can be rendered as something a merchant
 * understands and validated exhaustively, where one typo'd glob silently
 * deindexes a catalog. `customRules` remains the escape hatch for the rest.
 */

/**
 * The URL prefixes each route group covers.
 *
 * Only the groups that map to a real path prefix appear here. `home`, `product`,
 * `category` and `page` are deliberately absent: they live at the site root or
 * under `/products`, so a Disallow for them would be a Disallow for the whole
 * catalogue. Those groups are enforced per-page through the robots meta tag,
 * which is the precise instrument; robots.txt is the blunt one.
 */
const GROUP_PREFIXES: Partial<Record<SeoRouteGroup, string[]>> = {
  account: ["/account"],
  cart: ["/cart"],
  checkout: ["/checkout"],
  wishlist: ["/wishlist"],
  compare: ["/compare"],
  search: ["/products?"],
  blog: ["/blogs"],
  landingPage: ["/lp"],
};

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getStoreSettings();
  const { robots: policy } = settings.seoConfig;

  let origin: string | undefined;
  try {
    origin = settings.siteUrl ? new URL(settings.siteUrl).origin : undefined;
  } catch {
    origin = undefined;
  }

  /*
   * The staging kill switch: disallow everything, and advertise no sitemap.
   * Returned before anything else so no per-group setting can soften it.
   */
  if (policy.globalNoindex) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  const disallow = Object.entries(GROUP_PREFIXES)
    .filter(([group]) => !policy.groups[group as SeoRouteGroup]?.index)
    .flatMap(([, prefixes]) => prefixes);

  /*
   * `customRules` cannot be expressed through MetadataRoute.Robots — it is free
   * text, and the type models only userAgent/allow/disallow/sitemap. Each
   * non-empty line is taken as an extra Disallow path, which is what a merchant
   * reaches for this field to write. Anything more exotic (Crawl-delay, a
   * second user-agent block) would need a hand-written robots.txt, and silently
   * dropping it here would be worse than not offering the field.
   */
  const custom = policy.customRules
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((line) => line.replace(/^Disallow:\s*/i, ""));

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        ...(disallow.length + custom.length > 0
          ? { disallow: [...disallow, ...custom] }
          : {}),
      },
    ],
    // Only when a canonical origin is configured: a sitemap reference must be
    // absolute, and one built on a guessed host points crawlers elsewhere.
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
