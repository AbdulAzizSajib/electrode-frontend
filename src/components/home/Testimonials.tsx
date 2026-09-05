import Image from "next/image";
import { Quote } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { authorInitials } from "@/services/testimonials";
import type { Testimonial } from "@/types/testimonial";

/**
 * The homepage's "What Our Clients Say" row.
 *
 * Takes its entries as a prop for the same reason `BlogSection` does, and
 * renders nothing when there are none — a heading over an empty grid is worse
 * than a shorter page.
 */
export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className=" py-12">
      <div className="container-px site-container">
        <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">What Our Clients Say</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-xl bg-white p-6 shadow-sm">
              <Quote className="mb-3 text-brand" size={22} />
              <p className="text-sm text-gray-600">{t.quote}</p>
              <div className="mt-4">
                {/* The stored rating, not a hardcoded 5. A section where every
                    card shows five stars regardless of what it says is not
                    showing a rating. */}
                <StarRating rating={t.rating} />
              </div>
              <div className="mt-3 flex items-center gap-2.5">
                {/*
                  Photo when there is one, initials when there is not — never a
                  gap and never a stock silhouette. Both occupy the same
                  footprint, so a mixed row does not stagger.
                */}
                {t.photoUrl ? (
                  <Image
                    src={t.photoUrl}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500"
                    aria-hidden
                  >
                    {authorInitials(t.authorName)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{t.authorName}</p>
                  <p className="truncate text-xs text-gray-500">{t.authorRole}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
