/**
 * Product types mirroring the backend's public catalog endpoints
 * (electrode-server: src/app/module/product).
 *
 * Two layers on purpose:
 * - `Api*` mirrors the wire format, where every monetary value is a decimal
 *   *string* ("79.99").
 * - `Product` / `ProductVariant` are the view models the UI renders, with money
 *   parsed to numbers and images flattened. Converting once at the service
 *   boundary keeps `"79.99" * 2` (which is NaN) out of the components.
 */

export type ProductType = "SIMPLE" | "VARIABLE";
export type ProductStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface ApiProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface ApiProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  costPrice: string | null;
  stockQuantity: number;
  /** Free-form map, e.g. `{ "version": "Pro" }`. */
  attributes: Record<string, string> | null;
  image: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A spec row, e.g. `{ name: "Connectivity", value: "Wi-Fi and Bluetooth" }`. */
export interface ApiProductAttribute {
  id: string;
  productId: string;
  name: string;
  value: string;
  createdAt: string;
}

export interface ApiBrand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  status: boolean;
}

export interface ApiProductCategory {
  id: string;
  name: string;
  slug: string;
  status: boolean;
}

/**
 * A product as `GET /products` returns it. `variants` and `attributes` are only
 * populated by the detail endpoint (`GET /products/:slug`) — the list endpoint
 * omits them, which is why a listing cannot know a product's variants.
 */
export interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  shortDescription: string | null;
  type: ProductType;
  status: ProductStatus;
  categoryId: string;
  brandId: string | null;
  price: string;
  compareAtPrice: string | null;
  costPrice: string | null;
  stockQuantity: number;
  lowStockThreshold: number | null;
  weight: string | null;
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
  updatedAt: string;
  category: ApiProductCategory | null;
  brand: ApiBrand | null;
  images: ApiProductImage[];
  variants?: ApiProductVariant[];
  attributes?: ApiProductAttribute[];
  /** Set when an active campaign discounts this product. */
  campaignPrice: string | null;
  activeCampaign: { id: string; name: string } | null;
  /**
   * Aggregate over the product's APPROVED reviews. `averageRating` is a decimal
   * string ("0", "4.50") like every other decimal on this API, while
   * `reviewCount` beside it is a plain number — they look symmetrical and are not.
   */
  averageRating: string;
  reviewCount: number;
}

/** Pagination block returned alongside a product list. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  attributes: Record<string, string>;
  image?: string;
  inStock: boolean;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

/** The shape every product-rendering component consumes. */
export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  description?: string;
  shortDescription?: string;
  type: ProductType;
  /** Requires a variant choice before it can be added to the cart. */
  isVariable: boolean;
  price: number;
  compareAtPrice?: number;
  /** Primary image, or a placeholder when the product has none. */
  image: string;
  images: string[];
  brand?: string;
  category?: string;
  categorySlug?: string;
  stockQuantity: number;
  inStock: boolean;
  isFeatured: boolean;
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  /**
   * Undefined when the product has no published reviews — deliberately not 0,
   * so an unrated product renders no stars at all rather than an empty
   * five-star row that reads as "rated badly". Set only when reviewCount > 0.
   */
  rating?: number;
  reviewCount: number;
}

export interface ProductListResult {
  products: Product[];
  meta: PaginationMeta;
}

/** Query parameters accepted by `GET /products`. */
export interface ProductQuery {
  page?: number;
  limit?: number;
  searchTerm?: string;
  /** Category id (not slug) — the API filters on the id. */
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}
