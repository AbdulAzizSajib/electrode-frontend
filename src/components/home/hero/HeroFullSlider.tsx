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
 *   slider = full row, ratio 3/1 at lg; 4/3 stacked
 *
 * At a 1440 content width that is 1376x459. Wide enough to read as a banner,
 * short enough that the first product row is still above the fold on a laptop.
 *
 * USES THE MERCHANT'S MOBILE ARTWORK. 3:1 artwork stacked into a phone-width
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
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-sm bg-[#f2efe9] lg:aspect-3/1">
        <HeroSlider slides={slides} sizes={sizes.slider} useMobileArtwork />
      </div>
    </section>
  );
}
