import { describe, expect, it } from "vitest";
import {
  DEFAULT_LANDING_SECTION_ORDER,
  landingSectionSurfaces,
  resolveLandingSections,
} from "@/lib/landing-sections";
import type { LandingSectionConfigEntry } from "@/types/landing-page";

/**
 * The resolution is the part of this feature that fails silently.
 *
 * Every case below is a way a stored order and the code reading it can disagree,
 * and in production each one costs either a blank campaign page or a section
 * that quietly stops rendering — neither of which throws. The happy path is one
 * test here; the drift cases are the rest, deliberately.
 */

const keysOf = (entries: ReturnType<typeof resolveLandingSections>) =>
  entries.map((entry) => entry.key);

describe("resolveLandingSections — the no-stored-order path", () => {
  /*
   * THE MOST IMPORTANT TEST IN THE FILE. Every campaign that existed before the
   * section editor has sectionConfig = null, so this is what they all render.
   */
  it("resolves null to the default order", () => {
    expect(keysOf(resolveLandingSections(null))).toEqual([...DEFAULT_LANDING_SECTION_ORDER]);
  });

  it("resolves undefined to the default order", () => {
    expect(keysOf(resolveLandingSections(undefined))).toEqual([...DEFAULT_LANDING_SECTION_ORDER]);
  });

  it("resolves an empty array to the default order rather than to a blank page", () => {
    expect(keysOf(resolveLandingSections([]))).toEqual([...DEFAULT_LANDING_SECTION_ORDER]);
  });

  it("resolves a malformed stored value to the default order rather than throwing", () => {
    const malformed = ["HERO", 7, null] as unknown as LandingSectionConfigEntry[];
    expect(() => resolveLandingSections(malformed)).not.toThrow();
    expect(keysOf(resolveLandingSections(malformed)).length).toBeGreaterThan(0);
  });

  it("keeps the default order's three call-to-action strips", () => {
    expect(keysOf(resolveLandingSections(null)).filter((key) => key === "CTA")).toHaveLength(3);
  });
});

describe("resolveLandingSections — a merchant's stored order", () => {
  it("renders the stored sequence rather than the default one", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "QUOTES", enabled: true },
      { key: "HIGHLIGHTS", enabled: true },
    ];

    const keys = keysOf(resolveLandingSections(stored));

    expect(keys.indexOf("QUOTES")).toBeLessThan(keys.indexOf("HIGHLIGHTS"));
  });

  it("omits a disabled section and does not restore it", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "FAQS", enabled: false },
      { key: "QUOTES", enabled: true },
    ];

    expect(keysOf(resolveLandingSections(stored))).not.toContain("FAQS");
  });

  it("deduplicates a repeated non-repeatable key", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "QUOTES", enabled: true },
      { key: "QUOTES", enabled: true },
    ];

    expect(keysOf(resolveLandingSections(stored)).filter((key) => key === "QUOTES")).toHaveLength(1);
  });

  it("keeps every call-to-action strip, because CTA may repeat", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "CTA", enabled: true },
      { key: "CTA", enabled: true },
    ];

    expect(keysOf(resolveLandingSections(stored)).filter((key) => key === "CTA")).toHaveLength(2);
  });

  it("restores a HERO that a hand-edited row dropped", () => {
    const stored: LandingSectionConfigEntry[] = [{ key: "QUOTES", enabled: true }];

    expect(keysOf(resolveLandingSections(stored))).toContain("HERO");
  });

  it("restores an ORDER_FORM that a hand-edited row dropped", () => {
    const stored: LandingSectionConfigEntry[] = [{ key: "QUOTES", enabled: true }];

    expect(keysOf(resolveLandingSections(stored))).toContain("ORDER_FORM");
  });

  /*
   * THE MIGRATION CASE, and the reason the split needed no migration at all.
   *
   * Every order stored between the section editor shipping and the hero being
   * split names HERO and knows nothing of ORDER_FORM. The restore pass has to
   * put the form back DIRECTLY AFTER the product — which is where it rendered
   * when the two were one block — and not at the end of the page below the
   * last call to action.
   */
  it("puts the order form back after the product on an order stored before the split", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "FAQS", enabled: true },
      { key: "QUOTES", enabled: true },
    ];

    const keys = keysOf(resolveLandingSections(stored));

    expect(keys.indexOf("ORDER_FORM")).toBe(keys.indexOf("HERO") + 1);
  });

  /*
   * And the arrangement the split exists to make possible: the form ABOVE the
   * product, for traffic that already knows from the ad what it is buying.
   */
  it("renders the order form above the product when that is the stored order", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "ORDER_FORM", enabled: true },
      { key: "HERO", enabled: true },
    ];

    const keys = keysOf(resolveLandingSections(stored));

    expect(keys.indexOf("ORDER_FORM")).toBeLessThan(keys.indexOf("HERO"));
  });

  /*
   * Neither may be switched off. The backend refuses it and the admin offers
   * no switch, but a hand-edited row goes through neither.
   */
  it("keeps the product and the form even when a stored row disables them", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: false },
      { key: "ORDER_FORM", enabled: false },
      { key: "FAQS", enabled: true },
    ];

    const keys = keysOf(resolveLandingSections(stored));

    expect(keys).toContain("HERO");
    expect(keys).toContain("ORDER_FORM");
  });
});

