import Image from "next/image";
import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import { getBannersByPlacement } from "@/services/banner";

/**
 * The homepage hero: a slider on the left, two side tiles and a wide promo tile
 * on the right. All three slots are merchant-managed banners, keyed by their
 * `placement` — HERO_SLIDER, HERO_SIDE, HERO_PROMO.
 *
 * Slots render independently: an empty placement collapses to nothing rather
 * than blocking the rest, so a merchant who has only configured the slider
 * still gets a usable hero.
 */
export default async function Hero() {
  const banners = await getBannersByPlacement();

  const slides = banners.HERO_SLIDER ?? [];
  // The layout is a two-column grid — extra side banners would break the row.
  const sideBanners = (banners.HERO_SIDE ?? []).slice(0, 2);
  const [promoTile] = banners.HERO_PROMO ?? [];

  // Nothing configured at all: skip the hero entirely rather than render an
  // empty 550px band above the fold.
  if (!slides.length && !sideBanners.length && !promoTile) return null;

  return (
    <section className="container-px mx-auto max-w-346 py-4">
      <div className="flex flex-col gap-4 lg:flex-row">
        {slides.length > 0 && (
          <div className="relative overflow-hidden rounded-sm bg-[#f2efe9] w-full ">
            <HeroSlider slides={slides} />
          </div>
        )}

        <div className="flex w-full flex-col gap-4 lg:w-[570px] lg:flex-none">
          {sideBanners.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {sideBanners.map((b) => (
                <Link
                  key={b.id}
                  href={b.href}
                  className="group relative flex h-[180px] w-full flex-col items-center justify-center overflow-hidden rounded-sm bg-[#eef1fb]  transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:h-[265px] lg:w-[275px]"
                >
                  <Image
                    src={b.image}
                    alt={b.title}
                    width={500}
                    height={500}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          )}

          {promoTile && (
            <Link
              href={promoTile.href}
              className="group relative flex h-[220px] w-full items-center overflow-hidden rounded-sm bg-[#eaf3ec]  transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:h-[265px] lg:w-[570px]"
            >
              <Image
                src={promoTile.image}
                alt={promoTile.title}
                fill
                className="object-contain transition-transform duration-300"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
