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
                  className="group relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-sm bg-[#eef1fb]  transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:aspect-auto lg:h-66.25 lg:w-68.75"
                >
                  <Image
                    src={b.image}
                    alt={b.title}
                    width={500}
                    height={500}
                    // Two per row below `lg`, a fixed 275px column above it.
                    sizes="(min-width: 1024px) 275px, 50vw"
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          )}

          {promoTile && (
            <Link
              href={promoTile.href}
              // `fill` needs a sized parent, so this keeps a ratio rather than
              // going auto-height: roughly the 570x265 it settles into on
              // desktop, which stops it towering over the phone viewport.
              className="group relative flex aspect-570/265 w-full items-center overflow-hidden rounded-sm bg-[#eaf3ec]  transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 lg:aspect-auto lg:h-66.25 lg:w-142.5"
            >
              <Image
                src={promoTile.image}
                alt={promoTile.title}
                fill
                sizes="(min-width: 1024px) 570px, 100vw"
                className="object-contain transition-transform duration-300"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
