import type { PromoBannerLayout } from "@/types/store-settings";

/**
 * How each promo strip layout is drawn — the grid, and the shape of a tile in
 * it.
 *
 * ── Why a lookup and NEVER an interpolated class ──────────────────────────
 *
 * `sm:grid-cols-${n}` does not work. Tailwind builds its stylesheet by scanning
 * source files for complete class strings, so a class assembled at runtime is
 * never emitted and the grid silently falls back to one column — at every
 * breakpoint, for every store, with no error anywhere. The strings below are
 * written out in full for exactly that reason. Do not "simplify" them.
 *
 * ── Why the ratio changes with the layout ────────────────────────────────
 *
 * `MidBanners` used a fixed `aspect-2/1`, which was right when a tile was
 * always a third of the content width. It is not right for the other two: at
 * full width a 2:1 tile is a half-page-tall band, and at half width it is still
 * twice as tall as the artwork these strips are cut for. So each layout carries
 * the ratio that keeps a tile roughly the same HEIGHT whatever its width —
 * which is what makes a merchant's existing three-across artwork and a new
 * full-width banner sit on the same page without one dwarfing the other.
 *
 * These ratios are also what the admin quotes as its recommended upload sizes;
 * the two must stay in step, the way `hero-slots.ts` and the hero components do.
 *
 * See server/openspec/changes/add-promo-banner-groups, design.md Decision 5.
 */
export const PROMO_LAYOUTS = {
  ONE: {
    grid: "grid-cols-1",
    /** One tile across the full content width — a wide, shallow band. */
    tile: "aspect-6/1",
    sizes: "100vw",
  },
  TWO: {
    grid: "grid-cols-1 sm:grid-cols-2",
    tile: "aspect-3/1",
    sizes: "(min-width: 640px) 50vw, 100vw",
  },
  THREE: {
    grid: "grid-cols-1 sm:grid-cols-3",
    /** 2:1 — what `h-56` came to at the width this shipped with, unchanged. */
    tile: "aspect-2/1",
    sizes: "(min-width: 640px) 33vw, 100vw",
  },
} as const satisfies Record<
  PromoBannerLayout,
  { grid: string; tile: string; sizes: string }
>;

/**
 * The layout to draw, given whatever the settings payload carries.
 *
 * Mirrors `resolveSectionLayout`'s contract for the same reason it exists: the
 * backend resolves a group's layout on read, so a real payload always carries a
 * valid one and this hands it straight back. It is here for the two cases the
 * backend cannot answer for — a settings read that failed, and a server that
 * offers a layout this build has no grid class for. An unknown value renders
 * three across rather than rendering nothing.
 */
export const resolvePromoLayout = (
  layout: string | undefined,
): keyof typeof PROMO_LAYOUTS =>
  layout !== undefined && layout in PROMO_LAYOUTS
    ? (layout as keyof typeof PROMO_LAYOUTS)
    : "THREE";
