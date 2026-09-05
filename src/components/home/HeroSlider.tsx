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
 * Every slide fills the box `Hero` sized for it, at both breakpoints. That is
 * why there is no `autoHeight` here: it exists to let the wrapper follow each
 * slide's own height, which was needed back when the slide had no height of its
 * own and two banners of different ratios would otherwise share the taller
 * one's box. The slot has a fixed shape now, so the wrapper must not move —
 * `autoHeight` would replace Swiper's `height: 100%` with `auto` and collapse
 * the whole thing.
 */
export default function HeroSlider({ slides }: { slides: Banner[] }) {
  return (
    <Swiper
      pagination={{ dynamicBullets: true }}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      // Looping a single slide clones it for no benefit, and Swiper warns.
      loop={slides.length > 1}
      modules={[Pagination, Navigation, Autoplay]}
      className="h-full w-full"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.id}>
          <Link href={slide.href} className="relative block h-full w-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              /*
               * Cover, not contain. The slot's ratio is fixed and the admin
               * tells a merchant what it is before they upload, so a correctly
               * cut banner is not cropped at all — and artwork that is slightly
               * off loses a sliver of its edge instead of sitting inside the
               * empty bands `contain` would leave.
               */
              className="object-cover"
              // Stacked, the slider is the viewport's width; beside the 43%
              // side column it is a little over half of it.
              sizes="(min-width: 1024px) 57vw, 100vw"
              // Only the first slide is above the fold; preloading the rest
              // would compete with it for bandwidth.
              priority={index === 0}
            />
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
