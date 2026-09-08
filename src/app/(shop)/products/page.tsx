import type { Metadata } from "next";
import ProductListing from "@/components/product/ProductListing";
import { resolveSort } from "@/lib/product-sort";
import { getBrands } from "@/services/brand";
import { getCategoryTree, resolveCategorySlug } from "@/services/category";
import { getPriceBounds, getProducts } from "@/services/product";
import { getStoreSettings } from "@/services/store-settings";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "category",
    path: "/products",
    fallbackTitle: "Products",
    record: { description: "Browse the full catalogue." },
  });
}

const PAGE_SIZE = 12;

export default async function ProductsPage({
  searchParams,
}: PageProps<"/products">) {
  const params = await searchParams;

  const readParam = (key: string) => {
    const value = params[key];
    return typeof value === "string" && value !== "" ? value : undefined;
  };

  /**
   * A price bound from the URL, or null.
   *
   * Rejects negatives and non-numbers rather than forwarding them: the backend
   * would coerce `?minPrice=abc` to `NaN` and compare against it, which matches
   * nothing and reads to the shopper as an empty catalog. A bad param is
   * treated as no filter at all.
   */
  const readPrice = (key: string) => {
    const raw = readParam(key);
    if (raw === undefined) return null;
    const value = Number(raw);
    return Number.isFinite(value) && value >= 0 ? value : null;
  };

  const categorySlug = readParam("category");
  const brandSlug = readParam("brand");
  const searchTerm = readParam("q");
  const page = Number(readParam("page") ?? 1) || 1;

  const minPrice = readPrice("minPrice");
  const maxPrice = readPrice("maxPrice");

  // Sorting is a server query, not a reorder of the fetched page: ordering 12
  // of N products by price shows the cheapest *on this page*, not in the
  // catalog. The nav's "Best Selling" / "New Arrivals" links are this same
  // mechanism with a preset `?sort=`.
  const sort = resolveSort(readParam("sort"));

  // The slider's extremes are a property of the catalog, not of the current
  // query, so they are fetched independently of the filtered listing below —
  // narrowing the range must not narrow the track it can be widened back along.
  const [categories, brands, priceBounds] = await Promise.all([
    getCategoryTree(),
    getBrands(),
    getPriceBounds(),
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
    minPrice: minPrice ?? undefined,
    maxPrice: maxPrice ?? undefined,
    ...sort.query,
  });

  return (
    <ProductListing
      products={products}
      meta={meta}
      categories={categories}
      brands={brands}
      priceBounds={priceBounds}
      selectedCategory={categorySlug ?? null}
      selectedBrand={brandSlug ?? null}
      selectedMinPrice={minPrice}
      selectedMaxPrice={maxPrice}
      searchTerm={searchTerm ?? null}
      sort={sort.value}
      heading={sort.heading ?? null}
    />
  );
}
