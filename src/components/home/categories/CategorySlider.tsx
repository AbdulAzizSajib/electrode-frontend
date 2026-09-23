"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

import CategoryTile from "@/components/home/categories/CategoryTile";
import type { CategoriesLayoutProps } from "@/components/home/categories/types";

/**
 * The category tiles in one horizontal row that the shopper scrolls sideways.
 *
 * A Client Component for the same reason `HeroSlider` is: Swiper needs the
 * browser and the category fetch does not, so the fetch stays in
 * `FeaturedCategories` and this receives the list as props. Swiper renders its
 * initial markup on the server, so the row is in the HTML and does not pop in.
 *
 * ── The three numbers below MUST MATCH the grid ───────────────────────────
 *
 * `CategoryGridLayout` is `grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7`:
 * three, four and seven tiles across at Tailwind's `sm` (640px) and `lg`
 * (1024px), 16px apart. `slidesPerView` and `spaceBetween` are those same
 * figures, so a tile is the SAME WIDTH in both layouts at every viewport and
 * switching reads as a rearrangement, not as a different section. Nothing in
 * either test suite can measure this — jsdom does no layout — so it is held by
 * these constants being the only place the numbers appear on this side, and by
 * a human comparing the two in a browser.
 *
 * ── No autoplay, no loop, no pagination ───────────────────────────────────
 *
 * Categories are navigation, not promotion. The hero's slides autoplay because
 * motion earns attention for artwork; a row of LINKS that slides under the
 * pointer as a shopper reaches for one is a mis-click waiting to happen. No
 * loop because a shopper who reaches the end of fourteen categories should be
 * able to tell they have. The arrows beside the heading are the visible control
 * the spec requires; they sit outside the row so they never overlay a tile.
 *
 * See server/openspec/changes/add-featured-categories-layout, design.md Decision 4.
 */

/** Tiles across, per breakpoint — the grid's `grid-cols-3 sm:grid-cols-4 lg:grid-cols-7`. */
const COLUMNS = { base: 3, sm: 4, lg: 7 } as const;
/** The grid's `gap-4`, in pixels. */
const GAP = 16;
/** Tailwind's `sm` and `lg` breakpoints, in pixels. */
const BREAKPOINT = { sm: 640, lg: 1024 } as const;

export default function CategorySlider({ title, categories }: CategoriesLayoutProps) {
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
    <section className="container-px site-container pb-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        <div className="flex shrink-0 gap-2">
          <button
            ref={prevRef}
            type="button"
            aria-label="Previous categories"
            className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-40"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            ref={nextRef}
            type="button"
            aria-label="Next categories"
            className="flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-40"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
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
        {categories.map((cat) => (
          /*
           * EQUAL HEIGHTS, the way the grid gets them for free.
           *
           * A grid row stretches every cell to the tallest, so in `GRID` a
           * category whose name wraps to two lines never leaves its neighbours
           * shorter. Swiper's wrapper is a flex row and does the same for the
           * SLIDES — but only when a slide's height is `auto` (`!h-auto`; Swiper
           * sets `100%`), and the stretched box is the slide, not the tile
           * inside it. The tile is a block child and keeps its own height, so
           * three tiles on a phone ended at three different lines while their
           * slides were all the same height.
           *
           * `!flex` makes the slide a flex container, so its one child — the
           * tile's `<a>` — is a flex item and stretches to the slide's height;
           * `[&>a]:flex-1` gives it the slide's width, which a flex item does
           * not take by default. Done here rather than with `h-full` on the
           * tile, because the tile is shared with the grid verbatim and the
           * grid's markup must not change.
           */
          <SwiperSlide key={cat.slug} className="!flex !h-auto [&>a]:flex-1">
            <CategoryTile category={cat} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
