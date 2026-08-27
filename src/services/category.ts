import { apiFetch } from "@/lib/api-client";
import type { ApiCategory, CategoryNode } from "@/types/category";

/**
 * Categories change on the order of days, and the menu renders on every page,
 * so refetching per request is pure waste. Five minutes bounds how stale the
 * menu can be after a merchant edit.
 */
const CATEGORY_REVALIDATE_SECONDS = 300;

/** Ascending by the merchant's assigned display order. */
const bySortOrder = (a: ApiCategory, b: ApiCategory) => a.sortOrder - b.sortOrder;

/**
 * Trims an API category to what the menu renders, recursing into children.
 * Inactive categories are dropped here as well as by the endpoint — the public
 * route already filters to ACTIVE, so this is a guard against that changing.
 */
function toCategoryNode(category: ApiCategory): CategoryNode {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    children: (category.children ?? [])
      .filter((child) => child.status)
      .sort(bySortOrder)
      .map(toCategoryNode),
  };
}

/**
 * The storefront's category tree, for the "Shop By Categories" navigation.
 *
 * Uses the public `GET /categories` endpoint — no auth, ACTIVE-only — so the
 * menu is identical for guests and signed-in customers. (The admin
 * `/categories/admin/tree` route is gated to OWNER/ADMIN and would 401 a guest.)
 *
 * Never throws: this is awaited in the root layout, so an unhandled error would
 * take down every page. On any failure the caller gets an empty tree and the
 * header renders no menu, leaving the rest of the page intact.
 */
export async function getCategoryTree(): Promise<CategoryNode[]> {
  try {
    const { data } = await apiFetch<ApiCategory[]>("/categories", {
      revalidate: CATEGORY_REVALIDATE_SECONDS,
    });

    if (!Array.isArray(data)) return [];

    return data
      .filter((category) => category.status)
      .sort(bySortOrder)
      .map(toCategoryNode);
  } catch {
    return [];
  }
}

/** Depth-first walk of the tree, parents before their children. */
export function flattenCategories(nodes: CategoryNode[]): CategoryNode[] {
  return nodes.flatMap((node) => [node, ...flattenCategories(node.children)]);
}

/**
 * Resolves a category slug to its id.
 *
 * Category links carry the slug (readable and shareable), but `GET /products`
 * filters on the id — this is the translation between the two. Returns null for
 * an unknown slug, which callers treat as "no category filter" rather than an
 * error.
 */
export async function resolveCategorySlug(
  slug: string | null | undefined,
): Promise<string | null> {
  if (!slug) return null;

  const tree = await getCategoryTree();
  const match = flattenCategories(tree).find((c) => c.slug === slug);

  return match?.id ?? null;
}
