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
               <div className="relative h-[550px] w-full bg-[#f2efe9]">
                  
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      height={550}
                      width={550}
                      className="object-contain   w-full h-full"
                      priority
                    />
                  </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-[570px] lg:flex-none">
  
  {/* Side Banners - Gap যোগ করা হয়েছে */}
  <div className="grid grid-cols-2 gap-4">  {/* gap-0 পরিবর্তে gap-4 */}
    {sideBanners.map((b) => (
      <Link
        key={b.id}
        href={b.href}
        className="group relative flex h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-sm bg-[#eef1fb]  transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:h-[265px] lg:w-[275px]"
      >
        {/* Text - উপরে */}
        {/* <div className="z-10 text-center">
          <p className="text-xs text-[#5c6b8a]">{b.eyebrow}</p>
          <p className="mt-1 text-sm font-bold text-gray-900">{b.title}</p>
        </div> */}
        
        {/* Image - নিচে, কেন্দ্রে */}
        {/* <div className="relative mt-2 h-24 w-full flex-1"> */}
          <Image
            src={b.image}
            alt={b.title}
            width={500}
            height={500}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        {/* </div> */}
      </Link>
    ))}
  </div>

  {/* Promo Tile - নিচে */}
  <Link
    href={promoTile.href}
    className="group relative flex h-[220px] w-full items-center overflow-hidden rounded-sm bg-[#eaf3ec]  transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:h-[265px] lg:w-[570px]"
  >
    {/* <div className="z-10 max-w-[55%]">
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
    <div className="absolute right-0 top-0 h-full w-1/2"> */}
      <Image
        src={promoTile.image}
        alt={promoTile.title}
        fill
        className="object-contain transition-transform duration-300"
      />
    {/* </div> */}
  </Link>
</div>
      </div>
    </section>
  );
}