import { getProducts } from "@/services/product";
import { getCampaignByPlacement } from "@/services/campaign";
import { getTestimonials } from "@/services/testimonials";
import { getRecentBlogPosts } from "@/services/blog";
import type { ProductQuery } from "@/types/product";
import { PRODUCT_ROW_LAYOUTS } from "@/components/home/products/registry";
import type { ProductRowLayout } from "@/types/store-settings";
import DealOfWeek from "@/components/home/DealOfWeek";
import Testimonials from "@/components/home/Testimonials";
import BlogSection from "@/components/home/BlogSection";

/**
 * Homepage sections that fetch for themselves.
 *
 * These were fed by one `Promise.all` in the page, which held the WHOLE page
 * until the slowest section had answered — the hero and the category grid
 * waited on the testimonials. As components, each renders inside its own
 * Suspense boundary: they still start together and run concurrently, but each
 * appears the moment its own data does, with a skeleton in its place until
 * then.
 *
 * The page's two rules carry over unchanged. A disabled section is never
 * rendered, so its fetch never runs. And enabled is not the same as non-empty:
 * each returns null when it has nothing to show, so an unseeded catalog still
 * shortens the page instead of printing headings over empty grids. Every
 * service here resolves rather than rejects, so an outage in one section drops
 * that section, not the page.
 */

/**
 * One merchandising row: whatever `query` asks the API for, under `title`, in
 * whichever arrangement the merchant chose.
 *
 * The fetch happens HERE and not in either layout, so switching between them
 * costs nothing and both render exactly the same products in the same order.
 * The empty guard is here for the same reason — an enabled row with nothing to
 * show renders nothing at all, including its heading, in both layouts.
 *
 * `layout` is resolved by the caller rather than here, because the caller is
 * also what picks the matching skeleton and the two must agree.
 *
 * See server/openspec/changes/add-product-slider-and-card-quantity.
 */
export async function ProductRow({
  title,
  query,
  tabs,
  layout = "GRID",
}: {
  title: string;
  query: ProductQuery;
  tabs?: string[];
  layout?: ProductRowLayout;
}) {
  const { products } = await getProducts(query);
  if (products.length === 0) return null;

  const { Component } = PRODUCT_ROW_LAYOUTS[layout];
  return <Component title={title} products={products} tabs={tabs} />;
}

/**
 * No fallback when the slot is empty: showing "any product with a
 * sellingPrice" under a countdown would put a deadline on products that have
 * none.
 */
export async function DealOfWeekRow() {
  const campaign = await getCampaignByPlacement("DEAL_OF_WEEK");
  if (!campaign) return null;

  return <DealOfWeek campaign={campaign} />;
}

/** Omitted entirely when the merchant has published none. */
export async function TestimonialsRow() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return <Testimonials testimonials={testimonials} />;
}

/** Omitted entirely when the merchant has published none. */
export async function BlogRow() {
  const posts = await getRecentBlogPosts();
  if (posts.length === 0) return null;

  return <BlogSection posts={posts} />;
}
