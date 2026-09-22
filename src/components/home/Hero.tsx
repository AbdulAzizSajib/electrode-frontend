import { HERO_VARIANTS } from "@/components/home/hero/registry";
import { getBannersByPlacement } from "@/services/banner";
import type { HeroVariant } from "@/types/store-settings";

/**
 * The homepage hero: one fetch, then whichever arrangement the merchant chose.
 *
 * All three slots are merchant-managed banners keyed by their `placement` —
 * HERO_SLIDER, HERO_SIDE, HERO_PROMO — and every layout draws on the same
 * three. Which of them a layout renders, at what shape and how many, is the
 * layout's business; see `hero/registry.ts`.
 *
 * ── Why the fetch and the empty rule stay here ───────────────────────────
 *
 * Four layouts each fetching for themselves would be four cache reads and four
 * copies of the capacity rules, and those copies would drift the first time one
 * was edited alone. So this component fetches once, slices each slot to the
 * chosen layout's capacity, and hands the result over as props. The layout
 * components are then pure markup — which also keeps them reasonable to review
 * in a repo whose test runner cannot render them.
 *
 * ── The empty rule is scoped to the layout, and that is the subtle part ──
 *
 * It used to be "no slides and no side and no promo". It is now "nothing in the
 * slots THIS layout reads". A store on `FULL_SLIDER` with no slider artwork but
 * two side tiles still on file renders nothing at all, because those tiles are
 * not part of the arrangement it chose. Falling back to a slot the merchant
 * deliberately arranged away would be the storefront overruling them — and the
 * tiles are not lost: they stay on file and render again untouched the moment
 * they pick a layout that uses them.
 *
 * See openspec/changes/add-hero-section-variants-ui, design.md Decision 2.
 */
export default async function Hero({ variant }: { variant: HeroVariant }) {
  const { Component, capacity, sizes } = HERO_VARIANTS[variant];

  const banners = await getBannersByPlacement();

  /*
   * Sliced to what this layout renders. A banner past the limit is invisible
   * rather than breaking the row — the admin panel is what surfaces the
   * overflow, since only it can tell the merchant which upload is unused.
   */
  const slides =
    capacity.slider === null
      ? (banners.HERO_SLIDER ?? [])
      : (banners.HERO_SLIDER ?? []).slice(0, capacity.slider);
  const sideBanners = (banners.HERO_SIDE ?? []).slice(0, capacity.side);
  const promoTile = capacity.promo > 0 ? (banners.HERO_PROMO ?? [])[0] : undefined;

  // Nothing this layout can show: skip the hero entirely rather than render an
  // empty band above the fold.
  if (slides.length === 0 && sideBanners.length === 0 && !promoTile) return null;

  return (
    <Component
      slides={slides}
      sideBanners={sideBanners}
      promoTile={promoTile}
      sizes={sizes}
    />
  );
}