describe("resolveLandingSections — drift between stored order and code", () => {
  it("drops an entry naming a section this build does not have", () => {
    const stored = [
      { key: "HERO", enabled: true },
      { key: "RETIRED_SECTION", enabled: true },
      { key: "QUOTES", enabled: true },
    ] as unknown as LandingSectionConfigEntry[];

    const keys = keysOf(resolveLandingSections(stored));

    expect(keys).toContain("QUOTES");
    expect(keys).not.toContain("RETIRED_SECTION" as never);
  });

  it("restores a section the stored order never mentioned", () => {
    // Saved before FAQS existed: it is absent, not disabled.
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "QUOTES", enabled: true },
    ];

    expect(keysOf(resolveLandingSections(stored))).toContain("FAQS");
  });

  it("does NOT restore a section the merchant switched off", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "FAQS", enabled: false },
    ];

    // Mentioned-and-disabled is a decision; absent is drift. The two must not
    // be confused, or switching a section off would be undone on every render.
    expect(keysOf(resolveLandingSections(stored))).not.toContain("FAQS");
  });

  it("restores a missing section near its default position, not at the end", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "FAQS", enabled: true },
    ];

    const keys = keysOf(resolveLandingSections(stored));

    // HIGHLIGHTS sits before FAQS in the default order and should land there.
    expect(keys.indexOf("HIGHLIGHTS")).toBeLessThan(keys.indexOf("FAQS"));
  });
});

