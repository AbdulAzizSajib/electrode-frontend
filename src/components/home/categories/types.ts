import type { CategoryGridItem } from "@/types/category";

/**
 * What every featured-categories layout receives.
 *
 * The same list, in the same order, whichever layout is chosen — a layout
 * decision never costs data. `FeaturedCategories` fetches once and hands this
 * over; the layouts are pure markup.
 */
export interface CategoriesLayoutProps {
  title: string;
  categories: CategoryGridItem[];
}
