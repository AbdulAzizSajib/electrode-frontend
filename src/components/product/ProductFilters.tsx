"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import PriceRangeFilter from "@/components/product/PriceRangeFilter";
import type { CategoryNode } from "@/types/category";

export interface FilterOption {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: CategoryNode[];
  brands: FilterOption[];
  priceBounds: { min: number; max: number };
  selectedCategory: string | null;
  selectedBrand: string | null;
  selectedMinPrice: number | null;
  selectedMaxPrice: number | null;
  onCategoryChange: (slug: string | null) => void;
  onBrandChange: (slug: string | null) => void;
  onPriceChange: (range: { min: number; max: number } | null) => void;
  onClearAll: () => void;
  /**
   * Fired after any filter is applied. Set by a host that shows this panel
   * transiently — the mobile drawer, which dismisses itself once the shopper
   * has chosen; the desktop sidebar leaves it unset and stays put.
   */
  onApplied?: () => void;
}

/**
 * Filter options come from the live catalog, not a hardcoded list, so they can
 * never offer a filter that matches nothing. Selection is by slug — the same
 * identifier the category menu links with.
 *
 * Ordered price → category → brand: price is the one filter every shopper has
 * an opinion about before they know the catalog, so it costs nothing to scan
 * past and is the most likely first move.
 *
 * Owns no box of its own — no width, no padding, no scroller. It is mounted in
 * two places (the desktop sidebar and the mobile drawer) whose boxes have
 * nothing in common, so each host sizes and scrolls it.
 */
export default function ProductFilters({
  categories,
  brands,
  priceBounds,
  selectedCategory,
  selectedBrand,
  selectedMinPrice,
  selectedMaxPrice,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onClearAll,
  onApplied,
}: Props) {
  /**
   * Which parents are expanded. Seeded with the ancestor of the current
   * selection so a shopper arriving on `?category=cables` sees that choice in
   * its place under "Adapters & Cables" rather than in a collapsed group.
   */
  const [expanded, setExpanded] = useState<string[]>(() => {
    const owner = categories.find((parent) =>
      parent.children.some((child) => child.slug === selectedCategory),
    );
    return owner ? [owner.id] : [];
  });

  function toggleExpanded(id: string) {
    setExpanded((current) =>
      current.includes(id) ? current.filter((c) => c !== id) : [...current, id],
    );
  }

  /**
   * Reports an applied filter to the host on top of forwarding it.
   *
   * Only the four filters go through this. Expanding a parent category
   * deliberately does not: it reveals choices rather than making one, and
   * dismissing the drawer there would put the children out of reach.
   */
  function reporting<T>(change: (value: T) => void) {
    return (value: T) => {
      change(value);
      onApplied?.();
    };
  }

  const changeCategory = reporting(onCategoryChange);
  const changeBrand = reporting(onBrandChange);
  const changePrice = reporting(onPriceChange);

  function clearAll() {
    onClearAll();
    onApplied?.();
  }

  // A catalog whose products all cost the same gives the track no width, so
  // there is no price filter to offer. `PriceRangeFilter` enforces this itself
  // as well — it is the one that cannot render without it.
  const showPrice = priceBounds.max > priceBounds.min;

  const hasPriceFilter = selectedMinPrice !== null || selectedMaxPrice !== null;
  const hasAnyFilter = Boolean(selectedCategory || selectedBrand) || hasPriceFilter;

  return (
    <div>
      {/*
       * Only rendered once something is applied, so the panel does not carry a
       * permanently-dead control. It clears every filter at once — the
       * per-filter "All" options remain for clearing one.
       */}
      {hasAnyFilter && (
        <button
          type="button"
          onClick={clearAll}
          className="mb-6 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-gray-500 uppercase transition hover:text-brand"
        >
          <X size={14} />
          Clear all filters
        </button>
      )}

      {/*
       * The same condition the slider itself applies. Decided here too, rather
       * than left to the child, because the separator belongs to the SECTION —
       * letting the slider self-hide left its divider behind, so a catalog
       * where every product costs the same showed a rule with nothing above it.
       */}
      {showPrice && (
        <>
          <PriceRangeFilter
            min={priceBounds.min}
            max={priceBounds.max}
            selectedMin={selectedMinPrice}
            selectedMax={selectedMaxPrice}
            onApply={changePrice}
          />

          <div className="my-7 border-t border-gray-200" />
        </>
      )}

      <div>
        <h3 className="mb-4 text-sm font-bold tracking-wide text-gray-900 uppercase">
          Product categories
        </h3>

        <ul className="text-sm">
          <li>
            <button
              type="button"
              onClick={() => changeCategory(null)}
              className={`block w-full py-2 text-left transition ${
                selectedCategory
                  ? "text-gray-600 hover:text-brand"
                  : "font-semibold text-brand"
              }`}
            >
              All categories
            </button>
          </li>

          {categories.map((parent) => {
            const isOpen = expanded.includes(parent.id);
            const hasChildren = parent.children.length > 0;

            return (
              <li key={parent.id}>
                {/*
                 * The row does two things, so it is two controls: the name
                 * filters, the chevron expands. One combined button would force
                 * a parent to be selected before its children could be seen.
                 */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => changeCategory(parent.slug)}
                    className={`flex-1 py-2 text-left transition ${
                      selectedCategory === parent.slug
                        ? "font-semibold text-brand"
                        : "text-gray-700 hover:text-brand"
                    }`}
                  >
                    {parent.name}
                  </button>

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(parent.id)}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? "Collapse" : "Expand"} ${parent.name}`}
                      className="flex size-6 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 motion-reduce:transition-none ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && isOpen && (
                  <ul className="mb-1 space-y-0.5 pl-4">
                    {parent.children.map((child) => (
                      <li key={child.id}>
                        <button
                          type="button"
                          onClick={() => changeCategory(child.slug)}
                          className={`block w-full py-1.5 text-left transition ${
                            selectedCategory === child.slug
                              ? "font-semibold text-brand"
                              : "text-gray-500 hover:text-brand"
                          }`}
                        >
                          {child.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {brands.length > 0 && (
        <>
          <div className="my-7 border-t border-gray-200" />

          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wide text-gray-900 uppercase">
              Brands
            </h3>

            {/*
             * No cap and no scroller of its own. A shop with 80 brands used to
             * need one to stop the sidebar pushing the product grid down, but
             * both hosts now bound this panel themselves — the sidebar to the
             * viewport, the drawer to its own height — and a second scroller
             * nested inside either only gives the shopper two tracks to fight.
             */}
            <ul className="space-y-0.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => changeBrand(null)}
                  className={`block w-full py-2 text-left transition ${
                    selectedBrand
                      ? "text-gray-600 hover:text-brand"
                      : "font-semibold text-brand"
                  }`}
                >
                  All brands
                </button>
              </li>

              {brands.map((brand) => (
                <li key={brand.id}>
                  <button
                    type="button"
                    onClick={() =>
                      // Re-pressing the applied brand clears it, so the filter
                      // can be undone where it was set.
                      changeBrand(selectedBrand === brand.slug ? null : brand.slug)
                    }
                    className={`block w-full py-2 text-left transition ${
                      selectedBrand === brand.slug
                        ? "font-semibold text-brand"
                        : "text-gray-700 hover:text-brand"
                    }`}
                  >
                    {brand.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
