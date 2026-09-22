import type { Banner } from "@/types/banner";

/**
 * What every hero layout receives.
 *
 * ALREADY FETCHED AND ALREADY SLICED. `Hero.tsx` makes the one
 * `getBannersByPlacement()` call and cuts each slot to the chosen layout's
 * capacity before handing the result over, so a layout component is pure
 * markup: no fetching, no capacity rule of its own, and nothing to drift when
 * one of the four is edited months after the others.
 *
 * A slot that is empty arrives empty (`[]` / `undefined`) rather than absent,
 * and each layout collapses it rather than rendering a box with nothing in it.
 *
 * `sizes` comes from the layout's own registry entry. It is passed in rather
 * than written inside the component so that the figures sit beside the geometry
 * they were derived from, where they are reviewable together — the current
 * `57vw` / `22vw` / `43vw` are arithmetic from the default layout's 43/57 split
 * and are simply wrong for the other three.
 *
 * See openspec/changes/add-hero-section-variants-ui, design.md Decisions 1 & 2.
 */
export interface HeroSlotSizes {
  slider: string;
  side: string;
  promo: string;
}

export interface HeroLayoutProps {
  slides: Banner[];
  sideBanners: Banner[];
  promoTile: Banner | undefined;
  sizes: HeroSlotSizes;
}
