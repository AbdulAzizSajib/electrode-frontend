"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import CategoryTile from "@/components/home/categories/CategoryTile";
import type { CategoriesLayoutProps } from "@/components/home/categories/types";

const MOBILE_INITIAL_COUNT = 6;

/**
 * The category tiles in a wrapping grid — three across on a phone, four at
 * `sm`, seven at `lg`. On mobile (`< sm`), only the first 6 tiles (two rows of
 * three) are shown initially with a "View all" / "View less" toggle when more
 * than 6 categories exist.
 */
export default function CategoryGridLayout({ title, categories }: CategoriesLayoutProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMobileOverflow = categories.length > MOBILE_INITIAL_COUNT;

  return (
    <section className="container-px site-container pb-8">
      <h2 className="mb-8 flex items-center gap-2.5 text-xl font-bold text-gray-900 sm:text-2xl">
        <span aria-hidden="true" className="h-5 w-1.5 shrink-0 rounded-full bg-brand sm:h-6" />
        <span>{title}</span>
      </h2>
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {categories.map((cat, index) => {
          const hiddenOnMobile = index >= MOBILE_INITIAL_COUNT && !expanded;
          return (
            <div
              key={cat.slug}
              className={hiddenOnMobile ? "hidden sm:contents" : "contents"}
            >
              <CategoryTile category={cat} />
            </div>
          );
        })}
      </div>

      {hasMobileOverflow && (
        <div className="mt-5 flex justify-center sm:hidden">
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-800 shadow-xs transition hover:bg-gray-50 active:scale-95"
          >
            {expanded ? (
              <>
                View less
                <ChevronUp className="size-4" aria-hidden />
              </>
            ) : (
              <>
                View all
                <ChevronDown className="size-4" aria-hidden />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
