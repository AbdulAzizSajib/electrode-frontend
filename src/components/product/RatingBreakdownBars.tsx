import StarRating from "@/components/ui/StarRating";
import type { RatingBreakdown } from "@/types/review";

/** "4.5 out of 5, 87 reviews" plus the per-star distribution. */
export default function RatingBreakdownBars({
  breakdown,
}: {
  breakdown: RatingBreakdown;
}) {
  return (
    <div className="flex flex-col gap-6 rounded-lg bg-gray-50 p-5 sm:flex-row sm:items-center sm:gap-10">
      <div className="flex flex-col items-center gap-1 sm:min-w-32">
        <span className="text-4xl font-bold text-gray-900">
          {breakdown.average.toFixed(1)}
        </span>
        <StarRating rating={breakdown.average} size={16} />
        <span className="text-xs text-gray-500">
          {breakdown.total} review{breakdown.total === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex-1 space-y-1.5">
        {breakdown.counts.map(({ rating, count }) => {
          // Guard the divisor rather than the caller: a breakdown is only shown
          // when total > 0, but a 0 here would render NaN% widths.
          const percent = breakdown.total > 0 ? (count / breakdown.total) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3 text-xs text-gray-600">
              <span className="w-3 tabular-nums">{rating}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-6 text-right tabular-nums">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
