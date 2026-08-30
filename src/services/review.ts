import { apiFetch } from "@/lib/api-client";
import {
  toRatingBreakdown,
  toReview,
  type ApiRatingBreakdown,
  type ApiReview,
  type RatingBreakdown,
  type Review,
} from "@/types/review";
import type { PaginationMeta } from "@/types/product";

/**
 * Public review reads.
 *
 * These go straight to the backend rather than through an `/api/*` proxy: the
 * published review list is public and cookie-free, so the proxy hop only the
 * authenticated routes need would buy nothing (same reasoning as productApi).
 *
 * Only *writes* and the customer's own review list are proxied — see
 * `src/app/api/reviews/`.
 */

/** Reviews move more often than the catalog but not per-request. */
const REVIEW_REVALIDATE_SECONDS = 30;

export const REVIEWS_PAGE_SIZE = 5;

export interface ProductReviewsResult {
  reviews: Review[];
  breakdown: RatingBreakdown | null;
  meta: PaginationMeta;
  /**
   * True when the list could not be retrieved. Distinguishes "this product has
   * no reviews" from "we could not load them" — the spec keeps these separate
   * so a shopper is never shown an empty state that is really a failure.
   */
  failed: boolean;
}

const EMPTY_META: PaginationMeta = { page: 1, limit: 0, total: 0, totalPages: 0 };

interface ReviewListMeta extends PaginationMeta {
  ratingBreakdown?: ApiRatingBreakdown;
}

export async function getProductReviews(
  productId: string,
  { page = 1, limit = REVIEWS_PAGE_SIZE }: { page?: number; limit?: number } = {},
): Promise<ProductReviewsResult> {
  try {
    const response = await apiFetch<ApiReview[]>(
      `/products/${productId}/reviews?page=${page}&limit=${limit}`,
      { revalidate: REVIEW_REVALIDATE_SECONDS },
    );

    const data = Array.isArray(response.data) ? response.data : [];
    const meta = response.meta as ReviewListMeta | undefined;

    return {
      reviews: data.map(toReview),
      breakdown: meta?.ratingBreakdown
        ? toRatingBreakdown(meta.ratingBreakdown)
        : null,
      meta: meta ?? { ...EMPTY_META, total: data.length },
      failed: false,
    };
  } catch {
    return { reviews: [], breakdown: null, meta: EMPTY_META, failed: true };
  }
}
