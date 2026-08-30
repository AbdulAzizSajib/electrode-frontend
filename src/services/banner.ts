import { apiFetch } from "@/lib/api-client";
import type { ApiBanner, Banner, BannerPlacement } from "@/types/banner";

/**
 * Banners are merchandising, not catalog — they change on the order of days and
 * the hero renders on the homepage, so refetching per request is waste. Five
 * minutes bounds how stale the hero can be after a merchant swaps a banner,
 * matching the category tree's window.
 */
const BANNER_REVALIDATE_SECONDS = 300;

/** Ascending by the merchant's assigned display order. */
const bySortOrder = (a: ApiBanner, b: ApiBanner) => a.sortOrder - b.sortOrder;

/**
 * Whether a banner's scheduling window covers now. `startsAt`/`endsAt` are
 * optional — a banner with neither is always live. The endpoint may already
 * filter these out; this is a guard against that changing, and against a
 * cached response outliving a banner's `endsAt`.
 */
function isLive(banner: ApiBanner, now: number): boolean {
  if (banner.startsAt && Date.parse(banner.startsAt) > now) return false;
  if (banner.endsAt && Date.parse(banner.endsAt) < now) return false;
  return true;
}

/**
 * Trims an API banner to what the hero renders.
 *
 * `resolvedLink` is the backend's merge of the banner's own link with its
 * linked product's, so it is preferred over the raw `link`. When a banner
 * carries neither, we fall back to the product page and finally to `#` — a
 * banner without a destination still renders, it just doesn't navigate.
 */
function toBanner(banner: ApiBanner): Banner {
  const productHref = banner.product?.slug
    ? `/products/${banner.product.slug}`
    : null;

  return {
    id: banner.id,
    image: banner.image,
    mobileImage: banner.mobileImage,
    title: banner.title ?? "",
    href: banner.resolvedLink ?? banner.link ?? productHref ?? "#",
    sortOrder: banner.sortOrder,
  };
}

/**
 * Active banners grouped by placement, for the hero's three slots.
 *
 * One request covers all of them: `GET /banners` returns every placement, and
 * splitting this into a call per slot would triple the round trips for the same
 * payload.
 *
 * Never throws — the hero is rendered on the homepage, so an unhandled error
 * would take the page down. On any failure every placement comes back empty and
 * the hero's slots simply render nothing.
 */
export async function getBannersByPlacement(): Promise<
  Partial<Record<BannerPlacement, Banner[]>>
> {
  try {
    const { data } = await apiFetch<ApiBanner[]>("/banners", {
      revalidate: BANNER_REVALIDATE_SECONDS,
    });

    if (!Array.isArray(data)) return {};

    const now = Date.now();
    const grouped: Record<string, Banner[]> = {};

    for (const banner of data
      .filter((b) => b.status === "ACTIVE" && b.image && isLive(b, now))
      .sort(bySortOrder)) {
      (grouped[banner.placement] ??= []).push(toBanner(banner));
    }

    return grouped;
  } catch {
    return {};
  }
}
