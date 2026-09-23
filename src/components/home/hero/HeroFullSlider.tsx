import HeroSlider from "@/components/home/HeroSlider";
import type { HeroLayoutProps } from "@/components/home/hero/types";

/**
 * One wide slider across the content width, and nothing else.
 *
 * The editorial hero: a single image with nothing competing against it. The
 * only layout of the four that reads one slot, which is also what makes it the
 * clearest case of the rule that a layout never destroys artwork — a store on
 * this one keeps its tiles on file, unrendered, and gets them back untouched on
 * switching away.
 *
 * ── Geometry, for the admin mirror ────────────────────────────────────────
 *
 *   row    = contentWidth - 64           (container-px at lg, both sides)
 *   slider = full row, ratio 19/8 at lg; 4/3 stacked
 *
 * At a 1440 content width that is 1376x579.
 *
 * WHY 19:8 AND NOT 3:1. Every hero layout paints the SAME outer box — the one
 * `HeroSplitThree` paints, whose height is its side column: two square tiles
 * over a 43:20 promo, 0.415 x row + 8px. Only the arrangement inside differs.
 * A merchant switching layouts should see the artwork rearrange, not the whole
 * page below the hero jump up or down by 120px. 19:8 is that column's ratio to
 * within 4px at every content width from 1140 to 1920 (the 8px gap is what
 * keeps it from being an exact ratio), and it is the one number the other two
 * layouts share. Change it in `hero-slots.ts` too.
 *
 * USES THE MERCHANT'S MOBILE ARTWORK. 19:8 artwork stacked into a phone-width
 * column is a strip, and `object-cover` would crop it to its middle — which is
 * where a product usually is not. A merchant who uploads nothing extra still
 * gets a working hero from the main artwork; one who does gets a good one.
 *
 * The admin's `hero-slots.ts` derives its upload guidance from these ratios.
 * Change one here and change it there.
 */
export default function HeroFullSlider({ slides, sizes }: HeroLayoutProps) {
  if (slides.length === 0) return null;

  return (
    <section className="container-px site-container py-4">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-[#f2efe9] lg:aspect-19/8">
        <HeroSlider slides={slides} sizes={sizes.slider} useMobileArtwork />
      </div>
    </section>
  );
}
