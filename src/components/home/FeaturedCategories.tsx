import { FEATURED_CATEGORIES_LAYOUTS } from "@/components/home/categories/registry";
import { getCategoryGrid } from "@/services/category";
import type { FeaturedCategoriesLayout } from "@/types/store-settings";

/**
 * The homepage's featured categories: one fetch, then whichever arrangement
 * the merchant chose.
 *
 * On the `Hero` pattern, and for the same reasons. Two layouts each fetching
 * for themselves would be two cache reads and two copies of the empty rule,
 * and the copies would drift the first time one was edited alone. So this
 * component fetches once and hands the list over as props; the layouts are
 * pure markup, which also keeps them reasonable to review in a repo whose
 * test runner cannot render them.
 *
 * The empty rule is unchanged from the grid this replaced: no category with an
 * image means no section, heading included. Being enabled is the merchant
 * saying they want the section; it is not a claim that there is anything to
 * show, and an unseeded catalogue degrades to a shorter page rather than to an
 * empty band under a heading. Both layouts sit behind the same guard, so
 * neither can render a heading over nothing.
 *
 * See server/openspec/changes/add-featured-categories-layout, design.md Decision 5.
 */
export default async function FeaturedCategories({
  title,
  layout,
}: {
  title: string;
  layout: FeaturedCategoriesLayout;
}) {
  const categories = await getCategoryGrid();

  if (categories.length === 0) return null;

  const { Component } = FEATURED_CATEGORIES_LAYOUTS[layout];

  return <Component title={title} categories={categories} />;
}
