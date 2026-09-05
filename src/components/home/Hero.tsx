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
 *
 * ── Why every size here is a ratio ────────────────────────────────────────
 *
 * This hero used to be pinned in pixels: a 570px right column and a 550px
 * slider height, both measured at the 1384px content width the storefront
 * shipped with. A merchant then changed their content width and only the
 * slider's WIDTH moved, so its box changed shape under artwork cut for the old
 * one — portrait at a narrow width, 2.3:1 at full width, the banner letterboxed
 * inside empty bands either way.
 *
 * So nothing here is a pixel. The right column takes a fixed 43% share of the
 * row — what the old 570px came to inside a 1384px container, so the hero keeps
 * the proportions it was designed at — each tile carries a fixed aspect ratio,
 * and the slider stretches to whatever height that column computes to. Change
 * the content width and every box keeps its shape and only scales, which is
 * what lets a merchant upload one banner per slot and have it fit at 1140px, at
 * 1600px and at full width alike.
 *
 * The admin's `hero-slots.ts` derives its upload guidance from these same three
 * ratios. Change one here and change it there.
 */
export default async function Hero() {
  const banners = await getBannersByPlacement();

  const slides = banners.HERO_SLIDER ?? [];
  // The layout is a two-column grid — extra side banners would break the row.
  const sideBanners = (banners.HERO_SIDE ?? []).slice(0, 2);
  const [promoTile] = banners.HERO_PROMO ?? [];

  // Nothing configured at all: skip the hero entirely rather than render an
  // empty band above the fold.
  if (!slides.length && !sideBanners.length && !promoTile) return null;

  return (
    <section className="container-px site-container py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {slides.length > 0 && (
          /*
           * Two sources of height, one per breakpoint, and both definite — the
           * slider inside is sized in percentages and would collapse against an
           * `auto` parent. Stacked, the 4:3 ratio gives it one; side by side,
           * `flex-1` stretches it to the right column's height, so the two
           * columns' bottom edges line up at every content width without either
           * one being told a pixel value.
           */
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-[#f2efe9] lg:aspect-auto lg:min-w-0 lg:flex-1">
            <HeroSlider slides={slides} />
          </div>
        )}

        {/* 43% of the row — see the note above on why this is a share and not
            the 570px it used to be. */}
        <div className="flex w-full flex-col gap-4 lg:w-[43%] lg:flex-none">
          {sideBanners.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {sideBanners.map((b) => (
                <Link
                  key={b.id}
                  href={b.href}
                  className="group relative aspect-square w-full overflow-hidden rounded-sm bg-[#eef1fb] transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <Image
                    src={b.image}
                    alt={b.title}
                    fill
                    // Half of the 43% column, at both breakpoints — the column
                    // is full-width when the hero stacks.
                    sizes="(min-width: 1024px) 22vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              ))}
            </div>
          )}

          {promoTile && (
            <Link
              href={promoTile.href}
              // 2.15:1, the shape the old fixed 570x265 tile had.
              className="group relative aspect-43/20 w-full overflow-hidden rounded-sm bg-[#eaf3ec] transition-shadow duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <Image
                src={promoTile.image}
                alt={promoTile.title}
                fill
                sizes="(min-width: 1024px) 43vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
