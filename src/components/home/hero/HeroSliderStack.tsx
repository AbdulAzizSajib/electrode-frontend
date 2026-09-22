import HeroSlider from "@/components/home/HeroSlider";
import HeroTile from "@/components/home/hero/HeroTile";
import type { HeroLayoutProps } from "@/components/home/hero/types";

/**
 * A full-width slider with a row of three tiles beneath it.
 *
 * The highest-capacity layout: one large statement panel plus three shortcuts
 * under it — New In, Sale, a category. It reads all three hero slots, so no
 * artwork a merchant has uploaded goes unused.
 *
 * ── Geometry, for the admin mirror ────────────────────────────────────────
 *
 *   row    = contentWidth - 64           (container-px at lg, both sides)
 *   gap    = 16                          (gap-4)
 *   slider = full row, ratio 3/1 at lg; 4/3 stacked
 *   tile   = (row - 2 * gap) / 3, ratio 4/3
 *
 * At a 1440 content width that is a 1376x459 panel over three 448x336 tiles —
 * 811px of hero. The tallest of the four, which is the trade this layout makes:
 * it puts four promotions above the fold and pushes the first product row down.
 *
 * TILE ORDER IS LEFT TO RIGHT: the two HERO_SIDE banners, then HERO_PROMO. A
 * merchant reading the admin's slot grid sees them in the same order.
 *
 * Uses the merchant's mobile artwork for the panel, for the reason given in
 * HeroFullSlider. The tiles are 4:3 and need no separate crop.
 *
 * The admin's `hero-slots.ts` derives its upload guidance from these ratios.
 * Change one here and change it there.
 */
export default function HeroSliderStack({
  slides,
  sideBanners,
  promoTile,
  sizes,
}: HeroLayoutProps) {
  // Built left to right, so an empty slot closes the gap rather than leaving a
  // hole in the row — the same collapse rule every other layout follows.
  const tiles = [
    ...sideBanners.map((banner) => ({ banner, sizes: sizes.side, tint: "bg-[#eef1fb]" })),
    ...(promoTile ? [{ banner: promoTile, sizes: sizes.promo, tint: "bg-[#eaf3ec]" }] : []),
  ];

  return (
    <section className="container-px site-container py-4">
      <div className="flex flex-col gap-4">
        {slides.length > 0 && (
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-[#f2efe9] lg:aspect-3/1">
            <HeroSlider slides={slides} sizes={sizes.slider} useMobileArtwork />
          </div>
        )}

        {tiles.length > 0 && (
          // One column on a phone rather than three 100px-wide slivers.
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {tiles.map(({ banner, sizes: tileSizes, tint }) => (
              <HeroTile
                key={banner.id}
                banner={banner}
                ratio="aspect-4/3"
                sizes={tileSizes}
                tint={tint}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
