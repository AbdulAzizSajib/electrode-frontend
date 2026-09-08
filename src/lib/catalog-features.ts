import type { CatalogConfig, NavItem } from "@/types/store-settings";

/**
 * Which optional catalog features this shop offers, held the same way the currency format is.
 *
 * THE REASONING LIVES IN `lib/format.ts` — read its doc-comment first; this module inherits it
 * wholesale, including the caveat. The short version, because the three conditions that make module
 * scope right there are all true here too:
 *
 *  - **Both halves of the boundary read it.** `ProductCard`, `Header`, `MobileBottomNav` and
 *    `CompareBar` are client components; the `/wishlist` and `/compare` route files are server
 *    components that must call `notFound()`. A React context cannot serve the server half and an
 *    `await`ed read cannot serve the client half, so a context would solve half the problem and
 *    leave the other half needing a second mechanism.
 *  - **`StoreSetting` is a SINGLETON.** Concurrent server requests share module scope but all want
 *    the same value, so there is no cross-request leak of different data.
 *  - **Threading it explicitly would mean prop-drilling** a deployment-constant through every tree
 *    that renders a product card, including Redux-connected chrome with no props path from the
 *    layout.
 *
 * IF THIS EVER BECOMES MULTI-TENANT, this and `lib/format.ts` are wrong together and should be
 * fixed together.
 */

/**
 * What the storefront offers before the settings have been applied, and if they never are.
 *
 * Everything, deliberately. A settings outage that withdrew the wishlist and comparison would strip
 * working features from a shop, and — unlike a blank announcement bar — nobody would read the
 * absence as an outage. Failing toward "offered" degrades to the storefront as it behaved before
 * these were configurable. Mirrors `FALLBACK_SETTINGS.catalogConfig` in `services/store-settings.ts`
 * and the backend's `DEFAULT_CATALOG_CONFIG`.
 */
const FALLBACK_FEATURES: CatalogConfig = {
  showWishlist: true,
  showCompare: true,
  showQuickView: true,
};

let catalogFeatures: CatalogConfig = FALLBACK_FEATURES;

/**
 * Applied by the root layout on the server, and by `CatalogFeaturesProvider` in the browser.
 *
 * Not a hook and not a context, for the reason above: half the call sites cannot consume either.
 */
export function setCatalogFeatures(features: CatalogConfig) {
  catalogFeatures = features;
}

/**
 * Read at render time by every surface that offers one of these features.
 *
 * Returns the whole block rather than one flag at a time so a caller gating on two of them — the
 * product card gates on all three — makes a single call and cannot read a half-updated pair.
 */
export function getCatalogFeatures(): CatalogConfig {
  return catalogFeatures;
}

/**
 * Whether a link's destination is a feature this shop still offers.
 *
 * Compares the PATH only — a stored href may carry a query or a fragment, and `/wishlist?from=menu`
 * leads to the same withdrawn page `/wishlist` does. A trailing slash is likewise not a different
 * route. Anything not owned by one of these features is always offered.
 */
export function isHrefOffered(href: string, features: CatalogConfig): boolean {
  const path = href.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";

  if (path === "/wishlist") return features.showWishlist;
  if (path === "/compare") return features.showCompare;
  return true;
}

/**
 * Drops merchant-authored navigation entries leading to a feature this shop does not offer.
 *
 * The merchant writes these links by hand, so nothing stops a "Wishlist" entry outliving the
 * wishlist being turned off — and that entry would be a menu item leading to a page that no longer
 * serves. Children are filtered on the same rule; a parent whose children are all dropped keeps its
 * own destination, which is still a real one.
 */
export function filterNavForFeatures(items: NavItem[], features: CatalogConfig): NavItem[] {
  return items
    .filter((item) => isHrefOffered(item.href, features))
    .map((item) =>
      item.children
        ? { ...item, children: item.children.filter((c) => isHrefOffered(c.href, features)) }
        : item,
    );
}
