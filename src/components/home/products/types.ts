import type { Product } from "@/types/product";

/**
 * What every product-row layout receives.
 *
 * Identical for both layouts by design: the fetch happens once, in
 * `ProductRow`, and a layout decision never costs data. A layout that needed
 * its own props would mean the row could not be swapped without changing the
 * caller, which is the thing the registry exists to avoid.
 *
 * `tabs` predates layouts and is currently accepted and unrendered by the grid;
 * it is carried here so the two layouts keep one prop contract rather than
 * drifting apart the day something renders it.
 *
 * See server/openspec/changes/add-product-slider-and-card-quantity, design.md
 * Decision 2.
 */
export interface ProductRowLayoutProps {
  title: string;
  products: Product[];
  tabs?: string[];
  viewAllHref?: string;
}
