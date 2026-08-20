import Image from "next/image";
import Link from "next/link";
import { heroSlides, sideBanners, promoTile } from "@/data/content";

export default function Hero() {
  const slide = heroSlides[0];

  return (
    <section className="mx-auto max-w-346 py-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl bg-[#f2efe9] lg:col-span-2">
          <div className="grid grid-cols-1 items-center gap-6 p-8 sm:grid-cols-2 sm:p-12">
            <div>
              <p className="mb-3 text-sm font-medium text-gray-600">{slide.eyebrow}</p>
              <h1 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                {slide.title}
              </h1>
              <p className="mt-4 text-sm text-gray-600">
                Starting <span className="text-lg font-bold text-sale">{slide.price}</span>
              </p>
              <Link
                href={slide.href}
                className="mt-6 inline-block rounded bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Shop Now
              </Link>
            </div>
            <div className="relative h-56 sm:h-72">
              <Image src={slide.image} alt={slide.title} fill className="object-contain" priority />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {sideBanners.map((b) => (
            <Link
              key={b.id}
              href={b.href}
              className="relative flex flex-1 items-center overflow-hidden rounded-xl bg-[#eef1fb] p-6"
            >
              <div className="z-10 max-w-[60%]">
                <p className="text-xs text-gray-500">{b.eyebrow}</p>
                <p className="mt-1 text-base font-bold text-gray-900">{b.title}</p>
              </div>
              <div className="absolute right-0 top-0 h-full w-28">
                <Image src={b.image} alt={b.title} fill className="object-cover" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Link
        href={promoTile.href}
        className="relative mt-4 flex items-center overflow-hidden rounded-xl bg-[#eaf3ec] p-8"
      >
        <div className="z-10">
          <p className="text-sm text-gray-500">{promoTile.eyebrow}</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">{promoTile.title}</h2>
          <p className="mt-2 text-sm text-gray-600">
            Starting <span className="font-semibold text-sale">{promoTile.price}</span>
          </p>
        </div>
        <div className="absolute -right-6 top-0 h-full w-64 sm:w-80">
          <Image src={promoTile.image} alt={promoTile.title} fill className="object-contain" />
        </div>
      </Link>
    </section>
  );
}
