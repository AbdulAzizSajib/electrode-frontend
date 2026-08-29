"use client"
import Image from "next/image";
import Link from "next/link";
import { heroSlides, sideBanners, promoTile } from "@/data/content";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

export default function Hero() {
  return (
    <section className="container-px mx-auto max-w-346 py-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="relative overflow-hidden rounded-sm bg-[#f2efe9] w-full ">
          <Swiper
            pagination={{ dynamicBullets: true }}
            // navigation
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop
            modules={[Pagination, Navigation, Autoplay]}
            className="w-full h-full"
          >
            {heroSlides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="grid h-full grid-cols-1 items-center gap-6 p-8 sm:grid-cols-[1fr_1.4fr] lg:p-12">
                  <div className=" w-full h-full flex flex-col items-start justify-center gap-2">
                    <p className="mb-3 text-sm font-medium text-gray-600">{slide.eyebrow}</p>
                    <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-sm text-gray-600">
                      Starting <span className="text-lg font-bold text-sale">{slide.price}</span>
                    </p>
                    <Link
                      href={slide.href}
                      className="mt-6 inline-block rounded bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    >
                      Shop Now
                    </Link>
                  </div>
                  <div className="w-100 h-100 ">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      height={500}
                      width={500}
                      className={`object-contain  w-full h-full lg:${slide.scale} `}
                      priority
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[570px] lg:flex-none">
          <div className="grid grid-cols-2 gap-4">
            {sideBanners.map((b) => (
              <Link
                key={b.id}
                href={b.href}
                className="group relative flex h-[180px] w-full flex-col overflow-hidden rounded-sm bg-[#eef1fb] p-4 transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:h-[265px] lg:w-[270px]"
              >
                <div className="z-10 text-center">
                  <p className="text-xs text-[#5c6b8a]">{b.eyebrow}</p>
                  <p className="mt-1 text-sm font-bold text-gray-900">{b.title}</p>
                </div>
                <div className="relative mt-2 h-24 w-full">
                  <Image
                    src={b.image}
                    alt={b.title}
                   width={500}
                    height={500}
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            ))}
          </div>

          <Link
            href={promoTile.href}
            className="group relative flex h-[220px] w-full items-center overflow-hidden rounded-sm bg-[#eaf3ec] p-6 transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:h-[265px] lg:w-[570px]"
          >
            <div className="z-10 max-w-[55%]">
              <p className="text-xs text-[#4f6e5a]">{promoTile.eyebrow}</p>
              <h2 className="mt-1 text-lg font-bold leading-snug text-gray-900">
                {promoTile.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Starting <span className="font-semibold text-sale">{promoTile.price}</span>
              </p>
              <span className="mt-2 inline-block text-xs font-semibold text-brand underline underline-offset-2">
                Shop Now
              </span>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/2">
              <Image
                src={promoTile.image}
                alt={promoTile.title}
                fill
                className="object-contain transition-transform duration-300 scale-125"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}