import type {
  FeaturedCategoriesLayout,
  HeroVariant,
  HomeSectionKey,
  ProductRowLayout,
  SectionLayout,
} from "@/types/store-settings";

/**
 * Resolving a homepage section's layout from whatever the settings payload
 * carries — for every section that offers one.
 *
 * ── Why this is a module in `lib/` and not three lines in a component ─────
 *
 * This repo's Vitest suite is `node`-environment and runs over `src/lib` only —
 * no DOM, no React renderer — so anything that must be PROVEN has to be a pure
 * module. This rule qualifies: an unrecognised layout has to render the
 * section's default rather than nothing, and that is the difference between a
 * working page and a blank band above the fold on a storefront deployed behind
 * a server that has learned a layout this build has not. It is also
 * unreachable by any normal manual test, because producing the condition means
 * hand-editing a settings row.
 *
 * ── Why one resolver over a map, not one per section ─────────────────────
 *
 * It was `resolveHeroVariant`, with the hero's tuple written into it. The
 * second section to offer layouts would have needed a `resolveFeatured…`
 * beside it — the same rule written twice, and the storefront's whole defence
 * against a newer server is that rule being right. So the section key is a
 * parameter and the tuples live in one map, which is also the one place this
 * storefront mirrors the backend's `HOME_SECTION_VARIANTS`.
 *
 * ── Why the storefront defaults it at all ────────────────────────────────
 *
 * Normally it does not. The backend resolves every store's layout on read, so a
 * real payload always carries a valid one and this function just hands it back.
 * It exists for the two cases the backend cannot answer for: a settings read
 * that failed entirely (`FALLBACK_SETTINGS` supplies the default itself), and a
 * server that offers a layout this storefront has no component for.
 *
 * See openspec/changes/add-hero-section-variants-ui, design.md Decision 5, and
 * server/openspec/changes/add-featured-categories-layout, design.md Decision 5.
 */

/**
 * Every layout this storefront can render, per section, in the backend's
 * registry order.
 *
 * POSITION 0 IS THE DEFAULT for each tuple, matching `HOME_SECTION_VARIANTS` in
 * the backend's store-setting.constant.ts. `SPLIT_THREE` and `GRID` hold it
 * because they are what the storefront rendered before layouts were selectable
 * — reorder a tuple and every store that never opened the control silently
 * restyles.
 *
 * A SECTION ABSENT FROM THIS MAP OFFERS NO CHOICE and has no layout to resolve.
 *
 * `SPLIT_ONE` was withdrawn on request; see the backend's `HERO_VARIANTS`. A
 * store still holding it falls through `resolveSectionLayout` to the default,
 * which is the same path a layout from a newer server takes — so no store is
 * ever left with a hero that renders nothing.
 */
export const SECTION_LAYOUTS = {
  HERO: ["SPLIT_THREE", "FULL_SLIDER", "SLIDER_STACK", "SPLIT_TALL"],
  FEATURED_CATEGORIES: ["GRID", "SLIDER"],
  /*
   * The three product rows, each its own entry although all three offer the
   * same two layouts — the layout is stored per section, so a merchant may
   * show one row as a grid and another as a slider.
   */
  BEST_SELLING: ["GRID", "SLIDER"],
  FEATURED_PRODUCTS: ["GRID", "SLIDER"],
  NEW_ARRIVALS: ["GRID", "SLIDER"],
} as const satisfies {
  HERO: readonly HeroVariant[];
  FEATURED_CATEGORIES: readonly FeaturedCategoriesLayout[];
  BEST_SELLING: readonly ProductRowLayout[];
  FEATURED_PRODUCTS: readonly ProductRowLayout[];
  NEW_ARRIVALS: readonly ProductRowLayout[];
};

/** The sections that offer a choice of layout. */
export type LayoutSectionKey = keyof typeof SECTION_LAYOUTS;

/** The layouts one section offers, as a type. */
export type LayoutOf<K extends LayoutSectionKey> = (typeof SECTION_LAYOUTS)[K][number];

/** A section's default layout: the first of its tuple. */
export function defaultLayout<K extends LayoutSectionKey>(key: K): LayoutOf<K> {
  return SECTION_LAYOUTS[key][0] as LayoutOf<K>;
}

/**
 * The layout to render for a section, given whatever arrived. Anything this
 * storefront cannot render — absent, a layout from a newer server, a
 * hand-edited row, a non-string, a value from a DIFFERENT section's tuple —
 * becomes that section's default rather than nothing.
 */
export function resolveSectionLayout<K extends LayoutSectionKey>(key: K, value: unknown): LayoutOf<K> {
  if (typeof value !== "string") return defaultLayout(key);

  const offered: readonly string[] = SECTION_LAYOUTS[key];
  return offered.includes(value) ? (value as LayoutOf<K>) : defaultLayout(key);
}

/** True when a section key offers a choice of layout at all. */
export function offersLayouts(key: HomeSectionKey): key is LayoutSectionKey {
  return key in SECTION_LAYOUTS;
}

// Re-exported so a caller that only needs the union does not import the map.
export type { SectionLayout };
