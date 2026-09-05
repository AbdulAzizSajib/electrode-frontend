import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LandingPageView from "@/components/landing/LandingPageView";
import { getLandingPageBySlug } from "@/services/landing-page";
import { getStoreSettings } from "@/services/store-settings";
import { excerptFromHtml } from "@/lib/landing-page-content";

/*
 * A single-product campaign landing page.
 *
 * Reachable at `/lp/<slug>` in BOTH site modes — being the "active" landing
 * page decides only what the storefront ROOT serves, never whether this URL
 * works. That matters for ads: a campaign keeps one stable address whether or
 * not the merchant has flipped the toggle.
 *
 * No `generateStaticParams`: pre-rendering would mean a rebuild before a new
 * campaign could go live, which defeats the point of authoring one in the admin
 * panel while an ad is already running. The service's revalidate window and the
 * backend's cache-tag ping keep the cost near zero instead.
 */

export async function generateMetadata({
  params,
}: PageProps<"/lp/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const page = await getLandingPageBySlug(slug);

  if (!page) return { title: "Page not found" };

  /*
   * Falls back to the headline and to an excerpt of the page's own body, so a
   * published campaign never has an empty title or a missing description — the
   * two things an ad platform's link preview reads.
   */
  const title = page.metaTitle?.trim() || page.headline;
  const description =
    page.metaDescription?.trim() ||
    page.subheadline?.trim() ||
    excerptFromHtml(page.bodyHtml);

  const image =
    page.ogImageUrl ||
    page.media?.find((item) => item.type === "IMAGE")?.url ||
    page.productSnapshot.images[0]?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function LandingPageRoute({ params }: PageProps<"/lp/[slug]">) {
  const { slug } = await params;

  // Concurrent: neither depends on the other, and this page is the one place
  // where a serial round trip is most visible — it is what an ad click lands on.
  const [page, settings] = await Promise.all([
    getLandingPageBySlug(slug),
    getStoreSettings(),
  ]);

  /*
   * Unknown slug and DRAFT page land here identically — the backend returns the
   * same 404 for both, so a visitor cannot tell an unpublished campaign from
   * one that never existed and slugs cannot be probed for pages that are not
   * live yet.
   */
  if (!page) notFound();

  return <LandingPageView page={page} currency={settings.currency} />;
}
