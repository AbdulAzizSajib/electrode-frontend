import Image from "next/image";
import Link from "next/link";
import { getBannersByPlacement } from "@/services/banner";

/**
 * The three-across promo strip below the hero.
 *
 * A ratio rather than the fixed `h-56` it had, for the reason spelled out in
 * `Hero.tsx`: the tiles are a third of the content width, so a fixed height
 * meant their shape changed every time the merchant changed that width, and
 * `object-cover` cropped a different part of the artwork at each one. 2:1 is
 * what `h-56` came to at the width this shipped with.
 */
export default async function MidBanners() {
  const banners = await getBannersByPlacement();
  const midBanners = banners.MID ?? [];
  return (
    <section className="container-px  site-container py-8  ">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {midBanners.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className="relative aspect-2/1 overflow-hidden rounded-xl bg-gray-100"
          >
            <Image
              src={b.image}
              alt={b.title}
              fill
              sizes="(min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
