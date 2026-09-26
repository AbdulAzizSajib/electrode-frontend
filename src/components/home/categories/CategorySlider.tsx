"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";

import "swiper/css";

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
 */

/**
 * ── Why the arrows drive Swiper DIRECTLY, and Navigation is gone ──────────
 *
 * This row used Swiper's `Navigation` module with the bare `navigation` prop
 * and handed it the two buttons in `onBeforeInit`. That had two faults, and
 * both of them only showed up on a phone:
 *
 *  1. THE ROW GREW A SECOND PAIR OF ARROWS. `navigation` as a bare boolean
 *     makes `needsNavigation()` true, and swiper/react then renders its OWN
 *     `.swiper-button-prev/next` elements inside the row — which
 *     `swiper/css/navigation` draws as large chevrons floating over the first
 *     and last tile. They were wired to nothing, because `onBeforeInit` had
 *     pointed the module at the buttons beside the heading instead.
 *
 *  2. THE REAL ARROWS STOPPED WORKING BELOW 640px. `onBeforeInit` writes the
 *     elements into `swiper.params` alone. Under the smallest entry in
 *     `breakpoints` nothing matches, so `getBreakpoint()` returns `"max"` and
 *     `setBreakpoint()` restores the whole parameter set from
 *     `swiper.originalParams` — which still names swiper/react's own hidden
 *     elements. The module rebinds to those and the visible buttons go dead.
 *     At `sm` and up a real breakpoint entry applies instead, it carries no
 *     `navigation` key, and the buttons keep working — which is why this read
 *     as "broken on mobile, fine on desktop" rather than as simply broken.
 *
 * Keeping the module would mean patching `originalParams` as well, pinning this
 * row to Swiper's internals. Calling `slidePrev`/`slideNext` on the instance is
 * what the module does anyway, and the disabled state it expressed as a class
 * is here the button's own `disabled` — which also stops a keyboard reaching a
 * control that does nothing.
 *
 * See server/openspec/changes/add-featured-categories-layout, design.md Decision 4.
 */

/** Tiles across, per breakpoint — the grid's `grid-cols-3 sm:grid-cols-4 lg:grid-cols-7`. */
const COLUMNS = { base: 3, sm: 4, lg: 7 } as const;
/** The grid's `gap-4`, in pixels. */
const GAP = 16;
/** Tailwind's `sm` and `lg` breakpoints, in pixels. */
const BREAKPOINT = { sm: 640, lg: 1024 } as const;

const ARROW_CLASS =
  "flex size-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:pointer-events-none disabled:opacity-40";

export default function CategorySlider({ title, categories }: CategoriesLayoutProps) {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  /*
   * Which ends the row is sitting at. Both true when every tile already fits,
   * which is how a row that cannot scroll disables both arrows — Swiper reports
   * a locked row as simultaneously at its beginning and at its end.
   */
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  /*
   * Re-read from the instance rather than tracked by hand, because the answer
   * changes for three unrelated reasons: the shopper slid the row, the viewport
   * crossed a breakpoint and changed how many tiles fit, or the list changed.
   * Returning the SAME object when nothing moved is what keeps `onUpdate` —
   * which Swiper fires on its own re-renders — from looping.
   */
  const syncEdges = (instance: SwiperInstance) =>
    setEdges((current) =>
      current.atStart === instance.isBeginning && current.atEnd === instance.isEnd
        ? current
        : { atStart: instance.isBeginning, atEnd: instance.isEnd },
    );

  return (
    <section className="container-px site-container pb-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{title}</h2>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Previous categories"
            disabled={edges.atStart}
            onClick={() => swiper?.slidePrev()}
            className={ARROW_CLASS}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next categories"
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
