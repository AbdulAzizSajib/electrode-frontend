import { describe, expect, it } from "vitest";
import { PROMO_LAYOUTS, resolvePromoLayout } from "./layouts";

/**
 * The promo strip's layout table and its resolver.
 *
 * Both failures these pin are invisible in normal use and only appear on a
 * storefront deployed against a server that has learned something this build
 * has not — a condition reachable in production and effectively unreachable by
 * hand:
 *
 *  - an unrecognised layout must render the DEFAULT strip, not nothing. A group
 *    whose layout falls through to `undefined` would index the table with a
 *    missing key and crash the homepage above the fold;
 *  - the grid classes must be COMPLETE, literal Tailwind strings. Tailwind
 *    builds its stylesheet by scanning source for whole class names, so a class
 *    assembled by interpolation is never emitted and every strip silently
 *    collapses to one column. Nothing errors; the page is just wrong.
 */
describe("resolvePromoLayout", () => {
  it("passes a known layout through", () => {
    expect(resolvePromoLayout("ONE")).toBe("ONE");
    expect(resolvePromoLayout("TWO")).toBe("TWO");
    expect(resolvePromoLayout("THREE")).toBe("THREE");
  });

  it("falls back to THREE for an unknown or absent layout", () => {
    // A layout from a newer server, and a settings read that carried none.
    expect(resolvePromoLayout("SEVEN_ACROSS")).toBe("THREE");
    expect(resolvePromoLayout(undefined)).toBe("THREE");
  });

  it("never returns a key the table cannot draw", () => {
    for (const candidate of ["ONE", "TWO", "THREE", "NONSENSE", undefined]) {
      expect(PROMO_LAYOUTS[resolvePromoLayout(candidate)]).toBeDefined();
    }
  });
});

describe("PROMO_LAYOUTS", () => {
  it("THREE keeps the arrangement that shipped before strips were groupable", () => {
    // Changing either of these restyles every store that never opened the
    // control — the same hazard the backend's layout tuples document.
    expect(PROMO_LAYOUTS.THREE.grid).toBe("grid-cols-1 sm:grid-cols-3");
    expect(PROMO_LAYOUTS.THREE.tile).toBe("aspect-2/1");
  });

  it("declares complete, literal grid classes for every layout", () => {
    for (const { grid, tile, sizes } of Object.values(PROMO_LAYOUTS)) {
      // An interpolated class would leave `${` behind; a complete one cannot.
      expect(grid).not.toContain("${");
      expect(grid).toMatch(/^grid-cols-\d/);
      expect(tile).toMatch(/^aspect-/);
      expect(sizes.length).toBeGreaterThan(0);
    }
  });

  it("gives each layout a distinct grid, so the choice actually changes something", () => {
    const grids = Object.values(PROMO_LAYOUTS).map((layout) => layout.grid);
    expect(new Set(grids).size).toBe(grids.length);
  });
});
