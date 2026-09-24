import type { ComponentType } from "react";
import { ProductSectionSkeleton, ProductSliderSkeleton } from "@/components/home/HomeSkeletons";
import ProductSection from "@/components/home/ProductSection";
import ProductSlider from "@/components/home/products/ProductSlider";
import type { ProductRowLayoutProps } from "@/components/home/products/types";
import type { ProductRowLayout } from "@/types/store-settings";

/**
 * Everything that differs between the product-row layouts, in one record — the
 * same shape as `categories/registry.ts` and `hero/registry.ts`, for the same
 * reason.
 *
 * ── Why the skeleton lives here and not in the component ─────────────────
 *
 * It is the thing you forget. Kept apart, a layout and its placeholder are
 * edited months apart with nothing linking them, and the failure is a page that
 * re-flows on first paint: invisible on a fast local machine, obvious to a
 * shopper on a phone — a slider's one-row placeholder replaced by a grid, or
 * the reverse, moves everything below it. Kept together in a
 * `Record<ProductRowLayout, …>`, TypeScript reports the missing key the moment
 * a layout is added, so one cannot ship without its placeholder.
 *
 * ── One registry, three sections ─────────────────────────────────────────
 *
 * `BEST_SELLING`, `FEATURED_PRODUCTS` and `NEW_ARRIVALS` all resolve their
 * layout through this one map. They remain three separate entries in
 * `SECTION_LAYOUTS` — the layout is stored per section, so a merchant may show
 * one row as a grid and another as a slider — but what each layout IS is the
 * same answer for all three, and stating it once is what keeps them identical.
 *
 * Both layouts receive the SAME props: the fetch happens once, in `ProductRow`,
 * and a layout decision never costs data.
 *
 * `GRID` is `ProductSection` unchanged — the component the three rows rendered
 * before layouts existed, kept byte-identical so a shop that never opens the
 * control sees no change.
 *
 * See server/openspec/changes/add-product-slider-and-card-quantity, design.md
 * Decision 2.
 */
export interface ProductRowLayoutEntry {
  Component: ComponentType<ProductRowLayoutProps>;
  Skeleton: ComponentType;
}

export const PRODUCT_ROW_LAYOUTS: Record<ProductRowLayout, ProductRowLayoutEntry> = {
  /** The wrapping grid — two, three, six across. What the rows have always been. */
  GRID: {
    Component: ProductSection,
    Skeleton: ProductSectionSkeleton,
  },

  /** The same cards in one row, at the grid's own column counts, scrolled sideways. */
  SLIDER: {
    Component: ProductSlider,
    Skeleton: ProductSliderSkeleton,
  },
};
