import { describe, expect, it } from "vitest";
import { brandName, resolveBrandSlot, type BrandSettings } from "@/lib/brand-slot";

const HEADER_ART = "https://cdn.example.com/header-logo.png";
const FOOTER_ART = "https://cdn.example.com/footer-logo.png";

/** Both slots on text with no artwork — what a store that has never configured branding looks like. */
const settings = (over: Partial<BrandSettings> = {}): BrandSettings => ({
  storeName: "Gadgets",
  siteNameAccent: "Mart",
  logoUrl: null,
  footerLogoUrl: null,
  headerBrandMode: "TEXT",
  footerBrandMode: "TEXT",
  headerLogoHeight: 40,
  footerLogoHeight: 36,
  ...over,
});

describe("resolveBrandSlot — the mode decides", () => {
  it("renders the wordmark in TEXT mode even when artwork is uploaded", () => {
    // The property the whole feature rests on. If this ever fails, the mode has
    // been quietly reduced to "show the logo if there is one", and a merchant
    // can no longer keep footer artwork on file while showing text.
    const resolved = resolveBrandSlot(
      settings({ headerBrandMode: "TEXT", logoUrl: HEADER_ART }),
      "header",
    );

    expect(resolved).toEqual({ kind: "text" });
  });

  it("renders the header's own artwork in LOGO mode", () => {
    const resolved = resolveBrandSlot(
      settings({ headerBrandMode: "LOGO", logoUrl: HEADER_ART, footerLogoUrl: FOOTER_ART }),
      "header",
    );

    // Never the footer's, even when one is set.
    expect(resolved).toMatchObject({ kind: "logo", src: HEADER_ART });
  });

  it("shows a logo header above a wordmark footer", () => {
    // The case this change exists for, and the one a derived mode cannot express.
    const config = settings({
      headerBrandMode: "LOGO",
      footerBrandMode: "TEXT",
      logoUrl: HEADER_ART,
      footerLogoUrl: FOOTER_ART,
    });

    expect(resolveBrandSlot(config, "header")).toMatchObject({ kind: "logo", src: HEADER_ART });
    expect(resolveBrandSlot(config, "footer")).toEqual({ kind: "text" });
  });

  it("shows a wordmark header above a logo footer", () => {
    const config = settings({
      headerBrandMode: "TEXT",
      footerBrandMode: "LOGO",
      logoUrl: HEADER_ART,
      footerLogoUrl: FOOTER_ART,
    });

    expect(resolveBrandSlot(config, "header")).toEqual({ kind: "text" });
    expect(resolveBrandSlot(config, "footer")).toMatchObject({ kind: "logo", src: FOOTER_ART });
  });

  it("leaves the other slot untouched when one slot's mode changes", () => {
    const before = settings({ headerBrandMode: "LOGO", logoUrl: HEADER_ART });
    const after = { ...before, footerBrandMode: "LOGO" as const, footerLogoUrl: FOOTER_ART };

    expect(resolveBrandSlot(after, "header")).toEqual(resolveBrandSlot(before, "header"));
  });
});

describe("resolveBrandSlot — the footer's fallback", () => {
  it("prefers the footer's own artwork", () => {
    const resolved = resolveBrandSlot(
      settings({ footerBrandMode: "LOGO", logoUrl: HEADER_ART, footerLogoUrl: FOOTER_ART }),
      "footer",
    );

    expect(resolved).toMatchObject({ kind: "logo", src: FOOTER_ART });
  });

  it("falls back to the header's artwork when the footer has none", () => {
    // The behaviour the admin panel has always described and that nothing
    // implemented until this change.
    const resolved = resolveBrandSlot(
      settings({ footerBrandMode: "LOGO", logoUrl: HEADER_ART, footerLogoUrl: null }),
      "footer",
    );

    expect(resolved).toMatchObject({ kind: "logo", src: HEADER_ART });
  });

  it("treats a cleared footer logo as absent rather than as an empty image", () => {
    // A cleared field can arrive as "" rather than null. Rendering an <img> with
    // an empty src re-requests the page itself, so it must fall through.
    const resolved = resolveBrandSlot(
      settings({ footerBrandMode: "LOGO", logoUrl: HEADER_ART, footerLogoUrl: "" }),
      "footer",
    );

    expect(resolved).toMatchObject({ kind: "logo", src: HEADER_ART });
  });
});

describe("resolveBrandSlot — a slot never renders empty", () => {
  it("degrades to the wordmark when LOGO mode has no artwork anywhere", () => {
    // A blank brand block would appear on every page of the site.
    expect(resolveBrandSlot(settings({ headerBrandMode: "LOGO" }), "header")).toEqual({
      kind: "text",
    });
    expect(resolveBrandSlot(settings({ footerBrandMode: "LOGO" }), "footer")).toEqual({
      kind: "text",
    });
  });

  it("degrades to the wordmark when the header logo is an empty string", () => {
    expect(
      resolveBrandSlot(settings({ headerBrandMode: "LOGO", logoUrl: "" }), "header"),
    ).toEqual({ kind: "text" });
  });

  it("renders the wordmark in both slots for a store that never configured branding", () => {
    // The defaults, which is what every existing store reads as after the
    // additive migration — so this change is invisible until a merchant acts.
    expect(resolveBrandSlot(settings(), "header")).toEqual({ kind: "text" });
    expect(resolveBrandSlot(settings(), "footer")).toEqual({ kind: "text" });
  });

  it("renders the wordmark for a store that uploaded logos before modes existed", () => {
    const config = settings({ logoUrl: HEADER_ART, footerLogoUrl: FOOTER_ART });

    expect(resolveBrandSlot(config, "header")).toEqual({ kind: "text" });
    expect(resolveBrandSlot(config, "footer")).toEqual({ kind: "text" });
  });
});

describe("resolveBrandSlot — accessible name and height", () => {
  it("labels a logo with the composed wordmark", () => {
    // So the shop is announced identically in either mode, and a logo that
    // fails to load still says who the shop is.
    const resolved = resolveBrandSlot(
      settings({ headerBrandMode: "LOGO", logoUrl: HEADER_ART }),
      "header",
    );

    expect(resolved).toMatchObject({ alt: "Gadgets Mart" });
  });

  it("labels a logo with the store name alone when there is no accent half", () => {
    const resolved = resolveBrandSlot(
      settings({ headerBrandMode: "LOGO", logoUrl: HEADER_ART, siteNameAccent: "" }),
      "header",
    );

    // Not "Gadgets " with a trailing space.
    expect(resolved).toMatchObject({ alt: "Gadgets" });
  });

  it("carries each slot's own height", () => {
    const config = settings({
      headerBrandMode: "LOGO",
      footerBrandMode: "LOGO",
      logoUrl: HEADER_ART,
      footerLogoUrl: FOOTER_ART,
      headerLogoHeight: 64,
      footerLogoHeight: 28,
    });

    // The heights are independent — the reserved box is what prevents layout
    // shift, so each slot must get its own.
    expect(resolveBrandSlot(config, "header")).toMatchObject({ height: 64 });
    expect(resolveBrandSlot(config, "footer")).toMatchObject({ height: 28 });
  });
});

describe("brandName", () => {
  it("joins the store name and its accent half", () => {
    expect(brandName({ storeName: "Gadgets", siteNameAccent: "Mart" })).toBe("Gadgets Mart");
  });

  it("omits an empty accent half rather than leaving a trailing space", () => {
    expect(brandName({ storeName: "Gadgets", siteNameAccent: "" })).toBe("Gadgets");
  });
});