describe("resolveLandingSections — custom sections", () => {
  it("keeps several custom sections apart by id", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "CUSTOM", enabled: true, id: "a", heading: "First" },
      { key: "CUSTOM", enabled: true, id: "b", heading: "Second" },
    ];

    const custom = resolveLandingSections(stored).filter((entry) => entry.key === "CUSTOM");

    expect(custom).toHaveLength(2);
    expect(custom.map((entry) => entry.heading)).toEqual(["First", "Second"]);
  });

  it("collapses two custom sections sharing one id rather than rendering both", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "CUSTOM", enabled: true, id: "same", heading: "First" },
      { key: "CUSTOM", enabled: true, id: "same", heading: "Second" },
    ];

    expect(resolveLandingSections(stored).filter((entry) => entry.key === "CUSTOM")).toHaveLength(1);
  });

  it("skips a custom section with neither heading nor body", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "CUSTOM", enabled: true, id: "empty" },
    ];

    expect(keysOf(resolveLandingSections(stored))).not.toContain("CUSTOM");
  });

  it("defaults a custom section with no layout to PROSE", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "CUSTOM", enabled: true, id: "a", heading: "Guarantee" },
    ];

    const custom = resolveLandingSections(stored).find((entry) => entry.key === "CUSTOM");

    expect(custom?.layout).toBe("PROSE");
  });

  it("gives every resolved section a unique id, so React keys cannot collide", () => {
    const resolved = resolveLandingSections(null);
    const ids = resolved.map((entry) => entry.id);

    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("landingSectionSurfaces", () => {
  it("never puts two content bands on the same surface in a row", () => {
    const sections = resolveLandingSections(null);
    const surfaces = landingSectionSurfaces(sections);

    const contentSurfaces = surfaces.filter((surface) => surface !== "accentSoft");

    contentSurfaces.forEach((surface, index) => {
      if (index === 0) return;
      expect(surface).not.toBe(contentSurfaces[index - 1]);
    });
  });

  it("keeps the alternation after a section is disabled", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "HIGHLIGHTS", enabled: false },
      { key: "WHY_US", enabled: true },
      { key: "QUOTES", enabled: true },
      { key: "FAQS", enabled: true },
    ];

    const surfaces = landingSectionSurfaces(resolveLandingSections(stored)).filter(
      (surface) => surface !== "accentSoft",
    );

    surfaces.forEach((surface, index) => {
      if (index === 0) return;
      expect(surface).not.toBe(surfaces[index - 1]);
    });
  });

  it("keeps the alternation after a reorder", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "QUOTES", enabled: true },
      { key: "FAQS", enabled: true },
      { key: "HIGHLIGHTS", enabled: true },
      { key: "WHY_US", enabled: true },
    ];

    const surfaces = landingSectionSurfaces(resolveLandingSections(stored)).filter(
      (surface) => surface !== "accentSoft",
    );

    surfaces.forEach((surface, index) => {
      if (index === 0) return;
      expect(surface).not.toBe(surfaces[index - 1]);
    });
  });

  it("gives the offer and call-to-action strips the accent wash wherever they sit", () => {
    const stored: LandingSectionConfigEntry[] = [
      { key: "HERO", enabled: true },
      { key: "CTA", enabled: true },
      { key: "OFFER", enabled: true },
    ];

    const sections = resolveLandingSections(stored);
    const surfaces = landingSectionSurfaces(sections);

    sections.forEach((section, index) => {
      if (section.key === "CTA" || section.key === "OFFER") {
        expect(surfaces[index]).toBe("accentSoft");
      }
    });
  });

  it("returns one surface per section", () => {
    const sections = resolveLandingSections(null);
    expect(landingSectionSurfaces(sections)).toHaveLength(sections.length);
  });

  /*
   * REGRESSION, restated for the arrangement that replaced the one that broke.
   *
   * The count used to start at ONE because the hero was a `surface` band drawn
   * ABOVE this list, invisible to it: starting at zero made the first folded
   * band `surface` too, and the two sat either side of the offer strip reading
   * as one block. Splitting the hero into the product and the order form put
   * every band into the list, so the whole page is now one sequence and this
   * asserts over all of it rather than over a filtered tail.
   */
  it("alternates across the whole page, hero included", () => {
    const surfaces = landingSectionSurfaces(resolveLandingSections(null));

    const content = surfaces.filter((surface) => surface !== "accentSoft");

    content.forEach((surface, index) => {
      if (index === 0) return;
      expect(surface).not.toBe(content[index - 1]);
    });
  });

  /*
   * The brand strip above the list carries the page surface and no background
   * of its own, so the first band has to open on `surface` for the two to read
   * as one top edge rather than as a strip over a differently coloured block.
   */
  it("opens the page on the plain surface", () => {
    expect(landingSectionSurfaces(resolveLandingSections(null))[0]).toBe("surface");
  });

  /*
   * The visible point of the split: the product and the form no longer share a
   * band, so in the default order they must not share a surface either — they
   * are adjacent, and two identical surfaces would put them back into the one
   * block the split took them out of.
   */
  it("separates the product from the order form", () => {
    const sections = resolveLandingSections(null);
    const surfaces = landingSectionSurfaces(sections);

    const hero = sections.findIndex((section) => section.key === "HERO");
    const form = sections.findIndex((section) => section.key === "ORDER_FORM");

    expect(form).toBe(hero + 1);
    expect(surfaces[form]).not.toBe(surfaces[hero]);
  });

  it("lets a caller with no band above it start from zero", () => {
    const sections = resolveLandingSections(null);
    const surfaces = landingSectionSurfaces(sections, 0);

    expect(surfaces[0]).toBe("surface");
  });
});
