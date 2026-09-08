"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters, { type FilterOption } from "@/components/product/ProductFilters";
import { DEFAULT_SORT, SORT_OPTIONS, type SortKey } from "@/lib/product-sort";
import type { CategoryNode } from "@/types/category";
import type { PaginationMeta, Product } from "@/types/product";

interface Props {
  products: Product[];
  meta: PaginationMeta;
  categories: CategoryNode[];
  brands: FilterOption[];
  /** Cheapest and dearest product in the catalog — the price slider's extremes. */
  priceBounds: { min: number; max: number };
  selectedCategory: string | null;
  selectedBrand: string | null;
  selectedMinPrice: number | null;
  selectedMaxPrice: number | null;
  searchTerm: string | null;
  sort: SortKey;
  /** Set when the sort names the page, e.g. arriving from the "Best Selling" nav link. */
  heading: string | null;
}

export default function ProductListing({
  products,
  meta,
  categories,
  brands,
  priceBounds,
  selectedCategory,
  selectedBrand,
  selectedMinPrice,
  selectedMaxPrice,
  searchTerm,
  sort,
  heading,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * Filtering and pagination live in the URL so the server does the querying —
   * results come from the catalog rather than a partial local copy, and a
   * filtered view can be shared or bookmarked.
   */
  /**
   * Writes several params in ONE navigation. The price range sets two at once,
   * and two `setParam` calls would each build their URL from the same stale
   * `searchParams` — the second would land without the first's change.
   */
  function setParams(changes: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }

    // Any filter change invalidates the current page offset.
    if (!("page" in changes)) next.delete("page");

    router.push(`/products${next.toString() ? `?${next}` : ""}`);
  }

  function setParam(key: string, value: string | null) {
    setParams({ [key]: value });
  }

  // Sorting goes through the URL like every other filter, so the server orders
  // the whole catalog. It used to reorder the fetched page in memory, which
  // made "Price, low to high" mean "cheapest of these 12" rather than of the
  // catalog — and put the true cheapest product on some other page entirely.
  const hasFilters = Boolean(
    selectedCategory ||
      selectedBrand ||
      searchTerm ||
      selectedMinPrice !== null ||
      selectedMaxPrice !== null,
  );

  return (
    <div className="container-px site-container py-8">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 text-sm text-gray-500">
        <span>Home / {heading ?? "Shop"}</span>
        {searchTerm && <span>Results for &ldquo;{searchTerm}&rdquo;</span>}
      </div>

      {/* Named only when the sort names the page — arriving from the "Best
          Selling" nav link should not land on a page headed "Products". */}
      {heading && !hasFilters ? (
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{heading}</h1>
      ) : null}

      <div className="flex flex-col gap-8 lg:flex-row">
        <ProductFilters
          categories={categories}
          brands={brands}
          priceBounds={priceBounds}
          selectedCategory={selectedCategory}
          selectedBrand={selectedBrand}
          selectedMinPrice={selectedMinPrice}
          selectedMaxPrice={selectedMaxPrice}
          onCategoryChange={(slug) => setParam("category", slug)}
          onBrandChange={(slug) => setParam("brand", slug)}
          onPriceChange={(range) =>
            setParams({
              minPrice: range ? String(range.min) : null,
              maxPrice: range ? String(range.max) : null,
            })
          }
          // Keeps `?q=` — clearing the refinements a shopper chose should not
          // also discard the search they arrived with.
          onClearAll={() =>
            setParams({
              category: null,
              brand: null,
              minPrice: null,
              maxPrice: null,
            })
          }
        />

        <div className="flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">{meta.total} Products</p>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-500" htmlFor="sort">
                Sort by:
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) =>
                  // The default clears the param rather than pinning
                  // ?sort=featured onto every shared URL.
                  setParam("sort", e.target.value === DEFAULT_SORT ? null : e.target.value)
                }
                className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <LayoutGrid size={20} className="text-brand" />
              <List size={20} className="text-gray-300" />
            </div>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-gray-500">
                {hasFilters
                  ? "No products match your filters."
                  : "No products are available right now."}
              </p>
              {hasFilters && (
                <button
                  onClick={() => router.push("/products")}
                  className="mt-3 text-sm font-semibold text-brand hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {meta.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setParam("page", String(meta.page - 1))}
                disabled={meta.page <= 1}
                className="rounded border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:text-gray-300"
              >
                Previous
              </button>
              <span className="px-2 text-sm text-gray-500">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                onClick={() => setParam("page", String(meta.page + 1))}
                disabled={meta.page >= meta.totalPages}
                className="rounded border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:text-gray-300"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
