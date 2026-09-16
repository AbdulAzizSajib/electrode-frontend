import { Star } from "lucide-react";

export default function StarRating({
  rating = 0,
  size = 14,
}: {
  rating?: number;
  size?: number;
}) {
  return (
    /*
     * `role="img"` is what makes the label reachable. `aria-label` on a plain
     * `div` has no role to attach to, and screen readers are free to ignore it —
     * most do, which left the rating announced as five unlabelled graphics or as
     * nothing at all. The role also makes this a leaf, so the five `Star`s inside
     * are skipped rather than read out one by one.
     */
    <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? "fill-accent text-accent" : "fill-gray-200 text-gray-200"}
        />
      ))}
    </div>
  );
}
