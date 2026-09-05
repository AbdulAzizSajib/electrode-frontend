import { redirect } from "next/navigation";
import { getProducts } from "@/services/product";
import { getCampaignByPlacement } from "@/services/campaign";
import { getStoreSettings } from "@/services/store-settings";
import { getRecentBlogPosts } from "@/services/blog";
import { getTestimonials } from "@/services/testimonials";
import { categoryTabs } from "@/data/content";
import Hero from "@/components/home/Hero";
import BrandBar from "@/components/home/BrandBar";
import ProductSection from "@/components/home/ProductSection";
import MidBanners from "@/components/home/MidBanners";
import PerksBar from "@/components/home/PerksBar";
import DealOfWeek from "@/components/home/DealOfWeek";
import CategoryGrid from "@/components/home/CategoryGrid";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";

/** Products per merchandising row, matching the five-across deal layout. */
const SECTION_SIZE = 6;

export default async function Home() {
  /*
   * The site-mode toggle, checked before anything else is fetched.
   *
   * When a merchant is running a campaign, `/` serves that campaign — and
   * serving it means redirecting to its own `/lp/<slug>` URL rather than
   * rendering it here. Three reasons:
   *
   *  - the landing page needs a shell with NO header, footer or cart drawer,
   *    and this route sits under `(shop)`'s layout, which renders all of them.
   *    Rendering the campaign here would wrap it in exactly what it must not
   *    have;
   *  - one campaign, one canonical URL, in both modes — which is what an ad
   *    platform and an analytics tool both want anyway;
   *  - the alternative, a middleware rewrite, would have to learn the active
   *    slug on every request to every route, to save one hop on one route.
   *
   * `getStoreSettings` is a tagged fetch the layout above already made, so this
   * is a cache read, not a second request. The backend pings that tag on every
   * site-mode and landing-page write, so the redirect appears and disappears on
   * the existing revalidation path — no redeploy, no waiting out a window.
   *
   * Only reached when the settings payload reports BOTH the mode and a live
   * page; the service degrades a half-configured pair to WEBSITE, so there is
   * no way to end up redirecting to `/lp/undefined`.
   *
   * See add-single-product-landing-page design.md, Decision 6.
   */
  const settings = await getStoreSettings();

  if (settings.siteMode === "LANDING_PAGE" && settings.activeLandingPage) {
    redirect(`/lp/${settings.activeLandingPage.slug}`);
  }

  // One query per section, each asking the API for what the section's title
  // claims. This replaced a single 24-product fetch sliced four ways in memory,
  // where "Best Selling" was the first six of an arbitrary page and "New
  // Arrivals" was that same page reversed — which is not the newest products,
  // since the newest may not be in the fetched page at all.
  //
  // Four concurrent requests cost one round trip, and each returns ~6 products
  // rather than 24, so the total payload is smaller than the single fetch was.
  // Every one of these resolves rather than rejects on failure, so an outage in
  // one section cannot fail the page.
  const [bestSelling, featured, latest, dealCampaign, testimonials, blogPosts] = await Promise.all([
    getProducts({ limit: SECTION_SIZE, sortBy: "totalSold", sortOrder: "desc" }),
    getProducts({ limit: SECTION_SIZE, isFeatured: true }),
    getProducts({ limit: SECTION_SIZE, sortBy: "createdAt", sortOrder: "desc" }),
    getCampaignByPlacement("DEAL_OF_WEEK"),
    // Both resolve rather than reject on failure, like the product queries
    // above — an outage in one section shortens the page, it does not fail it.
    getTestimonials(),
    getRecentBlogPosts(),
  ]);

  return (
    <>
      <Hero />
      <BrandBar />
      <CategoryGrid title="Featured Categories" />
      {/* Each section is omitted when its query came back empty, so an
          unseeded catalog degrades to a shorter page rather than to empty
          grids under populated headings. */}
      {bestSelling.products.length > 0 ? (
        <ProductSection
          title="Best Selling Products"
          products={bestSelling.products}
          tabs={categoryTabs}
        />
      ) : null}
      <MidBanners />
      {featured.products.length > 0 ? (
        <ProductSection title="Featured Products" products={featured.products} />
      ) : null}
      <PerksBar />
      {/* No fallback when the slot is empty: showing "any product with a
          compareAtPrice" under a countdown would put a deadline on products
          that have none. */}
      {dealCampaign ? <DealOfWeek campaign={dealCampaign} /> : null}
      {latest.products.length > 0 ? (
        <ProductSection title="New Arrivals" products={latest.products} />
      ) : null}
      {/* Both sections are omitted entirely when the merchant has published
          nothing, matching how the merchandising rows above already handle an
          unseeded catalog. The components guard on this too — a heading over an
          empty grid is worse than a shorter page. */}
      {testimonials.length > 0 ? <Testimonials testimonials={testimonials} /> : null}
      {blogPosts.length > 0 ? <BlogSection posts={blogPosts} /> : null}
    </>
  );
}
