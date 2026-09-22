import type { HeroVariant } from "@/types/store-settings";

/**
 * Resolving the hero's layout from whatever the settings payload carries.
 *
 * ── Why this is a module in `lib/` and not three lines in a component ─────
 *
 * This repo's Vitest suite is `node`-environment and runs over `src/lib` only —
 * no DOM, no React renderer — so anything that must be PROVEN has to be a pure
 * module. This rule qualifies: an unrecognised layout has to render the default
 * hero rather than nothing, and that is the difference between a working page
 * and a blank band above the fold on a storefront deployed behind a server that
 * has learned a fifth layout. It is also unreachable by any normal manual test,
 * because producing the condition means hand-editing a settings row.
 *
 * ── Why the storefront defaults it at all ────────────────────────────────
 *
 * Normally it does not. The backend resolves every store's layout on read, so a
 * real payload always carries a valid one and this function just hands it back.
 * It exists for the two cases the backend cannot answer for: a settings read
 * that failed entirely (`FALLBACK_SETTINGS` supplies the default itself), and a
 * server that offers a layout this storefront has no component for.
 *
 * See openspec/changes/add-hero-section-variants-ui, design.md Decision 5.
 */

/**
 * Every layout this storefront can render, in the backend's registry order.
 *
 * POSITION 0 IS THE DEFAULT, matching `HERO_VARIANTS` in the backend's
 * store-setting.constant.ts. `SPLIT_THREE` holds it because that is the hero
 * the storefront rendered before layouts were selectable — reorder this and
 * every store that never opened the screen silently restyles.
 */
export const HERO_VARIANT_KEYS = [
  "SPLIT_THREE",
  "SPLIT_ONE",
  "FULL_SLIDER",
  "SLIDER_STACK",
] as const satisfies readonly HeroVariant[];

export const DEFAULT_HERO_VARIANT: HeroVariant = HERO_VARIANT_KEYS[0];

/**
 * The layout to render, given whatever arrived. Anything this storefront cannot
 * render — absent, a layout from a newer server, a hand-edited row, a non-string
 * — becomes the default rather than nothing.
 */
export function resolveHeroVariant(value: unknown): HeroVariant {
  if (typeof value !== "string") return DEFAULT_HERO_VARIANT;

  return (HERO_VARIANT_KEYS as readonly string[]).includes(value)
    ? (value as HeroVariant)
    : DEFAULT_HERO_VARIANT;
}
