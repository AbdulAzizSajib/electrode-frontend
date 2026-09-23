import type { ComponentType } from "react";
import {
  HeroFullSliderSkeleton,
  HeroSliderStackSkeleton,
  HeroSplitTallSkeleton,
  HeroSplitThreeSkeleton,
} from "@/components/home/HomeSkeletons";
import HeroFullSlider from "@/components/home/hero/HeroFullSlider";
import HeroSliderStack from "@/components/home/hero/HeroSliderStack";
import HeroSplitTall from "@/components/home/hero/HeroSplitTall";
import HeroSplitThree from "@/components/home/hero/HeroSplitThree";
import type { HeroLayoutProps, HeroSlotSizes } from "@/components/home/hero/types";
import type { HeroVariant } from "@/types/store-settings";

/**
 * Everything that differs between the four hero layouts, in one record.
 *
 * ── Why the skeleton and the sizes live here and not in the components ───
 *
 * Both are things you forget. Kept apart — a `switch` in `Hero.tsx` for the
 * component and another in the homepage for the placeholder — they get edited
 * months apart with nothing linking them, and the failure is a page that
 * re-flows on first paint: invisible on a fast local machine, obvious to a
 * shopper on a phone. Kept together in a `Record<HeroVariant, …>`, TypeScript
 * reports the missing key the moment a layout is added, so one cannot ship
 * without its placeholder or without its own image sizes.
 *
 * ── `sizes` is not a detail ──────────────────────────────────────────────
 *
 * It tells the browser what share of the viewport an image will actually
 * occupy, and it is wrong by default: the storefront's original figures are
 * arithmetic from the default layout's 43/57 split. A full-width slider told it
 * paints at `57vw` fetches a file about half the width it needs and renders
 * soft — on the largest element of the page, with no error and no failing test
 * anywhere. So each layout states its own, derived from its own geometry.
 *
 * See openspec/changes/add-hero-section-variants-ui, design.md Decision 1.
 */

export interface HeroVariantEntry {
  Component: ComponentType<HeroLayoutProps>;
  Skeleton: ComponentType;
  /**
   * How many banners each slot renders in this layout. `null` is unbounded —
   * the slider cycles through as many slides as exist.
   *
   * `Hero.tsx` slices to these before handing the banners over, so a layout
   * component never carries a capacity rule of its own. A banner past the limit
   * is not rendered; the admin panel is what tells the merchant so.
   */
  capacity: { slider: number | null; side: number; promo: number };
  sizes: HeroSlotSizes;
}

export const HERO_VARIANTS: Record<HeroVariant, HeroVariantEntry> = {
  /**
   * row = contentWidth - 64, gap 16, side column 0.43 * row.
   * Slider takes the remainder (~57%); side tiles are half the column, square;
   * promo is the column's width at 43:20.
   */
  SPLIT_THREE: {
    Component: HeroSplitThree,
    Skeleton: HeroSplitThreeSkeleton,
    capacity: { slider: null, side: 2, promo: 1 },
    sizes: {
      // Stacked, the slider is the viewport's width; beside the 43% side
      // column it is a little over half of it.
      slider: "(min-width: 1024px) 57vw, 100vw",
      // Half of the 43% column, at both breakpoints — the column is full-width
      // when the hero stacks.
      side: "(min-width: 1024px) 22vw, 50vw",
      promo: "(min-width: 1024px) 43vw, 100vw",
    },
  },

  /** One panel across the whole content width, at every breakpoint. */
  FULL_SLIDER: {
    Component: HeroFullSlider,
    Skeleton: HeroFullSliderSkeleton,
    capacity: { slider: null, side: 0, promo: 0 },
    sizes: {
      slider: "100vw",
      side: "100vw",
      promo: "100vw",
    },
  },

  /**
   * Full-width panel, then three tiles at `(row - 32) / 3` — a little under a
   * third of the row each, and full width once they stack below `lg`.
   */
  SLIDER_STACK: {
    Component: HeroSliderStack,
    Skeleton: HeroSliderStackSkeleton,
    capacity: { slider: null, side: 2, promo: 1 },
    sizes: {
      slider: "100vw",
      side: "(min-width: 1024px) 31vw, 100vw",
      promo: "(min-width: 1024px) 31vw, 100vw",
    },
  },

  /**
   * Slider beside one tall tile: the tile is a third of the row at 19:24,
   * which is exactly the shared box's height; the slider takes the other two
   * thirds less the gap. The side slot is unread.
   */
  SPLIT_TALL: {
    Component: HeroSplitTall,
    Skeleton: HeroSplitTallSkeleton,
    capacity: { slider: null, side: 0, promo: 1 },
    sizes: {
      slider: "(min-width: 1024px) 67vw, 100vw",
      // Unused by this layout; stated so the record reads beside the others.
      side: "100vw",
      promo: "(min-width: 1024px) 33vw, 100vw",
    },
  },
};
