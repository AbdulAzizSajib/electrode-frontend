import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPageView from "@/components/landing/LandingPageView";
import { buildAuthCookieHeader } from "@/lib/session";
import { getLandingPagePreview } from "@/services/landing-page";
import { getStoreSettings } from "@/services/store-settings";

/*
 * A campaign landing page as the MERCHANT sees it, at any status.
 *
 * Exists because the public route at `/offer/<slug>` returns the same 404 for a
 * DRAFT as for a slug that never existed — deliberately, so unpublished
 * campaigns cannot be probed for. That makes the public URL useless for the one
 * thing a merchant most needs before spending money on ads: looking at the page
 * they just authored. Without this route the admin's "Preview" link took them
 * to a not-found page and the feature looked broken.
 *
 * A SEPARATE ROUTE rather than a `?preview=1` flag on the public page, matching
 * the backend's own split (`GET /landing-pages/preview/:slug` beside the public
 * read). A flag is one forgotten check away from serving every draft to every
 * visitor; a distinct path cannot be reached by accident.
 *
 * AUTHORISATION IS THE BACKEND'S, not this route's. The merchant's cookies are
 * forwarded and the endpoint is owner/admin-gated; a request without a session
 * gets a 401, which the service maps to null, which renders as a 404 here. So
 * an anonymous visitor who guesses this URL is told the page does not exist
 * rather than that it exists and they may not see it — the same answer the
 * public route gives, and never a partial render.
 */

/*
 * Never cached, at the route level as well as in the service.
 *
 * A preview exists to show the very latest save, so a merchant who edits,
 * saves, and reloads must see their edit and not a cached copy of the version
 * before it. This also keeps one merchant's authenticated render from ever
 * being served to anyone else.
 */
export const dynamic = "force-dynamic";

/*
 * NOINDEX, and this is not optional.
 *
 * A draft campaign indexed by a crawler is a page the merchant never published
 * appearing in search results — and once the real page goes live at
 * `/offer/<slug>`, the preview URL competes with it for the same content. The
 * public route's metadata is resolved from the store's SEO settings; this one
 * is pinned closed regardless of them.
 */
export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

export default async function LandingPagePreviewRoute({
  params,
}: PageProps<"/offer/[slug]/preview">) {
  const { slug } = await params;

  const cookie = await buildAuthCookieHeader();

  // Concurrent, like the public route: neither read depends on the other.
  const [page, settings] = await Promise.all([
    getLandingPagePreview(slug, cookie),
    getStoreSettings(),
  ]);

  /*
   * Covers all three cases with one answer: no such slug, no session, and a
   * session without the owner/admin role. The service maps 401 and 403 to null
   * alongside 404 precisely so they are indistinguishable from here.
   */
  if (!page) notFound();

  /*
   * The same component the public route renders, deliberately. A preview that
   * went through a different renderer would be a preview of something other
   * than what a shopper will see, which is worse than no preview at all.
   */
  return (
    <LandingPageView
      page={page}
      currency={settings.currency}
      brand={settings}
      shopPixel={settings.facebookPixel}
      /*
       * A preview is not traffic. Without this the merchant's every look at
       * their own draft is recorded as a campaign visit, inflating the very
       * numbers they are about to judge the campaign by — and most of those
       * looks happen while they are still iterating, before the ad has run.
       */
      trackingDisabled
    />
  );
}
