"use client";

import { Star } from "lucide-react";
import clsx from "clsx";
import { RATING_MAX, RATING_MIN } from "@/types/review";

/**
 * Bounded 1-5 star picker. Radio inputs rather than buttons so the control is
 * keyboard-navigable and announced as a single choice, with the visual stars
 * driven off the checked state.
 */
export default function RatingInput({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}) {
  const options = Array.from(
    { length: RATING_MAX - RATING_MIN + 1 },
    (_, i) => RATING_MIN + i,
  );

  return (
    <fieldset disabled={disabled} className="flex items-center gap-1">
      <legend className="sr-only">Rating out of {RATING_MAX}</legend>
      {options.map((rating) => (
        <label
          key={rating}
          className={clsx("cursor-pointer p-0.5", disabled && "cursor-not-allowed")}
        >
          <input
            type="radio"
            name="rating"
            value={rating}
            checked={value === rating}
            onChange={() => onChange(rating)}
            className="sr-only"
          />
          <Star
            size={26}
            className={clsx(
              "transition-colors",
              rating <= value
                ? "fill-accent text-accent"
                : "fill-gray-200 text-gray-200",
            )}
          />
          <span className="sr-only">
            {rating} star{rating === 1 ? "" : "s"}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
