import HeroSlider from "@/components/home/HeroSlider";
import HeroTile from "@/components/home/hero/HeroTile";
import type { HeroLayoutProps } from "@/components/home/hero/types";

/**
 * Slider on the left, one large square tile on the right.
 *
 * The default layout's hero with the right column collapsed to a single image:
 * one promotion beside the slider instead of three. For a shop whose products
 * photograph large — a handbag, a single hero product — where three competing
 * tiles fragment the one thing above the fold worth looking at.
 *
 * ── Geometry, for the admin mirror ────────────────────────────────────────
 *
 *   row         = contentWidth - 64      (container-px at lg, both sides)
 *   gap         = 16                     (gap-4)
 *   side column = 0.43 * row
 *   tile        = side column wide, SQUARE
 *   slider      = row - side column - gap, height = the tile's
 *
 * SQUARE, NOT PORTRAIT, and that is a sizing decision rather than a taste one.
 * At a 1440 content width the column is 592px, so a square tile makes this hero
 * 592px tall against the default layout's 579 — the page below it barely moves
 * when a merchant switches. A 3:4 portrait tile would be 789px, pushing the
 * first product row most of a screen further down and leaving the slider beside
 * it almost square, which is the wrong shape for wide banner artwork.
 *
 * Reads HERO_SLIDER and the FIRST HERO_SIDE banner. Does not read HERO_PROMO —
 * a merchant's promo artwork stays on file and renders again untouched if they
 * return to a layout that uses it.
 *
 * The admin's `hero-slots.ts` derives its upload guidance from these ratios.
 * Change one here and change it there.
 */
export default function HeroSplitOne({ slides, sideBanners, sizes }: HeroLayoutProps) {
  const [tile] = sideBanners;

  return (
    <section className="container-px site-container py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {slides.length > 0 && (
          /*
           * Same two sources of height as the default layout, and for the same
           * reason: the slider is sized in percentages and would collapse
           * against an `auto` parent. Stacked it gets 4:3; side by side
           * `flex-1` stretches it to the square tile's height, so both columns
           * share a bottom edge at every content width.
           */
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-[#f2efe9] lg:aspect-auto lg:min-w-0 lg:flex-1">
            <HeroSlider slides={slides} sizes={sizes.slider} />
          </div>
        )}

        {tile && (
          <div className="w-full lg:w-[43%] lg:flex-none">
            <HeroTile
              banner={tile}
              ratio="aspect-square"
              sizes={sizes.side}
              tint="bg-[#eef1fb]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
