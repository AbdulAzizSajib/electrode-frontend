"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters, { type FilterOption } from "@/components/product/ProductFilters";
import ProductFiltersDrawer from "@/components/product/ProductFiltersDrawer";
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

  // Below `lg` the sidebar is out of the page and reached through the toolbar's
  // Filters button instead. `useCallback` because the drawer's effects — the
  // Escape key, the focus trap, the breakpoint watch — all depend on it.
  const [filtersOpen, setFiltersOpen] = useState(false);
  const closeFilters = useCallback(() => setFiltersOpen(false), []);

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

  /*
   * Counts refinements for the mobile Filters button, which is the only place
   * they are visible while the drawer is shut. The price range counts once, not
   * twice: `minPrice` and `maxPrice` are one choice made with one control. The
   * search term is left out — it is shown in the bar above and is not something
   * this panel can clear.
   */
  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedBrand ? 1 : 0) +
    (selectedMinPrice !== null || selectedMaxPrice !== null ? 1 : 0);

  /**
   * The one panel, mounted in both of its hosts. Two mounts rather than one
   * element moved between them: a `fixed` drawer and an in-flow sidebar cannot
   * be the same box. Each therefore keeps its own expanded categories, which is
   * what a shopper crossing the breakpoint mid-session would expect anyway.
   *
   * `onApplied` is what closes the drawer once a filter is picked; the sidebar
   * passes nothing and stays where it is.
   */
  const renderFilters = (onApplied?: () => void) => (
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
      onApplied={onApplied}
    />
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
        {/*
         * `self-start` is what makes the sticky work at all: a flex row stretches
         * its items to the tallest one, and an aside as tall as the whole product
         * grid has no distance left to travel inside its own box. `lg:top-24` is
         * the offset the checkout summary already sticks at.
         *
         * BOUNDED, WITH AN INNER SCROLLER — the opposite of the trade the
         * checkout summary documents at CheckoutForm.tsx:1048, because neither
         * cost it refuses applies here. It cannot clip a portal-less dropdown:
         * this panel holds buttons, a list and a slider, and nothing in it needs
         * to escape the box. And `data-lenis-prevent` is not the liability it is
         * there, where the pinned column usually has no overflow to scroll —
         * a price filter plus a category tree plus every brand overflows a
         * viewport in the ordinary case, so the wheel nearly always has
         * something here to move. (It degrades to native page scroll when it
         * does not: Lenis returns without `preventDefault` on a prevented
         * element, so the browser still handles the event.)
         *
         * Unbounded is what this panel cannot afford. A sticky box pins at its
         * top and stops, so the checkout column gives up its last few pixels —
         * an optional note. Here the bottom of the panel is the Brands filter,
         * and a shopper who cannot reach it has lost a filter rather than a
         * flourish.
         */}
        <aside
          className="hidden shrink-0 self-start lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:w-64 lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
          data-lenis-prevent
        >
          {renderFilters()}
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* The only way to the filters below `lg`. Carries the applied
                  count because the panel that would otherwise show it is shut. */}
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                // `aria-haspopup`, not `aria-expanded`: this opens a modal
                // dialog rather than disclosing a region inside the page.
                aria-haspopup="dialog"
                className="flex items-center gap-2 rounded border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand hover:text-brand lg:hidden"
              >
                <SlidersHorizontal size={16} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-brand px-1.5 text-xs leading-5 font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <p className="text-sm text-gray-500">{meta.total} Products</p>
            </div>
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

      <ProductFiltersDrawer open={filtersOpen} onClose={closeFilters}>
        {renderFilters(closeFilters)}
      </ProductFiltersDrawer>
    </div>
  );
}
