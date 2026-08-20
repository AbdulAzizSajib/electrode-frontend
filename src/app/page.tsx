import { products } from "@/data/products";
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

export default function Home() {
  const byCategory = products.slice(0, 6);
  const featured = products.filter((p) => p.featured).slice(0, 6).concat(products).slice(0, 6);
  const latest = [...products].reverse().slice(0, 6);
  const dealProducts = products.filter((p) => p.compareAtPrice).slice(0, 6);

  return (
    <>
      <Hero />
      <BrandBar />
      <ProductSection title="Product By Categories" products={byCategory} tabs={categoryTabs} />
      <MidBanners />
      <ProductSection title="Featured Products" products={featured} />
      <PerksBar />
      <DealOfWeek products={dealProducts} />
      <CategoryGrid />
      <ProductSection title="Latest Products" products={latest} />
      <Testimonials />
      <BlogSection />
    </>
  );
}
