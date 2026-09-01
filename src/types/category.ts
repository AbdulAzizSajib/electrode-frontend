/**
 * Category types mirroring the backend's public catalog endpoint
 * (electrode-server: src/app/module/category).
 */

/**
 * A category exactly as `GET /categories` returns it. The endpoint nests one
 * level of children — top-level categories carry a `children` array, and the
 * children themselves come back without one.
 */
export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  banner: string | null;
  status: boolean;
  parentId: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  children?: ApiCategory[];
}

/**
 * The trimmed shape the navigation actually renders. The API returns ~14 fields
 * per category and the menu uses four; since this is passed from a Server
 * Component into the client `Header` on every page, mapping down keeps the RSC
 * payload small.
 */
export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  children: CategoryNode[];
}

/** Shape the category grid renders: name, slug, and the best available image. */
export interface CategoryGridItem {
  name: string;
  slug: string;
  image: string | null;
}
