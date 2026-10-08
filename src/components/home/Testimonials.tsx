"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";

import StarRating from "@/components/ui/StarRating";
import { authorInitials } from "@/services/testimonials";
import type { Testimonial } from "@/types/testimonial";

/** Cards across per breakpoint: 1 on mobile, 2 on sm (640px), 4 on lg (1024px). */
const COLUMNS = { base: 1, sm: 2, lg: 4 } as const;
const GAP = 24;
const BREAKPOINT = { sm: 640, lg: 1024 } as const;

const ARROW_CLASS =
  "flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-40";

/**
 * The homepage's "What Our Clients Say" carousel on both mobile and desktop.
 */
export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  if (testimonials.length === 0) return null;

  const syncEdges = (instance: SwiperInstance) =>
    setEdges((current) =>
      current.atStart === instance.isBeginning && current.atEnd === instance.isEnd
        ? current
        : { atStart: instance.isBeginning, atEnd: instance.isEnd },
    );

  return (
    <section className="py-12">
      <div className="container-px site-container">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-gray-900 sm:text-2xl">
            <span aria-hidden="true" className="h-5 w-1.5 shrink-0 rounded-full bg-brand sm:h-6" />
            <span>What Our Clients Say</span>
          </h2>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              aria-label="Previous testimonials"
              disabled={edges.atStart}
              onClick={() => swiper?.slidePrev()}
              className={ARROW_CLASS}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              disabled={edges.atEnd}
              onClick={() => swiper?.slideNext()}
              className={ARROW_CLASS}
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        <Swiper
          slidesPerView={COLUMNS.base}
          spaceBetween={GAP}
          breakpoints={{
            [BREAKPOINT.sm]: { slidesPerView: COLUMNS.sm },
            [BREAKPOINT.lg]: { slidesPerView: COLUMNS.lg },
          }}
          onSwiper={(instance) => {
            setSwiper(instance);
            syncEdges(instance);
          }}
          onSlideChange={syncEdges}
          onBreakpoint={syncEdges}
          onResize={syncEdges}
          onUpdate={syncEdges}
          aria-label="What Our Clients Say"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id} className="!flex !h-auto [&>div]:flex-1">
              <div className="flex flex-col rounded-xl border border-gray-100 bg-(--color-card,#ffffff) p-6 shadow-sm">
                <Quote className="mb-3 text-brand" size={22} />
                <p className="flex-1 text-sm text-gray-600">{t.quote}</p>
                <div className="mt-4">
                  <StarRating rating={t.rating} />
                </div>
                <div className="mt-3 flex items-center gap-2.5">
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
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
