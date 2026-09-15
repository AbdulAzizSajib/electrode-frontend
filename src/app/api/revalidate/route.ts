import { revalidateTag } from "next/cache";
import { STORE_SETTINGS_CACHE_TAG } from "@/services/store-settings";
import { BLOG_POSTS_CACHE_TAG } from "@/services/blog";
import { TESTIMONIALS_CACHE_TAG } from "@/services/testimonials";
import { LANDING_PAGES_CACHE_TAG } from "@/services/landing-page";
import { SEO_CONFIG_CACHE_TAG } from "@/services/seo";
import { CAMPAIGNS_CACHE_TAG } from "@/services/campaign";
import { BANNERS_CACHE_TAG } from "@/services/banner";
import { BRANDS_CACHE_TAG } from "@/services/brand";
import { CATEGORIES_CACHE_TAG } from "@/services/category";
import { PAGES_CACHE_TAG } from "@/services/page";
import { PRODUCTS_CACHE_TAG } from "@/services/product";
import { REVIEWS_CACHE_TAG } from "@/services/review";

/**
 * Drops a cached storefront tag on request, so a merchant's save shows up on
 * the next page load instead of whenever the revalidate window happens to
 * elapse.
 *
 * Called by the BACKEND, never by the admin panel. The admin is a browser
 * bundle, so a shared secret shipped to it would be readable by anyone who
 * opens devtools. The backend already knows the moment settings change and can
 * hold the secret in its environment, which is the only place it stays secret.
 *
 * Unauthenticated callers get a 401 and no hint about which tags exist. The
 * endpoint is deliberately dull — it invalidates a cache entry and nothing
 * else, so the worst a leaked secret buys is making the site re-fetch its own
 * settings.
 */

/**
 * Only tags this route is willing to drop. An allow-list, not free-form input.
 *
 * Covers EVERY merchant-editable storefront resource, not a hand-picked few. It
 * was the latter for a while, and the seven resources left out of it each
 * behaved as though saving them did nothing: the write committed, and the
 * storefront kept serving its cached response until that resource's revalidate
 * window happened to elapse — five minutes for most of them.
 *
 * Deliberately an EXACT-MATCH set, never a prefix test. Membership in a fixed
 * list is this endpoint's entire security surface; a scheme like
 * `product-<slug>` would need unbounded tag names and would weaken the check to
 * "starts with". One tag per resource is the trade that keeps this exact — see
 * `server/openspec/changes/add-storefront-cache-tags/design.md` Decision 1.
 */
const ALLOWED_TAGS = new Set<string>([
  STORE_SETTINGS_CACHE_TAG,
  // The two merchant-managed homepage sections. Both are invalidated by the
  // backend on every create, edit and delete, so publishing a post or a
  // testimonial shows up on the next request rather than up to five minutes
  // later.
  BLOG_POSTS_CACHE_TAG,
  TESTIMONIALS_CACHE_TAG,
  /*
   * Campaign landing pages. The backend pings this AND `store-settings` on
   * every landing page write, because publishing or unpublishing a page changes
   * what the settings payload says about the storefront root — not just what
   * `/lp/<slug>` renders.
   */
  LANDING_PAGES_CACHE_TAG,
  /*
   * SEO settings, which back the sitemap and robots.txt. A tag of its own rather
   * than folding into `store-settings`, because the two cost different amounts
   * to rebuild — this one is a five-table query, and a theme edit should not pay
   * for it. The backend fires both on a settings save.
   */
  SEO_CONFIG_CACHE_TAG,
  /*
   * The catalog and merchandising resources. Each is dropped by its own module
   * on create, update and delete — including the paths that are not named after
   * them: a bulk brand import, a product's category assignment, a review's
   * moderation status.
   *
   * `products` is additionally fired by the campaign and review services,
   * because both write values the product payload carries (`campaignPrice`, the
   * aggregate rating). Those two are stated at their call sites rather than
   * inferred here — this route drops what it is told to drop and knows nothing
   * about which resource embeds which.
   */
  CAMPAIGNS_CACHE_TAG,
  BANNERS_CACHE_TAG,
  BRANDS_CACHE_TAG,
  CATEGORIES_CACHE_TAG,
  PAGES_CACHE_TAG,
  PRODUCTS_CACHE_TAG,
  REVIEWS_CACHE_TAG,
]);

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;

  /*
   * Unset means the feature is off, not open. Returning 503 rather than
   * quietly succeeding is what keeps a misconfigured deployment visible — a
   * 200 here would leave the backend believing it had revalidated.
   */
  if (!secret) {
    return Response.json(
      { revalidated: false, message: "Revalidation is not configured." },
      { status: 503 },
    );
  }

  if (request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ revalidated: false }, { status: 401 });
  }

  let tag: unknown;
  try {
    ({ tag } = await request.json());
  } catch {
    return Response.json({ revalidated: false, message: "Invalid body." }, { status: 400 });
  }

  if (typeof tag !== "string" || !ALLOWED_TAGS.has(tag)) {
    return Response.json({ revalidated: false, message: "Unknown tag." }, { status: 400 });
  }

  /*
   * `{ expire: 0 }` rather than a named cacheLife profile: the point is to
   * expire the entry now, so the very next request re-fetches. `updateTag`
   * would be the read-your-own-writes equivalent, but it is only callable from
   * a Server Action, and the caller here is the backend over HTTP.
   */
  revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: true, tag });
}
