"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";

import CountdownTimer from "@/components/ui/CountdownTimer";
import ProductCard from "@/components/product/ProductCard";
import type { Campaign } from "@/types/campaign";
import type { ProductRowLayout } from "@/types/store-settings";

const COLUMNS = { base: 2, sm: 3, lg: 5 } as const;
/** 12px on a phone, 20px from `sm` up — the same as the other product rows. */
const GAP = { base: 12, sm: 20 } as const;
const BREAKPOINT = { sm: 640, lg: 1024 } as const;

const ARROW_CLASS =
  "flex size-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-xs transition hover:border-brand/40 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-40";

/**
 * The campaign occupying the DEAL_OF_WEEK slot, rendered inside a unified
 * promotional showcase with a responsive header bar (title, countdown timer,
 * CTA and slider controls) above a wrapping grid ("GRID") or horizontal Swiper
 * carousel ("SLIDER").
 */
export default function DealOfWeek({
  campaign,
  layout = "GRID",
}: {
  campaign: Campaign;
  layout?: ProductRowLayout;
}) {
  const [expired, setExpired] = useState(false);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  useEffect(() => {
    if (campaign.endsAt === null) return;

    const check = () => setExpired(Date.now() >= campaign.endsAt!);
    check();

    const id = setInterval(check, 1000);
    return () => clearInterval(id);
  }, [campaign.endsAt]);

  if (expired || campaign.products.length === 0) return null;

  const syncEdges = (instance: SwiperInstance) =>
    setEdges((current) =>
      current.atStart === instance.isBeginning && current.atEnd === instance.isEnd
        ? current
        : { atStart: instance.isBeginning, atEnd: instance.isEnd },
    );

  return (
    <section className="container-px site-container py-8">
      <div className="rounded-2xl border border-brand/15 bg-linear-to-br from-[#eef2fc] via-[#f4f7fe] to-[#e9effd] p-5 shadow-xs sm:p-7 lg:p-8">
        {/* Header Bar: Campaign Title + Countdown + CTA / Slider Arrows */}
        <div className="mb-6 flex flex-col gap-5 border-b border-brand/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 rounded-full bg-sale px-3 py-1 text-xs font-bold tracking-wide text-white uppercase shadow-xs">
                <Zap className="size-3.5 fill-current" aria-hidden />
                Flash Deal
              </span>
              {campaign.endsAt !== null && (
                <span className="text-xs font-medium text-gray-600 sm:text-sm">
                  Limited time offer, grab yours before it ends!
                </span>
              )}
            </div>

            <h2 className="flex items-center gap-2.5 text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
              <span aria-hidden="true" className="h-5 w-1.5 shrink-0 rounded-full bg-brand sm:h-6" />
              <span>{campaign.name}</span>
            </h2>

            {campaign.description ? (
              <p className="max-w-2xl text-sm text-gray-600 sm:text-base">{campaign.description}</p>
            ) : null}
          </div>

          <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-center lg:justify-end">
            {campaign.endsAt !== null ? <CountdownTimer endsAt={campaign.endsAt} /> : null}

            <div className="flex w-full items-center justify-between gap-3 lg:w-auto lg:justify-end lg:gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-brand px-4 py-2 text-base font-bold text-white shadow-sm transition hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:px-7"
              >
                <span>Shop All Deals</span>
                <ArrowRight className="size-5 shrink-0" aria-hidden />
              </Link>

              {layout === "SLIDER" && (
                <div className="ms-auto flex shrink-0 items-center gap-2.5 lg:ms-0">
                  <button
                    type="button"
                    aria-label="Previous deal products"
                    disabled={edges.atStart}
                    onClick={() => swiper?.slidePrev()}
                    className={ARROW_CLASS}
                  >
                    <ChevronLeft className="size-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Next deal products"
                    disabled={edges.atEnd}
                    onClick={() => swiper?.slideNext()}
                    className={ARROW_CLASS}
                  >
                    <ChevronRight className="size-5" aria-hidden />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid or Slider */}
        {layout === "SLIDER" ? (
          <div className="min-w-0">
            <Swiper
              slidesPerView={COLUMNS.base}
              spaceBetween={GAP.base}
              breakpoints={{
                [BREAKPOINT.sm]: { slidesPerView: COLUMNS.sm, spaceBetween: GAP.sm },
                [BREAKPOINT.lg]: { slidesPerView: COLUMNS.lg, spaceBetween: GAP.sm },
              }}
              onSwiper={(instance) => {
                setSwiper(instance);
                syncEdges(instance);
              }}
              onSlideChange={syncEdges}
              onBreakpoint={syncEdges}
              onResize={syncEdges}
              onUpdate={syncEdges}
              aria-label={campaign.name}
            >
              {campaign.products.map((product) => (
                <SwiperSlide key={product.id} className="!flex !h-auto [&>div]:flex-1">
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
            {campaign.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
