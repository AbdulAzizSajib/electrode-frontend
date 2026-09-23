import type { ComponentType } from "react";
import { CategoryGridSkeleton, CategorySliderSkeleton } from "@/components/home/HomeSkeletons";
import CategoryGridLayout from "@/components/home/categories/CategoryGridLayout";
import CategorySlider from "@/components/home/categories/CategorySlider";
import type { CategoriesLayoutProps } from "@/components/home/categories/types";
import type { FeaturedCategoriesLayout } from "@/types/store-settings";

/**
 * Everything that differs between the featured-categories layouts, in one
 * record — the same shape as `hero/registry.ts`, for the same reason.
 *
 * ── Why the skeleton lives here and not in the component ─────────────────
 *
 * It is the thing you forget. Kept apart, a layout and its placeholder are
 * edited months apart with nothing linking them, and the failure is a page
 * that re-flows on first paint: invisible on a fast local machine, obvious to
 * a shopper on a phone — a slider's one-row placeholder replaced by a grid, or
 * the reverse, moves everything below it. Kept together in a
 * `Record<FeaturedCategoriesLayout, …>`, TypeScript reports the missing key
 * the moment a layout is added, so one cannot ship without its placeholder.
 *
 * Both layouts receive the SAME props: the fetch happens once, in
 * `FeaturedCategories`, and a layout decision never costs data.
 *
 * See server/openspec/changes/add-featured-categories-layout, design.md Decision 5.
 */
export interface FeaturedCategoriesLayoutEntry {
  Component: ComponentType<CategoriesLayoutProps>;
  Skeleton: ComponentType;
}

export const FEATURED_CATEGORIES_LAYOUTS: Record<FeaturedCategoriesLayout, FeaturedCategoriesLayoutEntry> = {
  /** The wrapping grid — three, four, seven across. What the section has always been. */
  GRID: {
    Component: CategoryGridLayout,
    Skeleton: CategoryGridSkeleton,
  },

  /** The same tiles in one row, at the grid's own column counts, scrolled sideways. */
  SLIDER: {
    Component: CategorySlider,
    Skeleton: CategorySliderSkeleton,
  },
};
