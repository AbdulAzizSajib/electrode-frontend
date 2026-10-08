"use client";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
//
// NO `swiper/css/navigation`, and no `Navigation` module below: this slider has
// never passed a `navigation` prop, so both were dead. The stylesheet was not
// merely unused — a Swiper stylesheet imported anywhere is global, and it is
// what drew the stray chevrons over the category and product rows before those
// two stopped creating navigation elements. See `CategorySlider`.
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Pagination, Autoplay } from "swiper/modules";

import type { Banner } from "@/types/banner";

/**
 * The hero's main slider. Split out from `Hero` so the fetching half stays a
 * Server Component — Swiper needs the browser, the banner fetch does not.
 *
 * Every slide fills the box its layout sized for it, at both breakpoints. That
 * is why there is no `autoHeight` here: it exists to let the wrapper follow
 * each slide's own height, which was needed back when the slide had no height
 * of its own and two banners of different ratios would otherwise share the
 * taller one's box. The slot has a fixed shape now, so the wrapper must not
 * move — `autoHeight` would replace Swiper's `height: 100%` with `auto` and
 * collapse the whole thing.
 *
 * ── Why this takes props it used to hardcode ─────────────────────────────
 *
 * The slider is shared by all four hero layouts, and two things about its
 * `<Image>` are properties of the LAYOUT rather than of the slider:
 *
 *  - `sizes`. It was `"(min-width: 1024px) 57vw, 100vw"`, which is arithmetic
 *    from the default layout's 43/57 split. A full-width slider told it will
 *    paint at 57vw fetches a file about half the width it needs and renders
 *    soft — on the largest element of the page.
 *  - whether the merchant's mobile artwork is used. A layout that paints its
 *    panel at roughly 3:1 stacks into a phone-width strip, and `object-cover`
 *    on a 3:1 source in a taller box crops to the middle of the artwork, which
 *    is where a product usually is not.
 *
 * Both default to the behaviour the slider had, so the default layout renders
 * exactly the markup it rendered before.
 */
export default function HeroSlider({
  slides,
  sizes = "(min-width: 1024px) 57vw, 100vw",
  useMobileArtwork = false,
}: {
  slides: Banner[];
  /** What share of the viewport the panel paints at, in THIS layout. */
  sizes?: string;
  /**
   * Render `mobileImage` below `lg` for slides that have one. Every hero
   * layout passes it: below `lg` all four draw the slider at 4:3, and the
   * desktop artwork (~1.56:1 in the split layouts) loses its sides in that box,
   * so a merchant's mobile crop is always the better picture. The split
   * layouts used to leave it off — the admin still offered the upload there,
   * and it silently never appeared. Slides without one fall back to `image`.
   */
  useMobileArtwork?: boolean;
}) {
  return (
    <Swiper
      pagination={{ dynamicBullets: true }}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      // Looping a single slide clones it for no benefit, and Swiper warns.
      loop={slides.length > 1}
      modules={[Pagination, Autoplay]}
      className="h-full w-full"
    >
      {slides.map((slide, index) => {
        /*
         * Cover, not contain. The slot's ratio is fixed and the admin tells a
         * merchant what it is before they upload, so a correctly cut banner is
         * not cropped at all — and artwork that is slightly off loses a sliver
         * of its edge instead of sitting inside the empty bands `contain` would
         * leave.
         *
         * `alt` is deliberately NOT in here and is repeated at each call site
         * instead: jsx-a11y cannot see a prop arriving through a spread and
         * reports every one of these as missing its alt text.
         */
        const common = { fill: true, className: "object-cover", sizes };

        const isFirst = index === 0;

        /*
         * TWO SOURCES, and only when there is genuinely a second one to show:
         * one `<img>` inside a `<picture>`, with the desktop artwork as a
         * `<source>` for `lg` and up. That is Next's art-direction pattern
         * (`getImageProps`), and it works with `fill` — `getImageProps` shares
         * `<Image>`'s prop handling, `fill` included.
         *
         * It replaces two sibling `<Image>`s hidden by breakpoint. Those had to
         * stay lazy, because an eager hint on both would download both files —
         * so on a phone the LCP image waited for layout before it was even
         * requested. With one `<img>` the browser picks exactly one source, so
         * the first slide can load eagerly at high priority on every screen.
         */
        if (useMobileArtwork && slide.mobileImage) {
          const art = {
            alt: slide.title,
            fill: true,
            sizes,
            loading: isFirst ? ("eager" as const) : ("lazy" as const),
            fetchPriority: isFirst ? ("high" as const) : ("auto" as const),
          };
          const {
            props: { srcSet: desktopSrcSet },
          } = getImageProps({ ...art, src: slide.image });
          const { props: mobile } = getImageProps({ ...art, src: slide.mobileImage });

          return (
            <SwiperSlide key={slide.id}>
              <Link href={slide.href} className="relative block h-full w-full">
                <picture>
                  <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes={sizes} />
                  <img {...mobile} alt={slide.title} className={common.className} />
                </picture>
              </Link>
            </SwiperSlide>
          );
        }

        return (
          <SwiperSlide key={slide.id}>
            <Link href={slide.href} className="relative block h-full w-full">
              <Image
                {...common}
                alt={slide.title}
                src={slide.image}
                // Only the first slide is above the fold; preloading the rest
                // would compete with it for bandwidth. (`preload` is Next 16's
                // name for the deprecated `priority`.)
                preload={isFirst}
              />
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
