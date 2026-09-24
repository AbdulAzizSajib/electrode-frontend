import { describe, expect, it } from "vitest";
import {
  SECTION_LAYOUTS,
  defaultLayout,
  offersLayouts,
  resolveSectionLayout,
  type LayoutSectionKey,
} from "@/lib/section-layouts";

/*
 * One rule, every section: whatever the payload carries, the storefront
 * renders a layout it has a component for, and a bad value costs the merchant
 * the default rather than the section.
 *
 * Runs over every key of `SECTION_LAYOUTS` so a third section is covered by
 * being added to the map. The section-specific cases below pin the two facts
 * that are load-bearing per section: which layout is the default, and that a
 * withdrawn value still resolves.
 */
const SECTIONS = Object.keys(SECTION_LAYOUTS) as LayoutSectionKey[];

describe("resolveSectionLayout", () => {
  it.each(SECTIONS)("%s: hands back every layout it offers", (key) => {
    for (const layout of SECTION_LAYOUTS[key]) {
      expect(resolveSectionLayout(key, layout)).toBe(layout);
    }
  });

  it.each(SECTIONS)("%s: falls back to the default for a layout it cannot render", (key) => {
    // A newer server's layout, a hand-edited row, and case drift all land here.
    expect(resolveSectionLayout(key, "NOT_A_LAYOUT")).toBe(defaultLayout(key));
    expect(resolveSectionLayout(key, SECTION_LAYOUTS[key][0].toLowerCase())).toBe(defaultLayout(key));
    expect(resolveSectionLayout(key, "")).toBe(defaultLayout(key));
  });

  it.each(SECTIONS)("%s: falls back to the default when nothing was sent", (key) => {
    expect(resolveSectionLayout(key, undefined)).toBe(defaultLayout(key));
    expect(resolveSectionLayout(key, null)).toBe(defaultLayout(key));
  });

  it.each(SECTIONS)("%s: falls back to the default for a value that is not a string", (key) => {
    expect(resolveSectionLayout(key, 0)).toBe(defaultLayout(key));
    expect(resolveSectionLayout(key, [SECTION_LAYOUTS[key][0]])).toBe(defaultLayout(key));
    expect(resolveSectionLayout(key, { variant: SECTION_LAYOUTS[key][0] })).toBe(defaultLayout(key));
  });

  it("does not let one section's layout leak into another", () => {
    // One `variant` field serves every entry, so a value from the wrong tuple
    // is a real possibility, not a hypothetical one.
    expect(resolveSectionLayout("FEATURED_CATEGORIES", "SPLIT_THREE")).toBe("GRID");
    expect(resolveSectionLayout("HERO", "SLIDER")).toBe("SPLIT_THREE");
  });

  /*
   * `SPLIT_ONE` was a real layout and was withdrawn. A store that chose it
   * still has the string in its `homeConfig` — nothing rewrites the stored
   * row — so this is not a hypothetical bad value, it is a value the database
   * genuinely holds. It must render the default rather than nothing.
   */
  it("renders the default for a layout that has been withdrawn", () => {
    expect(SECTION_LAYOUTS.HERO).not.toContain("SPLIT_ONE");
    expect(resolveSectionLayout("HERO", "SPLIT_ONE")).toBe("SPLIT_THREE");
  });
});

/*
 * Position 0 is the default in the backend's registry too, and every
 * no-existing-store-changes claim rests on it being the layout the storefront
 * rendered before layouts existed: SPLIT_THREE for the hero, GRID for the
 * categories.
 */
describe("defaults", () => {
  it("are the layouts the storefront rendered before layouts existed", () => {
    expect(defaultLayout("HERO")).toBe("SPLIT_THREE");
    expect(SECTION_LAYOUTS.HERO[0]).toBe("SPLIT_THREE");

    expect(defaultLayout("FEATURED_CATEGORIES")).toBe("GRID");
    expect(SECTION_LAYOUTS.FEATURED_CATEGORIES[0]).toBe("GRID");
  });

  it("mirror the backend's tuples exactly", () => {
    // Hand-maintained mirrors; these pin the order, which is what the default
    // depends on. Change the backend's tuple and this fails, which is the point.
    expect(SECTION_LAYOUTS.HERO).toEqual(["SPLIT_THREE", "FULL_SLIDER", "SLIDER_STACK", "SPLIT_TALL"]);
    expect(SECTION_LAYOUTS.FEATURED_CATEGORIES).toEqual(["GRID", "SLIDER"]);
    expect(SECTION_LAYOUTS.BEST_SELLING).toEqual(["GRID", "SLIDER"]);
    expect(SECTION_LAYOUTS.FEATURED_PRODUCTS).toEqual(["GRID", "SLIDER"]);
    expect(SECTION_LAYOUTS.NEW_ARRIVALS).toEqual(["GRID", "SLIDER"]);
  });
});

/*
 * The three product rows.
 *
 * Each is its own entry although all three offer the same two layouts, because
 * the layout is stored per section — a merchant may show one row as a grid and
 * another as a slider. The cases below are the ones that decide whether a
 * storefront renders a row at all, and none is reachable by a normal manual
 * test: producing them means a hand-edited settings row or a backend that has
 * learned a layout this build has not.
 */
describe("product rows", () => {
  const ROWS = ["BEST_SELLING", "FEATURED_PRODUCTS", "NEW_ARRIVALS"] as const;

  it.each(ROWS)("%s defaults to the grid it rendered before layouts existed", (key) => {
    expect(defaultLayout(key)).toBe("GRID");
    expect(SECTION_LAYOUTS[key][0]).toBe("GRID");
  });

  it.each(ROWS)("%s resolves an absent or unusable layout to the grid", (key) => {
    expect(resolveSectionLayout(key, undefined)).toBe("GRID");
    expect(resolveSectionLayout(key, null)).toBe("GRID");
    expect(resolveSectionLayout(key, 3)).toBe("GRID");
    expect(resolveSectionLayout(key, "")).toBe("GRID");
    // A layout from a newer server this build has no component for.
    expect(resolveSectionLayout(key, "MASONRY")).toBe("GRID");
  });

  it.each(ROWS)("%s accepts the slider", (key) => {
    expect(resolveSectionLayout(key, "SLIDER")).toBe("SLIDER");
  });

  /*
   * Cross-section leakage: `SPLIT_THREE` is a real layout, just not one a
   * product row offers. The tuples are per key precisely so this is caught —
   * were the map flat, a hero layout would resolve here and the row would try
   * to render a component it has no business rendering.
   */
  it.each(ROWS)("%s refuses a layout belonging to another section", (key) => {
    expect(resolveSectionLayout(key, "SPLIT_THREE")).toBe("GRID");
    expect(resolveSectionLayout(key, "FULL_SLIDER")).toBe("GRID");
  });

  it("offers a choice on the three rows and not on the countdown row", () => {
    for (const key of ROWS) expect(offersLayouts(key)).toBe(true);
    // DEAL_OF_WEEK shares a grid with a countdown panel; a slider there is a
    // different layout problem and the backend does not offer it either.
    expect(offersLayouts("DEAL_OF_WEEK")).toBe(false);
  });
});

describe("offersLayouts", () => {
  it("is true only for the sections in the map", () => {
    expect(offersLayouts("HERO")).toBe(true);
    expect(offersLayouts("FEATURED_CATEGORIES")).toBe(true);
    expect(offersLayouts("BRAND_BAR")).toBe(false);
    expect(offersLayouts("NEWSLETTER")).toBe(false);
  });
});
