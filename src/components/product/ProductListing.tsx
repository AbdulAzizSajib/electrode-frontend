"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters, { type FilterOption } from "@/components/product/ProductFilters";
import type { CategoryNode } from "@/types/category";
import type { PaginationMeta, Product } from "@/types/product";

type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface Props {
  products: Product[];
  meta: PaginationMeta;
  categories: CategoryNode[];
  brands: FilterOption[];
  selectedCategory: string | null;
  selectedBrand: string | null;
  searchTerm: string | null;
}

export default function ProductListing({
  products,
  meta,
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  searchTerm,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sort, setSort] = useState<SortKey>("featured");

  /**
   * Filtering and pagination live in the URL so the server does the querying —
   * results come from the catalog rather than a partial local copy, and a
   * filtered view can be shared or bookmarked.
   */
  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    // Any filter change invalidates the current page offset.
    if (key !== "page") next.delete("page");
    router.push(`/products${next.toString() ? `?${next}` : ""}`);
  }

  // Sorting is presentational only — it reorders the current page rather than
  // re-querying, since the API exposes no sort parameter.
  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.price - b.price);
      case "price-desc":
        return list.sort((a, b) => b.price - a.price);
      case "name-asc":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return list.sort((a, b) => b.name.localeCompare(a.name));
      default:
        return list;
    }
  }, [products, sort]);

  const hasFilters = Boolean(selectedCategory || selectedBrand || searchTerm);

  return (
    <div className="container-px mx-auto max-w-346 py-8">
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4 text-sm text-gray-500">
        <span>Home / Shop</span>
        {searchTerm && <span>Results for &ldquo;{searchTerm}&rdquo;</span>}
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <ProductFilters
          categories={categories}
          brands={brands}
          selectedCategory={selectedCategory}
          selectedBrand={selectedBrand}
          onCategoryChange={(slug) => setParam("category", slug)}
          onBrandChange={(slug) => setParam("brand", slug)}
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
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
              >
                <option value="featured">Featured</option>
                <option value="name-asc">Alphabetically, A-Z</option>
                <option value="name-desc">Alphabetically, Z-A</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
              <LayoutGrid size={20} className="text-brand" />
              <List size={20} className="text-gray-300" />
            </div>
          </div>

          {sorted.length === 0 ? (
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
              {sorted.map((product) => (
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
