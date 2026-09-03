/**
 * Product types mirroring the backend's public catalog endpoints
 * (electrode-server: src/app/module/product).
 *
 * Two layers on purpose:
 * - `Api*` mirrors the wire format, where every monetary value is a decimal
 *   *string* ("79.99").
 * - `Product` / `ProductVariant` are the view models the UI renders, with money
 *   parsed to numbers and images narrowed to what the UI needs. Converting once
 *   at the service boundary keeps `"79.99" * 2` (which is NaN) out of the
 *   components.
 */

export type ProductType = "SIMPLE" | "VARIABLE";
export type ProductStatus = "ACTIVE" | "INACTIVE" | "DRAFT";

export interface ApiProductImage {
  id: string;
  productId: string;
  /**
   * The variant this image depicts, or `null` when it is shared by the whole
   * product (packaging, size chart) and applies to every variant.
   *
   * Only the detail endpoint carries this — the list projection returns just
   * the primary image, so a listing cannot know an image's variant.
   */
  variantId: string | null;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

/** How an option's values are drawn. Anything unrecognised renders as `LABEL`. */
export type ApiOptionPresentation = "SWATCH" | "LABEL";

export interface ApiProductOptionValue {
  id: string;
  label: string;
  position: number;
  /** CSS colour, present only on a SWATCH option's values. */
  swatch: string | null;
}

/**
 * A named axis of choice — Colour, Size, Weight — with its values in the order
 * the merchant authored them. Arrives ordered by `position`; the storefront
 * sorts again rather than trusting array order.
 */
export interface ApiProductOption {
  id: string;
  name: string;
  position: number;
  presentation: ApiOptionPresentation;
  values: ApiProductOptionValue[];
}

export interface ApiProductVariant {
  id: string;
  name: string;
  sku: string;
  price: string;
  compareAtPrice: string | null;
  // No `costPrice`: it is the supplier cost, and the public endpoints project
  // it out. Re-declaring it would invite a component to render it.
  stockQuantity: number;
  /** Free-form map, e.g. `{ "version": "Pro" }`. */
  attributes: Record<string, string> | null;
  image: string | null;
  status: boolean;
  /**
   * The option values defining this variant — one per option of its product.
   * Absent on payloads predating options, and empty for products that define
   * none.
   */
  optionValues?: { valueId: string }[];
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
  // No `costPrice`: it is the supplier cost, and the public endpoints project
  // it out. Re-declaring it would invite a component to render it.
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
  /** Only on the detail endpoint, like `variants`. Absent means no options. */
  options?: ApiProductOption[];
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
  /**
   * Lifetime units sold, counting only orders whose payment succeeded. A plain
   * number, and 0 rather than null for a product that has never sold — what
   * `?sortBy=totalSold` orders by.
   */
  totalSold: number;
  /**
   * Lifetime product-page views, deduplicated per viewer. A LIFETIME TOTAL —
   * it says nothing about how many people are on the page now, and must never
   * be presented as though it did.
   *
   * Optional because a storefront deployed ahead of the backend would not
   * receive it.
   */
  viewCount?: number;
}

/** Pagination block returned alongside a product list. */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type OptionPresentation = "SWATCH" | "LABEL";

export interface ProductOptionValue {
  id: string;
  label: string;
  /** CSS colour for a swatch; absent on a label option. */
  swatch?: string;
}

export interface ProductOption {
  id: string;
  name: string;
  presentation: OptionPresentation;
  /** In the merchant's authored order — S, M, XL, not alphabetical. */
  values: ProductOptionValue[];
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
  /**
   * Ids of the option values defining this variant, one per option. Empty for a
   * product with no options, which is every product authored before options
   * existed — those are presented through a synthetic option built from variant
   * names instead.
   */
  optionValueIds: string[];
}

export interface ProductAttribute {
  name: string;
  value: string;
}

/**
 * One gallery image in the view model.
 *
 * An object rather than a bare url string: a url cannot say which variant it
 * depicts, and that association is what lets the gallery show only the photos
 * matching the option a shopper selected.
 */
export interface ProductImage {
  url: string;
  /** The variant this image depicts; `null` means shared across all variants. */
  variantId: string | null;
  altText?: string;
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
  /** Primary image url, or a placeholder when the product has none. */
  image: string;
  /**
   * The full gallery, primary first then by sort order. Carries each image's
   * variant association, so a bare url is `images[i].url`.
   */
  images: ProductImage[];
  brand?: string;
  category?: string;
  categorySlug?: string;
  stockQuantity: number;
  inStock: boolean;
  isFeatured: boolean;
  variants: ProductVariant[];
  /**
   * The product's axes of choice. Empty for a simple product and for every
   * product authored before options existed — `product-options.ts` presents
   * those through a synthetic option instead, so components never branch on it.
   */
  options: ProductOption[];
  attributes: ProductAttribute[];
  /**
   * Undefined when the product has no published reviews — deliberately not 0,
   * so an unrated product renders no stars at all rather than an empty
   * five-star row that reads as "rated badly". Set only when reviewCount > 0.
   */
  rating?: number;
  reviewCount: number;
  /**
   * Lifetime views, deduplicated per viewer. 0 for a product nobody has opened
   * — and for any payload predating view tracking, which is why the page shows
   * nothing at 0 rather than claiming zero interest.
   */
  viewCount: number;
}

export interface ProductListResult {
  products: Product[];
  meta: PaginationMeta;
}

/**
 * A row from `GET /products/search?q=` — deliberately NOT an `ApiProduct`.
 *
 * The search endpoint returns a slim projection built for typeahead: a flat
 * `brandName` instead of a nested brand, a single `image` string instead of the
 * images array, and no stock, category, variants or review aggregate. Treating
 * it as a product would mean `toProduct` silently filling those gaps with
 * defaults, so the suggestion list gets its own type and its own mapper.
 */
export interface ApiSearchSuggestion {
  id: string;
  name: string;
  slug: string;
  /** Decimal string, like every other monetary value on this API. */
  price: string;
  image: string | null;
  brandName: string | null;
}

/** The view model the search dropdown renders. */
export interface SearchSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  brand?: string;
}

/**
 * Fields the public product listing may be ordered by.
 *
 * Mirrors `PUBLIC_PRODUCT_SORT_FIELDS` on the backend, which rejects anything
 * else with a 400 rather than silently falling back to a default order. Typed
 * as a closed union so a disallowed field is a compile error here instead of a
 * failed request at runtime.
 */
export type ProductSortField =
  | "createdAt"
  | "price"
  | "name"
  | "averageRating"
  | "totalSold";

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
  /** Restricts the listing to products the merchant flagged as featured. */
  isFeatured?: boolean;
  sortBy?: ProductSortField;
  sortOrder?: "asc" | "desc";
}
