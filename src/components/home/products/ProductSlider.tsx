"use client";
import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

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
 * See server/openspec/changes/add-product-slider-and-card-quantity, design.md
 * Decision 3.
 */

/** Cards across, per breakpoint — the grid's `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`. */
const COLUMNS = { base: 2, sm: 3, lg: 6 } as const;
/** The grid's `gap-x-5`, in pixels. NOT the categories' 16 — the two grids differ. */
const GAP = 20;
/** Tailwind's `sm` and `lg` breakpoints, in pixels. */
const BREAKPOINT = { sm: 640, lg: 1024 } as const;

export default function ProductSlider({
  title,
  products,
  viewAllHref = "/products",
}: ProductRowLayoutProps) {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Swiper reads its navigation elements at init, before React has attached
  // the refs, so they are handed over in `onBeforeInit` rather than as props —
  // and `navigation` below is the bare boolean, which Swiper expands to the
  // module's default object before this runs. Reading `ref.current` in the
  // prop instead would be a read during render (which the lint forbids) AND
  // always `null` on the first render, which is the one that initialises.
  const attachNavigation = (swiper: SwiperInstance) => {
    const navigation = swiper.params.navigation;
    if (navigation && typeof navigation !== "boolean") {
      navigation.prevEl = prevRef.current;
      navigation.nextEl = nextRef.current;
    }
  };

  return (
    <section className="container-px site-container py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        <div className="flex items-center gap-4">
          <Link href={viewAllHref} className="text-sm font-semibold text-brand hover:underline">
            See all products
          </Link>
          <div className="flex shrink-0 gap-2">
            <button
              ref={prevRef}
              type="button"
              aria-label={`Previous ${title.toLowerCase()}`}
              className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-40"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              ref={nextRef}
              type="button"
              aria-label={`Next ${title.toLowerCase()}`}
              className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-40"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        slidesPerView={COLUMNS.base}
        spaceBetween={GAP}
        breakpoints={{
          [BREAKPOINT.sm]: { slidesPerView: COLUMNS.sm },
          [BREAKPOINT.lg]: { slidesPerView: COLUMNS.lg },
        }}
        navigation
        onBeforeInit={attachNavigation}
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
