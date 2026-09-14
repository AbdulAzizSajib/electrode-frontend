/**
 * Which pixel fires where.
 *
 * Both failure directions cost real money and neither is visible from the
 * storefront: firing two pixels double-counts a campaign's conversions, and
 * falling back to the shop-wide id on a page that set its own moves those
 * conversions into the wrong pixel. A merchant acts on both numbers by changing
 * ad spend.
 */
import { describe, expect, it } from "vitest";
import { resolveLandingPixelId, resolveShopPixelId } from "@/lib/facebook-pixel";
import type { FacebookPixel } from "@/types/store-settings";

const pixel = (over: Partial<FacebookPixel> = {}): FacebookPixel => ({
  enabled: true,
  pixelId: "1247199439643328",
  ...over,
});

describe("resolveShopPixelId", () => {
  it("returns the id when enabled and configured", () => {
    expect(resolveShopPixelId(pixel())).toBe("1247199439643328");
  });

  it("returns null when switched off, even with an id stored", () => {
    // Disabling must not require discarding the id — a merchant switching
    // tracking off should not have to find it again in Events Manager.
    expect(resolveShopPixelId(pixel({ enabled: false }))).toBeNull();
  });

  it("returns null when enabled with no id", () => {
    expect(resolveShopPixelId(pixel({ pixelId: "" }))).toBeNull();
  });

  it("treats a whitespace-only id as unset", () => {
    // Otherwise the bootstrap renders with a blank id and every event is
    // silently rejected by Meta.
    expect(resolveShopPixelId(pixel({ pixelId: "   " }))).toBeNull();
  });

  it("returns null for missing settings", () => {
    // The storefront's fallback settings reach here when the API is unreachable.
    // Failing towards OFF is the only safe direction: a fallback id would
    // attribute one shop's conversions to another.
    expect(resolveShopPixelId(undefined)).toBeNull();
    expect(resolveShopPixelId(null)).toBeNull();
  });
});

describe("resolveLandingPixelId", () => {
  it("prefers the landing page's own pixel", () => {
    // A merchant who set a pixel on a campaign chose it for that campaign.
    expect(resolveLandingPixelId("999888777", pixel())).toBe("999888777");
  });

  it("falls back to the shop-wide pixel when the page has none", () => {
    // A landing page must never be LESS measured than the rest of the shop.
    expect(resolveLandingPixelId(null, pixel())).toBe("1247199439643328");
    expect(resolveLandingPixelId("", pixel())).toBe("1247199439643328");
  });

  it("uses the page's own pixel even when the shop-wide one is off", () => {
    // The shop-wide toggle governs the shop-wide pixel, not a campaign's.
    expect(resolveLandingPixelId("999888777", pixel({ enabled: false }))).toBe("999888777");
  });

  it("returns null when neither is set", () => {
    expect(resolveLandingPixelId(null, pixel({ pixelId: "" }))).toBeNull();
    expect(resolveLandingPixelId(undefined, undefined)).toBeNull();
  });

  it("never returns both — exactly one id, or none", () => {
    // The precedence is resolved where the id is CHOSEN rather than by
    // suppressing a second event afterwards, so there is structurally only ever
    // one id to fire with.
    const resolved = resolveLandingPixelId("999888777", pixel());
    expect(resolved).toBe("999888777");
    expect(resolved).not.toBe("1247199439643328");
  });
});
