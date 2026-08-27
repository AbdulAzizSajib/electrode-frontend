"use client";

import type { CategoryNode } from "@/types/category";

export interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: CategoryNode[];
  brands: FilterOption[];
  selectedCategory: string | null;
  selectedBrand: string | null;
  onCategoryChange: (slug: string | null) => void;
  onBrandChange: (slug: string | null) => void;
}

/**
 * Filter options come from the live catalog, not a hardcoded list, so they can
 * never offer a filter that matches nothing. Selection is by slug — the same
 * identifier the category menu links with.
 */
export default function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  onCategoryChange,
  onBrandChange,
}: Props) {
  // The menu is two levels; the filter list is flat, so children are offered
  // alongside their parents with a visual indent.
  const categoryOptions = categories.flatMap((parent) => [
    { ...parent, depth: 0 },
    ...parent.children.map((child) => ({ ...child, depth: 1 })),
  ]);

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <h3 className="mb-4 font-semibold text-gray-900">Filter</h3>

      <div className="mb-6">
        <p className="mb-3 text-sm font-semibold text-gray-700">Category</p>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>
            <button
              onClick={() => onCategoryChange(null)}
              className={!selectedCategory ? "font-semibold text-brand" : "hover:text-brand"}
            >
              All
            </button>
          </li>
          {categoryOptions.map((c) => (
            <li key={c.id} className={c.depth > 0 ? "pl-3" : undefined}>
              <button
                onClick={() => onCategoryChange(c.slug)}
                className={
                  selectedCategory === c.slug
                    ? "font-semibold text-brand"
                    : "hover:text-brand"
                }
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {brands.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-semibold text-gray-700">Brand</p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <button
                onClick={() => onBrandChange(null)}
                className={!selectedBrand ? "font-semibold text-brand" : "hover:text-brand"}
              >
                All
              </button>
            </li>
            {brands.map((b) => (
              <li key={b.id}>
                <button
                  onClick={() => onBrandChange(b.slug)}
                  className={
                    selectedBrand === b.slug
                      ? "font-semibold text-brand"
                      : "hover:text-brand"
                  }
                >
                  {b.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
