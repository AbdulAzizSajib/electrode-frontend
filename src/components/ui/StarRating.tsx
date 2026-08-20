import { Star } from "lucide-react";

export default function StarRating({
  rating = 0,
  size = 14,
}: {
  rating?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
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
