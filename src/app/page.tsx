import { getProducts } from "@/services/product";
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

export default async function Home() {
  // One fetch feeds every section — the catalog is small and the sections are
  // different slices of it, so re-querying per section would be wasteful.
  const { products } = await getProducts({ limit: 24 });

  const byCategory = products.slice(0, 6);
  const featuredFirst = [...products].sort(
    (a, b) => Number(b.isFeatured) - Number(a.isFeatured),
  );
  const featured = featuredFirst.slice(0, 6);
  const latest = [...products].reverse().slice(0, 6);
  const dealProducts = products.filter((p) => p.compareAtPrice).slice(0, 6);

  return (
    <>
      <Hero />
      <BrandBar />
      <CategoryGrid title="Featured Categories" />
      <ProductSection title="Product By Categories" products={byCategory} tabs={categoryTabs} />
      <MidBanners />
      <ProductSection title="Featured Products" products={featured} />
      <PerksBar />
      <DealOfWeek products={dealProducts} />
      <ProductSection title="Latest Products" products={latest} />
      <Testimonials />
      <BlogSection />
    </>
  );
}
