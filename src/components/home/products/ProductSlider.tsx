"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";

import ProductCard from "@/components/product/ProductCard";
import type { ProductRowLayoutProps } from "@/components/home/products/types";

/**
 * A homepage row of products in one horizontal row that the shopper scrolls
 * sideways.
 *
 * A Client Component for the same reason `CategorySlider` is: Swiper needs the
 * browser and the product fetch does not, so the fetch stays in `ProductRow`
 * and this receives the list as props. Swiper renders its initial markup on the
 * server, so the row is in the HTML and does not pop in.
 *
 * ── The numbers below MUST MATCH the grid ────────────────────────────────
 *
 * `ProductSection` is `grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6`:
 * two, three and six cards across at Tailwind's `sm` (640px) and `lg` (1024px),
 * 20px apart horizontally. `slidesPerView` and `spaceBetween` are those same
 * figures, so a card is the SAME WIDTH in both layouts at every viewport and
 * switching reads as a rearrangement, not as a different section.
 *
 * Note the gap is the grid's `gap-x-5` — 20px — and NOT the 16px the category
 * slider uses; the two grids differ. Nothing in the test suite can measure
 * this (jsdom does no layout), so it is held by these constants being the only
 * place the numbers appear on this side, and by a human comparing the two.
 *
 * ── No autoplay, no loop ─────────────────────────────────────────────────
 *
 * The same reasoning as the category slider, with one addition that is specific
 * to this row: a product card now carries a QUANTITY STEPPER once its product
 * is in the cart, so a row that slid under the pointer would move a `+` out
 * from under a shopper mid-click. No loop, because a shopper who reaches the
 * end of a row should be able to tell they have. The arrows beside the heading
 * are the visible control the spec requires, and sit outside the row so they
 * never overlay a card.
 *
 * ── Why the arrows drive Swiper DIRECTLY, and Navigation is gone ─────────
 *
 * The same correction `CategorySlider` carries, made here for the same two
 * reasons — this row had the identical arrangement, so it had the identical
 * pair of faults, and both showed up only on a phone: swiper/react rendered a
 * SECOND, inert pair of arrows over the first and last card, and below 640px
 * `setBreakpoint()` restored the parameters from `originalParams` and rebound
 * the module to those hidden elements, killing the visible buttons. The long
 * account is on `CategorySlider`; this row simply must not drift from it.
 *
 * See server/openspec/changes/add-product-slider-and-card-quantity, design.md
 * Decision 3.
 */

/** Cards across, per breakpoint — the grid's `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`. */
const COLUMNS = { base: 2, sm: 3, lg: 6 } as const;
/** The grid's `gap-x-5`, in pixels. NOT the categories' 16 — the two grids differ. */
const GAP = 20;
/** Tailwind's `sm` and `lg` breakpoints, in pixels. */
const BREAKPOINT = { sm: 640, lg: 1024 } as const;

const ARROW_CLASS =
  "flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-40";

export default function ProductSlider({
  title,
  products,
  viewAllHref = "/products",
}: ProductRowLayoutProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  /*
   * Which ends the row is sitting at. Both true when every card already fits,
   * which is how a row that cannot scroll disables both arrows — Swiper reports
   * a locked row as simultaneously at its beginning and at its end.
   */
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  /*
   * Re-read from the instance rather than tracked by hand: the answer changes
   * when the shopper slides the row, when the viewport crosses a breakpoint and
   * changes how many cards fit, and when the list changes. Returning the SAME
   * object when nothing moved is what keeps `onUpdate` — which Swiper fires on
   * its own re-renders — from looping.
   */
  const syncEdges = (instance: SwiperInstance) =>
    setEdges((current) =>
      current.atStart === instance.isBeginning && current.atEnd === instance.isEnd
        ? current
        : { atStart: instance.isBeginning, atEnd: instance.isEnd },
    );

  return (
    <section className="container-px site-container py-8">
      {/*
        THREE ITEMS IN ONE WRAPPING ROW, not a title beside a grouped pair.
        Grouping the link and the arrows in a div is what put them BOTH on the
        second line on a phone, left-aligned under the heading, leaving the
        space beside the heading empty — so the row read as two ragged
        left-aligned lines rather than as a heading with its controls.

        The arrows are auto-margined to the right edge instead, at every width.
        Below `sm` that lands them beside the heading and the link takes a line
        of its own (`w-full`); at `sm` and up `order` puts the link back in
        front of them and the two auto margins collapse to one gap, which is
        the arrangement this row has always had on a desktop. The heading's own
        width is what decides whether the arrows fit beside it, so nothing here
        assumes a title length.

        `justify-between` is gone deliberately: an auto margin absorbs the free
        space first, so leaving it would be a rule that never applies.
      */}
      <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-3">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>

        <Link
          href={viewAllHref}
          className="order-2 w-full text-sm font-semibold text-brand hover:underline sm:order-1 sm:ms-auto sm:w-auto"
        >
          See all products
        </Link>

        <div className="order-1 ms-auto flex shrink-0 gap-2 sm:order-2">
          <button
            type="button"
            aria-label={`Previous ${title.toLowerCase()}`}
            disabled={edges.atStart}
            onClick={() => swiper?.slidePrev()}
            className={ARROW_CLASS}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Next ${title.toLowerCase()}`}
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
        aria-label={title}
      >
        {products.map((product) => (
          /*
           * EQUAL HEIGHTS, the way the grid gets them for free.
           *
           * A grid row stretches every cell to the tallest, so in `GRID` a card
           * whose name wraps to two lines never leaves its neighbours shorter.
           * Swiper's wrapper is a flex row and does the same for the SLIDES —
           * but only when a slide's height is `auto` (`!h-auto`; Swiper sets
           * `100%`), and the stretched box is the slide, not the card inside it.
           *
           * `!flex` makes the slide a flex container so its one child stretches
           * to the slide's height, and `[&>div]:flex-1` gives that child the
           * slide's width, which a flex item does not take by default. The card's
           * root is a `div` here, where the category tile's is an `a` — the
           * selector differs from the category slider's for that reason and not
           * by accident. Done here rather than with `h-full` on the card, because
           * the card is shared verbatim with the grid and every other listing,
           * and its markup must not change.
           */
          <SwiperSlide key={product.id} className="!flex !h-auto [&>div]:flex-1">
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
