import { describe, expect, it } from "vitest";
import {
  DEFAULT_HERO_VARIANT,
  HERO_VARIANT_KEYS,
  resolveHeroVariant,
} from "@/lib/hero-variants";

describe("resolveHeroVariant", () => {
  it("returns every layout this storefront can render unchanged", () => {
    for (const variant of HERO_VARIANT_KEYS) {
      expect(resolveHeroVariant(variant)).toBe(variant);
    }
  });

  /*
   * The rule this module exists for. A server that offers a layout this build
   * has no component for must degrade to the hero the store has always had —
   * the alternative is an empty band above the fold, which a shopper cannot
   * tell apart from a broken site.
   */
  it("falls back to the default for a layout it does not know", () => {
    expect(resolveHeroVariant("SPLIT_FIVE")).toBe(DEFAULT_HERO_VARIANT);
    expect(resolveHeroVariant("split_three")).toBe(DEFAULT_HERO_VARIANT);
    expect(resolveHeroVariant("")).toBe(DEFAULT_HERO_VARIANT);
  });

  it("falls back to the default when nothing was sent", () => {
    expect(resolveHeroVariant(undefined)).toBe(DEFAULT_HERO_VARIANT);
    expect(resolveHeroVariant(null)).toBe(DEFAULT_HERO_VARIANT);
  });

  it("falls back to the default for a value that is not a string", () => {
    expect(resolveHeroVariant(0)).toBe(DEFAULT_HERO_VARIANT);
    expect(resolveHeroVariant(["SPLIT_ONE"])).toBe(DEFAULT_HERO_VARIANT);
    expect(resolveHeroVariant({ variant: "SPLIT_ONE" })).toBe(DEFAULT_HERO_VARIANT);
  });

  /*
   * Position 0 is the default in the backend's registry too, and the whole
   * no-existing-store-changes claim rests on it being SPLIT_THREE specifically.
   */
  it("defaults to the layout the storefront rendered before layouts existed", () => {
    expect(DEFAULT_HERO_VARIANT).toBe("SPLIT_THREE");
    expect(HERO_VARIANT_KEYS[0]).toBe("SPLIT_THREE");
  });
});
