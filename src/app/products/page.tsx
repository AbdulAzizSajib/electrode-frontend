import type { Metadata } from "next";
import ProductListing from "@/components/product/ProductListing";
import { getBrands } from "@/services/brand";
import { getCategoryTree, resolveCategorySlug } from "@/services/category";
import { getProducts } from "@/services/product";

export const metadata: Metadata = {
  title: "Products – Electrode",
};

const PAGE_SIZE = 12;

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const params = await searchParams;

  const readParam = (key: string) => {
    const value = params[key];
    return typeof value === "string" && value !== "" ? value : undefined;
  };

  const categorySlug = readParam("category");
  const brandSlug = readParam("brand");
  const searchTerm = readParam("q");
  const page = Number(readParam("page") ?? 1) || 1;

  const [categories, brands] = await Promise.all([
    getCategoryTree(),
    getBrands(),
  ]);

  // Links carry slugs; the products API filters on ids.
  const [categoryId, brandId] = await Promise.all([
    resolveCategorySlug(categorySlug),
    Promise.resolve(brands.find((b) => b.slug === brandSlug)?.id ?? null),
  ]);

  const { products, meta } = await getProducts({
    page,
    limit: PAGE_SIZE,
    searchTerm,
    category: categoryId ?? undefined,
    brand: brandId ?? undefined,
  });

  return (
    <ProductListing
      products={products}
      meta={meta}
      categories={categories}
      brands={brands}
      selectedCategory={categorySlug ?? null}
      selectedBrand={brandSlug ?? null}
      searchTerm={searchTerm ?? null}
    />
  );
}
