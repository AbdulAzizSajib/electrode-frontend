"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import clsx from "clsx";
import StarRating from "@/components/ui/StarRating";
import ReviewForm from "@/components/product/ReviewForm";
import { useDeleteMyReviewMutation, useGetMyReviewsQuery } from "@/store/reviewApi";
import type { ReviewStatus } from "@/types/review";

/**
 * Every review the customer has written, across all statuses — the point of
 * this page is that PENDING and REJECTED reviews are visible to their author,
 * which the public product listing deliberately hides.
 */

const STATUS_LABEL: Record<ReviewStatus, string> = {
  PENDING: "Awaiting approval",
  APPROVED: "Published",
  REJECTED: "Not approved",
  HIDDEN: "Hidden",
};

const STATUS_STYLE: Record<ReviewStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  HIDDEN: "bg-gray-100 text-gray-600",
};

export default function MyReviewsView() {
  const { data, isLoading, isError } = useGetMyReviewsQuery();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteMyReviewMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");

  async function handleDelete(id: string) {
    setActionError("");
    try {
      await deleteReview(id).unwrap();
      setConfirmingId(null);
    } catch {
      setActionError("That review could not be withdrawn. Please try again.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={26} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="py-20 text-center text-sm text-gray-600">
        Your reviews could not be loaded. Please refresh to try again.
      </p>
    );
  }

  const reviews = data?.reviews ?? [];

  if (reviews.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="mb-6 text-sm text-gray-500">
          You haven&apos;t written any reviews yet.
        </p>
        <Link
          href="/products"
          className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionError && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-700">{actionError}</p>
      )}

      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border border-gray-200 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              {review.product ? (
                <Link
                  href={`/products/${review.product.slug}`}
                  className="text-sm font-semibold text-gray-900 hover:text-brand"
                >
                  {review.product.name}
                </Link>
              ) : (
                <span className="text-sm font-semibold text-gray-900">
                  This product is no longer available
                </span>
              )}
              <div className="mt-1 flex items-center gap-2">
                <StarRating rating={review.rating} size={13} />
                <time dateTime={review.createdAt} className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </time>
              </div>
            </div>

            <span
              className={clsx(
                "rounded px-2 py-1 text-xs font-semibold",
                STATUS_STYLE[review.status],
              )}
            >
              {STATUS_LABEL[review.status]}
            </span>
          </div>

          {editingId === review.id ? (
            <div className="mt-4">
              {/* ReviewForm carries the re-moderation warning itself when the
                  review being edited is currently APPROVED. */}
              <ReviewForm
                productId={review.productId}
                existing={review}
                onDone={() => setEditingId(null)}
              />
              <button
                onClick={() => setEditingId(null)}
                className="mt-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              {review.title && (
                <p className="mt-3 text-sm font-semibold text-gray-900">{review.title}</p>
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

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => setEditingId(review.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-brand"
                >
                  <Pencil size={13} /> Edit
                </button>

                {confirmingId === review.id ? (
                  <span className="flex items-center gap-3 text-xs">
                    <span className="text-gray-600">Withdraw this review?</span>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={isDeleting}
                      className="font-semibold text-sale disabled:opacity-50"
                    >
                      Yes, withdraw
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="font-semibold text-gray-500"
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmingId(review.id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-sale"
                  >
                    <Trash2 size={13} /> Withdraw
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
