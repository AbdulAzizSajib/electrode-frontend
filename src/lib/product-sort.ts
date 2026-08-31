import type { ProductQuery } from "@/types/product";

/**
 * The catalog listing's `?sort=` vocabulary.
 *
 * Lives in its own module rather than beside the listing component because both
 * the server page (`app/products/page.tsx`) and the client component read it. A
 * `"use client"` module's exports reach a server component as client
 * *references*, not values — importing an array across that boundary yields
 * something that looks right and has no `.find`, which fails at request time
 * rather than at build time.
 */
export type SortKey =
  | "featured"
  | "best"
  | "new"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

type SortOption = {
  value: SortKey;
  label: string;
  /**
   * Names the page when the sort is the destination rather than a refinement.
   * "Best Selling" and "New Arrivals" are top-nav links, so landing on a page
   * headed only "Shop" would lose what the visitor clicked.
   */
  heading?: string;
  /** The API query this sort issues. Empty for the default ordering. */
  query: Pick<ProductQuery, "sortBy" | "sortOrder">;
};

export const SORT_OPTIONS: SortOption[] = [
  { value: "featured", label: "Featured", query: {} },
  {
    value: "best",
    label: "Best Selling",
    heading: "Best Selling",
    query: { sortBy: "totalSold", sortOrder: "desc" },
  },
  {
    value: "new",
    label: "Newest",
    heading: "New Arrivals",
    query: { sortBy: "createdAt", sortOrder: "desc" },
  },
  { value: "name-asc", label: "Alphabetically, A-Z", query: { sortBy: "name", sortOrder: "asc" } },
  { value: "name-desc", label: "Alphabetically, Z-A", query: { sortBy: "name", sortOrder: "desc" } },
  { value: "price-asc", label: "Price, low to high", query: { sortBy: "price", sortOrder: "asc" } },
  { value: "price-desc", label: "Price, high to low", query: { sortBy: "price", sortOrder: "desc" } },
];

/** The default, used whenever `?sort=` is absent or unrecognised. */
export const DEFAULT_SORT: SortKey = "featured";

/**
 * Resolves a raw `?sort=` value.
 *
 * An unknown value falls back to the default rather than erroring — a stale
 * bookmark should still show products. The backend rejects an unknown `sortBy`
 * with a 400, so this never forwards one.
 */
export function resolveSort(value: string | undefined): SortOption {
  return (
    SORT_OPTIONS.find((option) => option.value === value) ??
    SORT_OPTIONS.find((option) => option.value === DEFAULT_SORT)!
  );
}
