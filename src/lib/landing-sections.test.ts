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
   * REGRESSION. The hero renders outside the folded list but is still a
   * `surface` band, so the count has to start at one. It started at zero, which
   * made the first folded content band `surface` as well — the two then sat
   * either side of the offer strip reading as one block, which is the exact
   * defect this function exists to prevent.
   *
   * The other tests here all filter to the folded content bands and so were
   * blind to it; only counting the hero catches it.
   */
  it("does not repeat the hero's surface on the first folded band", () => {
    const folded = resolveLandingSections(null).filter((section) => section.key !== "HERO");
    const surfaces = landingSectionSurfaces(folded);

    const firstContent = surfaces.find((surface) => surface !== "accentSoft");

    // The hero is "surface", so the first content band below it must not be.
    expect(firstContent).toBe("surfaceAlt");
  });

  it("alternates across the whole page once the hero is counted", () => {
    const folded = resolveLandingSections(null).filter((section) => section.key !== "HERO");
    const wholePage = ["surface" as const, ...landingSectionSurfaces(folded)];

    const content = wholePage.filter((surface) => surface !== "accentSoft");

    content.forEach((surface, index) => {
      if (index === 0) return;
      expect(surface).not.toBe(content[index - 1]);
    });
  });

  it("lets a caller with no band above it start from zero", () => {
    const sections = resolveLandingSections(null);
    const surfaces = landingSectionSurfaces(sections, 0);

    expect(surfaces[0]).toBe("surface");
  });
});
