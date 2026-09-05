import { apiFetch, ApiError } from "@/lib/api-client";
import type { LandingPage } from "@/types/landing-page";

/**
 * How stale a landing page may get in the WORST case — when the backend's
 * revalidation ping never arrives.
 *
 * Matched to the settings payload's 30 seconds rather than the catalogue's five
 * minutes, and for the same reason: a merchant edits their campaign and
 * immediately reloads to check it. Half a minute of "did my save work?" is
 * indistinguishable from a broken feature.
 *
 * This is the floor of correctness, not the expected behaviour — the backend
 * invalidates the tag on every write, so a save takes effect on the next
 * request. The window only governs a campaign nobody is editing.
 */
const LANDING_PAGE_REVALIDATE_SECONDS = 30;

/**
 * The cache tag the backend invalidates after any landing page write.
 *
 * Note the backend pings `store-settings` alongside this one: publishing or
 * unpublishing a page changes what the SETTINGS payload says about the
 * storefront root, not just what `/lp/<slug>` renders.
 */
export const LANDING_PAGES_CACHE_TAG = "landing-pages";

/**
 * A published landing page, or null when there is none at that slug.
 *
 * Null covers both "no such page" and "that page is a draft" — the backend
 * deliberately returns the same 404 for each, so an unpublished campaign cannot
 * be found by probing slugs, and this function has no way to tell the two apart
 * either.
 *
 * Any other failure is rethrown rather than swallowed. Unlike the store
 * settings — whose fallback keeps the chrome on every page of the site — there
 * is no useful fallback for a landing page: rendering an empty campaign would
 * take ad money and show nothing. An error surfaces as the error page, which is
 * the honest outcome.
 */
export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  try {
    const { data } = await apiFetch<LandingPage>(
      `/landing-pages/by-slug/${encodeURIComponent(slug)}`,
      {
        revalidate: LANDING_PAGE_REVALIDATE_SECONDS,
        tags: [LANDING_PAGES_CACHE_TAG],
      },
    );

    return data ?? null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * The same page for a merchant previewing a draft, read with their session.
 *
 * A separate endpoint rather than a flag on the public read, so the authorised
 * path and the anonymous one cannot be confused for each other. Never cached:
 * a preview exists to show the very latest save.
 */
export async function getLandingPagePreview(
  slug: string,
  cookie: string | null,
): Promise<LandingPage | null> {
  try {
    const { data } = await apiFetch<LandingPage>(
      `/landing-pages/preview/${encodeURIComponent(slug)}`,
      { cookie, cache: "no-store" },
    );

    return data ?? null;
  } catch {
    // Including 401 and 403: someone without a session asking for a preview is
    // told the page does not exist, not that it exists and they may not see it.
    return null;
  }
}
