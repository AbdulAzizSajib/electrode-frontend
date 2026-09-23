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
 *   box    = full row, ratio 19/8 at lg  (the SAME box every layout paints)
 *   tile   = (row - 2 * gap) / 3, ratio 43/20
 *   slider = full row, height = box - gap - tile   (stretches; no ratio of its own)
 *
 * At a 1440 content width that is a 1376x355 panel over three 448x208 tiles —
 * 579px of hero, the same as every other layout.
 *
 * THE OUTER BOX IS FIXED AND THE SLIDER ABSORBS. Every layout paints the box
 * `HeroSplitThree` paints (see HeroFullSlider for the 19:8 figure), so a
 * merchant switching layouts sees the artwork rearrange, not the page below
 * jump. This layout fits a whole extra row into that box, so something had to
 * give: the tiles keep a fixed ratio and the slider takes what is left — the
 * same rule `HeroSplitThree` applies to ITS slider beside the side column.
 *
 * The tiles are 43:20, the same shape as `HeroSplitThree`'s promo tile, so a
 * merchant's promo artwork renders uncropped in both layouts.
 *
 * TILE ORDER IS LEFT TO RIGHT: the two HERO_SIDE banners, then HERO_PROMO. A
 * merchant reading the admin's slot grid sees them in the same order.
 *
 * Uses the merchant's mobile artwork for the panel, for the reason given in
 * HeroFullSlider. The tiles are 43:20 and need no separate crop.
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
      {/* The shared 19:8 box at lg; a plain column when stacked on a phone. */}
      <div className="flex flex-col gap-4 lg:aspect-19/8">
        {slides.length > 0 && (
          // `lg:flex-1 lg:min-h-0` and no ratio at lg: the panel is whatever
          // height the tile row leaves in the box. `min-h-0` matters — without
          // it a flex child refuses to shrink below its content and the row of
          // tiles is pushed out of the box.
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-[#f2efe9] lg:aspect-auto lg:min-h-0 lg:flex-1">
            <HeroSlider slides={slides} sizes={sizes.slider} useMobileArtwork />
          </div>
        )}

        {tiles.length > 0 && (
          // One column on a phone rather than three 100px-wide slivers.
          // `lg:shrink-0` so the tiles keep their ratio and the slider absorbs.
          <div className="grid grid-cols-1 gap-4 lg:shrink-0 lg:grid-cols-3">
            {tiles.map(({ banner, sizes: tileSizes, tint }) => (
              <HeroTile
                key={banner.id}
                banner={banner}
                ratio="aspect-43/20"
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
