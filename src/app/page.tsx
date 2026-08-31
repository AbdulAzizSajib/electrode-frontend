import { getProducts } from "@/services/product";
import { getCampaignByPlacement } from "@/services/campaign";
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
  const [bestSelling, featured, latest, dealCampaign] = await Promise.all([
    getProducts({ limit: SECTION_SIZE, sortBy: "totalSold", sortOrder: "desc" }),
    getProducts({ limit: SECTION_SIZE, isFeatured: true }),
    getProducts({ limit: SECTION_SIZE, sortBy: "createdAt", sortOrder: "desc" }),
    getCampaignByPlacement("DEAL_OF_WEEK"),
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
      <Testimonials />
      <BlogSection />
    </>
  );
}
