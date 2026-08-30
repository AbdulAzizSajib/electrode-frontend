"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import RatingInput from "@/components/ui/RatingInput";
import { COMMENT_MAX, TITLE_MAX, type Review } from "@/types/review";
import {
  useCreateReviewMutation,
  useUpdateMyReviewMutation,
} from "@/store/reviewApi";

/**
 * Write path for a product review.
 *
 * Eligibility is presented rather than probed: there is no "can I review this?"
 * endpoint, so the form is shown and the backend stays the authority. A 403
 * means the customer has not bought the product — a rule, so it is rendered as
 * an explanation rather than an error.
 *
 * When the customer already has a review for this product, `existing` is passed
 * and the form edits it instead of submitting a second one (the backend would
 * reject a duplicate anyway).
 */
export default function ReviewForm({
  productId,
  existing,
  onDone,
}: {
  productId: string;
  existing?: Review;
  onDone?: () => void;
}) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateMyReviewMutation();
  const isSaving = isCreating || isUpdating;

  const isEditing = Boolean(existing);
  const wasPublished = existing?.status === "APPROVED";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (rating < 1) {
      setMessage("Please choose a rating.");
      return;
    }

    const payload = {
      rating,
      title: title.trim() || undefined,
      comment: comment.trim() || undefined,
    };

    try {
      if (existing) {
        await updateReview({ id: existing.id, body: payload }).unwrap();
      } else {
        await createReview({ productId, ...payload }).unwrap();
      }
      // Deliberately does not clear the fields — on the edit path they are the
      // current content, and on the create path the confirmation replaces them.
      setSubmitted(true);
      onDone?.();
    } catch (error) {
      // What the customer typed stays in state either way, so a failure never
      // costs them their words.
      const status = (error as { status?: number })?.status;
      const detail = (error as { data?: { message?: string } })?.data?.message;

      if (status === 403) {
        setMessage(
          "You can only review a product you have bought. Once an order containing it is complete, you'll be able to leave a review here.",
        );
      } else if (status === 409) {
        setMessage("You have already reviewed this product.");
      } else {
        setMessage(detail ?? "Your review was not submitted. Please try again.");
      }
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
        {isEditing
          ? "Your review was updated. It goes back to the team for approval before it appears publicly."
          : "Thanks — your review was received. It will appear once the team has approved it."}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-900">
        {isEditing ? "Edit your review" : "Write a review"}
      </h3>

      {/* Stated before submitting, not after — the customer should not discover
          that editing unpublished their review only once it has happened. */}
      {wasPublished && (
        <p className="rounded bg-amber-50 p-3 text-xs text-amber-800">
          Your review is currently published. Editing it sends it back for
          approval, so it will be hidden until the team reviews it again.
        </p>
      )}

      <div>
        <span className="mb-1.5 block text-xs font-medium text-gray-700">
          Rating <span className="text-sale">*</span>
        </span>
        <RatingInput value={rating} onChange={setRating} disabled={isSaving} />
      </div>

      <div>
        <label htmlFor="review-title" className="mb-1.5 block text-xs font-medium text-gray-700">
          Title
        </label>
        <input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          disabled={isSaving}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
          placeholder="Sum up your experience"
        />
      </div>

      <div>
        <label htmlFor="review-comment" className="mb-1.5 block text-xs font-medium text-gray-700">
          Review
        </label>
        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={COMMENT_MAX}
          rows={4}
          disabled={isSaving}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
          placeholder="What did you think of it?"
        />
        <p className="mt-1 text-right text-xs text-gray-400">
          {comment.length}/{COMMENT_MAX}
        </p>
      </div>

      {message && (
        <p className="rounded bg-red-50 p-3 text-xs text-red-700">{message}</p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center justify-center gap-2 rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {isSaving && <Loader2 size={14} className="animate-spin" />}
        {isEditing ? "Save changes" : "Submit review"}
      </button>
    </form>
  );
}
