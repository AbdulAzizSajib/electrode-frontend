import { placeholderImage } from "@/lib/placeholder";
import type { ApiProductImage } from "@/types/product";

/**
 * Saved products, in the same two-layer shape as `types/product.ts`.
 *
 * Note the nested product is a *narrower* select than the catalog's `ApiProduct`
 * — the backend returns only id/name/slug/price/status/rating/primary image, with
 * no `type`, `variants`, or `compareAtPrice`. So this deliberately does NOT reuse
 * `toProduct`: feeding it a partial product would fabricate defaults (a base
 * price of 0, `isVariable: false`) that look like real data.
 */

export interface ApiWishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  status: string;
  averageRating: string;
  reviewCount: number;
  images: ApiProductImage[];
}

export interface ApiWishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  createdAt: string;
  product: ApiWishlistProduct | null;
}

export interface WishlistItem {
  /** The wishlist row's id — what move-to-cart and remove-by-item address. */
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  /** Undefined until the product has published reviews (same rule as Product). */
  rating?: number;
  reviewCount: number;
  /**
   * A saved product can leave the catalog or be deactivated after it was saved,
   * so purchasability is read from the product's current status, not assumed.
   */
  isPurchasable: boolean;
}

export function toWishlistItem(item: ApiWishlistItem): WishlistItem {
  const product = item.product;

  const price = Number(product?.price);
  const reviewCount = product?.reviewCount ?? 0;
  const average = Number(product?.averageRating);

  const primaryImage = [...(product?.images ?? [])].sort(
    (a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.sortOrder - b.sortOrder,
  )[0]?.url;

  return {
    id: item.id,
    productId: item.productId,
    name: product?.name ?? "Unavailable product",
    slug: product?.slug ?? "",
    price: Number.isFinite(price) ? price : 0,
    image: primaryImage ?? placeholderImage(product?.slug ?? item.productId),
    rating: reviewCount > 0 && Number.isFinite(average) ? average : undefined,
    reviewCount,
    isPurchasable: product?.status === "ACTIVE",
  };
}

/**
 * `GET /wishlist` returns the wishlist itself rather than a bare array — the
 * items are nested one level down, unlike most list endpoints on this API.
 */
export interface ApiWishlist {
  id: string;
  customerId: string;
  items: ApiWishlistItem[];
}

export interface WishlistCount {
  count: number;
}

export interface WishlistContains {
  inWishlist: boolean;
  itemId: string | null;
}
