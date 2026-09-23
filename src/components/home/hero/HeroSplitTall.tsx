import HeroSlider from "@/components/home/HeroSlider";
import HeroTile from "@/components/home/hero/HeroTile";
import type { HeroLayoutProps } from "@/components/home/hero/types";

/**
 * A wide slider on the left and one tall tile filling the right third.
 *
 * The two-message hero: one rotating story and one standing promotion beside
 * it, with nothing else competing. It reads the slider and the promo slot and
 * leaves the two side tiles on file, unrendered.
 *
 * ── Geometry, for the admin mirror ────────────────────────────────────────
 *
 *   row    = contentWidth - 64           (container-px at lg, both sides)
 *   gap    = 16                          (gap-4)
 *   box    = full row, ratio 19/8 at lg  (the SAME box every layout paints)
 *   tile   = row / 3 wide, ratio 19/24   (= exactly the box's height)
 *   slider = row - tile - gap wide, stretches to the tile's height
 *
 * At a 1440 content width that is a 901x579 slider beside a 459x579 tile —
 * 579px of hero, the same as every other layout.
 *
 * THE TILE'S RATIO IS THE BOX'S HEIGHT, BY CONSTRUCTION. A third of the row at
 * 19:24 is (row / 3) x (24 / 19) = row x 8 / 19 tall, which is the shared box
 * exactly — so this is the one layout whose height matches SPLIT_THREE's to
 * the pixel rather than to within a rounding gap. The slider stretches to it
 * through `lg:items-stretch`, the same rule every split layout uses.
 *
 * PORTRAIT AT EVERY BREAKPOINT. On a phone the tile is full width and 19:24,
 * which is tall — about 490px on a 390px screen. It is kept rather than
 * cropped to 4:3 because the merchant cut portrait artwork for this slot, and
 * a 4:3 crop would discard almost half of it on the device most shoppers use.
 *
 * The admin's `hero-slots.ts` derives its upload guidance from these ratios.
 * Change one here and change it there.
 */
export default function HeroSplitTall({ slides, promoTile, sizes }: HeroLayoutProps) {
  return (
    <section className="container-px site-container py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {slides.length > 0 && (
          /*
           * Beside the tile, `flex-1` stretches the slider to the tile's
           * height. WITHOUT a tile there is nothing to stretch to and the
           * percentage-sized slider inside would collapse, so the slider then
           * declares the box's ratio itself and paints the same height alone.
           */
          <div
            className={
              promoTile
                ? "relative aspect-4/3 w-full overflow-hidden rounded-sm bg-[#f2efe9] lg:aspect-auto lg:min-w-0 lg:flex-1"
                : "relative aspect-4/3 w-full overflow-hidden rounded-sm bg-[#f2efe9] lg:aspect-19/8"
            }
          >
            <HeroSlider slides={slides} sizes={sizes.slider} />
          </div>
        )}

        {promoTile && (
          /*
           * A third of the row; the gap comes out of the slider's share.
           *
           * `flex` IS LOAD-BEARING. `HeroTile` renders an `<a>`, which is
           * `display: inline`, and an inline element ignores `aspect-ratio` and
           * `width`. In the other layouts the tile sits directly in a grid or a
           * flex column, which blockifies it. Inside a plain `<div>` it stays
           * inline: zero height, so this column is zero height, so the slider
           * beside it — which stretches to this column — is zero height too,
           * and the whole hero renders as nothing at all. Making the wrapper a
           * flex container blockifies the tile the same way the others do.
           */
          <div className="flex w-full lg:w-1/3 lg:flex-none">
            <HeroTile
              banner={promoTile}
              ratio="aspect-19/24"
              sizes={sizes.promo}
              tint="bg-[#eaf3ec]"
            />
          </div>
        )}
      </div>
    </section>
  );
}
