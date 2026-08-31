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
 */
export default function HeroSlider({ slides }: { slides: Banner[] }) {
  return (
    <Swiper
      pagination={{ dynamicBullets: true }}
      autoplay={{ delay: 6000, disableOnInteraction: false }}
      // Looping a single slide clones it for no benefit, and Swiper warns.
      loop={slides.length > 1}
      // Slides are only as tall as their image below `lg`, and two banners can
      // have different ratios. Without this Swiper would freeze the wrapper at
      // the tallest one, reintroducing the empty band under the shorter slide.
      autoHeight
      modules={[Pagination, Navigation, Autoplay]}
      className="h-full w-full"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.id}>
          <Link href={slide.href} className="block">
            {/*
              No fixed height below `lg`: a banner is far wider than it is tall,
              so a phone-width slide only needs ~200px. Pinning 550px there left
              the image letterboxed inside empty bands. The box follows the
              image's own ratio instead, and only takes a set height on desktop
              where it has to line up with the side tiles.
            */}
            <div className="relative w-full bg-[#f2efe9] lg:h-137.5">
              <Image
                src={slide.image}
                alt={slide.title}
                height={550}
                width={1200}
                // `w-full h-auto` lets the intrinsic ratio set the height on
                // mobile; `lg:h-full` hands control back to the container.
                className="h-auto w-full object-contain lg:h-full"
                // Below `lg` the slider is the full viewport width; above it,
                // it's what remains beside the 570px side column.
                sizes="(min-width: 1024px) calc(100vw - 620px), 100vw"
                // Only the first slide is above the fold; preloading the rest
                // would compete with it for bandwidth.
                priority={index === 0}
              />
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
