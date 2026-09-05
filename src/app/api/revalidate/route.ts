import { revalidateTag } from "next/cache";
import { STORE_SETTINGS_CACHE_TAG } from "@/services/store-settings";
import { BLOG_POSTS_CACHE_TAG } from "@/services/blog";
import { TESTIMONIALS_CACHE_TAG } from "@/services/testimonials";
import { LANDING_PAGES_CACHE_TAG } from "@/services/landing-page";

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

/** Only tags this route is willing to drop. An allow-list, not free-form input. */
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
