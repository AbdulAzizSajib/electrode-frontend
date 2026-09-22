"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation, Autoplay } from "swiper/modules";

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
   * Render `mobileImage` below `lg` for slides that have one. Off by default:
   * the two layouts with a left-hand slider show it at 4:3 when stacked, which
   * needs no separate crop.
   */
  useMobileArtwork?: boolean;
}) {
  return (
    <Swiper
      pagination={{ dynamicBullets: true }}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      // Looping a single slide clones it for no benefit, and Swiper warns.
      loop={slides.length > 1}
      modules={[Pagination, Navigation, Autoplay]}
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

        /*
         * TWO SOURCES, and only when there is genuinely a second one to show.
         * Next's own art-direction guidance is `getImageProps()` into a
         * `<picture>`, which cannot be used here: it needs explicit width and
         * height, and every box in this hero is a ratio the slide fills with
         * `fill`. So the two are rendered as siblings and hidden by breakpoint.
         *
         * That is safe because `loading` defaults to `lazy`, so the browser
         * fetches only the one its media query actually shows — the same reason
         * Next's light/dark example works. It is also why the first slide gets
         * `fetchPriority` here instead of the eager preload below: an eager
         * hint would defeat the laziness and pull down BOTH files.
         */
        const hasMobileArtwork = useMobileArtwork && slide.mobileImage !== null;

        return (
          <SwiperSlide key={slide.id}>
            <Link href={slide.href} className="relative block h-full w-full">
              {hasMobileArtwork ? (
                <>
                  <Image
                    {...common}
                    alt={slide.title}
                    src={slide.mobileImage as string}
                    className={`${common.className} lg:hidden`}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                  <Image
                    {...common}
                    alt={slide.title}
                    src={slide.image}
                    className={`${common.className} hidden lg:block`}
                    fetchPriority={index === 0 ? "high" : "auto"}
                  />
                </>
              ) : (
                <Image
                  {...common}
                  alt={slide.title}
                  src={slide.image}
                  // Only the first slide is above the fold; preloading the rest
                  // would compete with it for bandwidth.
                  priority={index === 0}
                />
              )}
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
