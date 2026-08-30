/**
 * Product reviews, in the same two-layer shape as `types/product.ts`:
 * `Api*` is the wire format, the unprefixed type is what components render.
 */

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";

/** Field limits mirror the backend's zod schema — enforced there, surfaced here. */
export const RATING_MIN = 1;
export const RATING_MAX = 5;
export const TITLE_MAX = 150;
export const COMMENT_MAX = 2000;

export interface ApiReviewCustomer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
}

export interface ApiReview {
  id: string;
  productId: string;
  customerId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: ReviewStatus;
  adminReply: string | null;
  createdAt: string;
  updatedAt: string;
  /** Present on the public product-review listing. */
  customer?: ApiReviewCustomer;
  /** Present on `GET /reviews/me`, which lists across products. */
  product?: { id: string; name: string; slug: string };
}

/** Counts keyed by rating value. The wire form uses string keys ("1".."5"). */
export interface ApiRatingBreakdown {
  average: number;
  total: number;
  counts: Record<string, number>;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  status: ReviewStatus;
  adminReply?: string;
  createdAt: string;
  /** Display name, already collapsed from first/last. Falls back rather than blank. */
  authorName: string;
  authorAvatar?: string;
  /** Only set on the customer's own review list. */
  product?: { id: string; name: string; slug: string };
}

export interface RatingBreakdown {
  average: number;
  total: number;
  /** Densified 1-5, so a histogram can map over it without holes. */
  counts: { rating: number; count: number }[];
}

export interface CreateReviewPayload {
  rating: number;
  title?: string;
  comment?: string;
}

export type UpdateReviewPayload = Partial<CreateReviewPayload>;

function displayName(customer: ApiReviewCustomer | undefined): string {
  const full = [customer?.firstName, customer?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  // A review must never render without attribution, so fall back rather than
  // showing an empty byline.
  return full.length > 0 ? full : "Verified buyer";
}

export function toReview(review: ApiReview): Review {
  return {
    id: review.id,
    productId: review.productId,
    rating: review.rating,
    title: review.title ?? undefined,
    comment: review.comment ?? undefined,
    status: review.status,
    adminReply: review.adminReply ?? undefined,
    createdAt: review.createdAt,
    authorName: displayName(review.customer),
    authorAvatar: review.customer?.avatar ?? undefined,
    product: review.product,
  };
}

/**
 * Densifies the wire breakdown into an ordered 5→1 list. The backend already
 * returns every rating key, but building the list here means the histogram
 * cannot silently drop a bar if that ever changes.
 */
export function toRatingBreakdown(breakdown: ApiRatingBreakdown): RatingBreakdown {
  return {
    average: breakdown.average,
    total: breakdown.total,
    counts: [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: breakdown.counts?.[String(rating)] ?? 0,
    })),
  };
}
