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
      modules={[Pagination, Navigation, Autoplay]}
      className="w-full h-full"
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={slide.id}>
          <Link href={slide.href} className="block">
            <div className="relative h-[550px] w-full bg-[#f2efe9]">
              <Image
                src={slide.image}
                alt={slide.title}
                height={550}
                width={550}
                className="object-contain w-full h-full"
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
