"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import RatingBreakdownBars from "@/components/product/RatingBreakdownBars";
import ReviewForm from "@/components/product/ReviewForm";
import { useGetMyReviewsQuery, useGetProductReviewsQuery } from "@/store/reviewApi";
import { REVIEWS_PAGE_SIZE } from "@/services/review";
import type { PaginationMeta } from "@/types/product";
import type { RatingBreakdown, Review } from "@/types/review";

/**
 * The Reviews tab.
 *
 * Page 1 arrives server-rendered from the product page, so reviews are in the
 * document rather than fetched after paint. RTK Query only takes over once the
 * shopper asks for a later page — `skip` keeps it dormant until then.
 */
export default function ProductReviews({
  productId,
  initialReviews,
  initialBreakdown,
  initialMeta,
  initialError,
  isSignedIn,
}: {
  productId: string;
  initialReviews: Review[];
  initialBreakdown: RatingBreakdown | null;
  initialMeta: PaginationMeta;
  initialError: boolean;
  isSignedIn: boolean;
}) {
  const [page, setPage] = useState(1);

  const { data, isFetching, isError } = useGetProductReviewsQuery(
    { productId, page, limit: REVIEWS_PAGE_SIZE },
    { skip: page === 1 },
  );

  // Only signed-in shoppers have reviews of their own to look up, and the
  // endpoint 401s for everyone else.
  const { data: mine } = useGetMyReviewsQuery(undefined, { skip: !isSignedIn });
  const ownReview = mine?.reviews.find((r) => r.productId === productId);

  const reviews = page === 1 ? initialReviews : data?.reviews ?? [];
  const breakdown = page === 1 ? initialBreakdown : data?.breakdown ?? null;
  const meta = page === 1 ? initialMeta : data?.meta ?? initialMeta;
  const failed = page === 1 ? initialError : isError;

  // "Could not load" and "there are none" are different answers to the shopper
  // and the spec keeps them apart — an outage must never read as "no reviews".
  if (failed) {
    return (
      <p className="text-sm text-gray-600">
        Reviews could not be loaded right now. Please try again shortly.
      </p>
    );
  }

  const totalPages = meta.totalPages || 1;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {breakdown && breakdown.total > 0 && (
          <RatingBreakdownBars breakdown={breakdown} />
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-600">
            No reviews yet. Be the first to review this product.
          </p>
        ) : (
          <ul className="space-y-5">
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
                <div className="flex items-center gap-3">
                  <StarRating rating={review.rating} size={13} />
                  <span className="text-sm font-medium text-gray-900">
                    {review.authorName}
                  </span>
                  <time
                    dateTime={review.createdAt}
                    className="text-xs text-gray-400"
                  >
                    {new Date(review.createdAt).toLocaleDateString()}
                  </time>
                </div>
                {review.title && (
                  <p className="mt-2 text-sm font-semibold text-gray-900">
                    {review.title}
                  </p>
                )}
                {review.comment && (
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">
                    {review.comment}
                  </p>
                )}
                {review.adminReply && (
                  <p className="mt-3 rounded bg-gray-50 p-3 text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Store reply: </span>
                    {review.adminReply}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || isFetching}
              className="rounded border border-gray-300 px-3 py-1.5 text-xs font-semibold disabled:opacity-50"
            >
              Next
            </button>
            {isFetching && <Loader2 size={14} className="animate-spin text-gray-400" />}
          </div>
        )}
      </div>

      <div>
        {!isSignedIn ? (
          <div className="rounded-lg border border-gray-200 p-5 text-sm text-gray-600">
            <p className="mb-3">Bought this product? Sign in to leave a review.</p>
            <Link
              href="/account/login"
              className="inline-block rounded bg-brand px-4 py-2 text-xs font-semibold text-white"
            >
              Sign in
            </Link>
          </div>
        ) : (
          // An existing review switches the form to edit mode rather than
          // offering a second submission the backend would reject.
          <ReviewForm productId={productId} existing={ownReview} />
        )}
      </div>
    </div>
  );
}
