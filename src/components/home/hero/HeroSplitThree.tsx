import HeroSlider from "@/components/home/HeroSlider";
import HeroTile from "@/components/home/hero/HeroTile";
import type { HeroLayoutProps } from "@/components/home/hero/types";

/**
 * The default hero: a slider on the left, two square tiles and a wide promo
 * tile on the right.
 *
 * MOVED, NOT REWRITTEN. This is the arrangement the storefront rendered before
 * layouts were selectable, and every store that exists today renders it. Its
 * classes, ratios and the reasoning below came across from `Hero.tsx`
 * unchanged, so the default store emits the same DOM it always did — which is
 * the whole compatibility claim of this change, and there is no test runner in
 * this repo that could catch a regression in it.
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
 * The admin's `hero-slots.ts` derives its upload guidance from these same
 * ratios. Change one here and change it there.
 *
 * ── Geometry, for the admin mirror ────────────────────────────────────────
 *
 *   row          = contentWidth - 64      (container-px at lg, both sides)
 *   gap          = 16                     (gap-4)
 *   side column  = 0.43 * row
 *   side tile    = (side column - gap) / 2, square
 *   promo tile   = side column wide, ratio 43/20
 *   slider       = row - side column - gap, height = side tile + gap + promo
 */
export default function HeroSplitThree({
  slides,
  sideBanners,
  promoTile,
  sizes,
}: HeroLayoutProps) {
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
            <HeroSlider slides={slides} sizes={sizes.slider} />
          </div>
        )}

        {/* 43% of the row — see the note above on why this is a share and not
            the 570px it used to be. */}
        <div className="flex w-full flex-col gap-4 lg:w-[43%] lg:flex-none">
          {sideBanners.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {sideBanners.map((b) => (
                <HeroTile
                  key={b.id}
                  banner={b}
                  ratio="aspect-square"
                  // Half of the 43% column, at both breakpoints — the column
                  // is full-width when the hero stacks.
                  sizes={sizes.side}
                  tint="bg-[#eef1fb]"
                />
              ))}
            </div>
          )}

          {promoTile && (
            <HeroTile
              banner={promoTile}
              // 2.15:1, the shape the old fixed 570x265 tile had.
              ratio="aspect-43/20"
              sizes={sizes.promo}
              tint="bg-[#eaf3ec]"
            />
          )}
        </div>
      </div>
    </section>
  );
}
