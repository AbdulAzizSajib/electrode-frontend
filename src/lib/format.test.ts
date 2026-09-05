import { afterEach, describe, expect, it } from "vitest";
import { formatCount, formatPrice, setCurrencyFormat } from "@/lib/format";

/**
 * The format lives at module scope — see the note in `format.ts` on why nothing
 * that lives in React can serve both the server and client call sites. That
 * makes it shared state between tests, so every case that changes it puts the
 * default back.
 */
const DEFAULT_FORMAT = { symbol: "৳", position: "BEFORE" as const, decimals: 2 };

/** Spelled by codepoint, so a normalising editor cannot quietly make this pass. */
const NBSP = "\u00A0";

describe("formatPrice", () => {
  afterEach(() => setCurrencyFormat(DEFAULT_FORMAT));

  it("reproduces the storefront's previous rendering by default", () => {
    expect(formatPrice(1200.5)).toBe("৳1,200.50");
    expect(formatPrice(79.99)).toBe("৳79.99");
  });

  it("groups thousands, which the old hardcoded toFixed(2) did not", () => {
    expect(formatPrice(1234567.89)).toBe("৳1,234,567.89");
  });

  it("puts the symbol after the amount behind a non-breaking space", () => {
    setCurrencyFormat({ symbol: "৳", position: "AFTER", decimals: 2 });
    expect(formatPrice(1200)).toBe(`1,200.00${NBSP}৳`);
  });

  it("puts a leading symbol flush against the amount", () => {
    setCurrencyFormat({ symbol: "$", position: "BEFORE", decimals: 2 });
    expect(formatPrice(1200)).toBe("$1,200.00");
  });

  it("rounds the DISPLAYED figure at zero decimals, not the stored one", () => {
    setCurrencyFormat({ symbol: "৳", position: "BEFORE", decimals: 0 });
    expect(formatPrice(1200.5)).toBe("৳1,201");
  });

  it("pads to more decimals than the amount carries", () => {
    setCurrencyFormat({ symbol: "৳", position: "BEFORE", decimals: 4 });
    expect(formatPrice(1200.5)).toBe("৳1,200.5000");
  });

  it("never renders a bare number, whatever the format", () => {
    for (const position of ["BEFORE", "AFTER"] as const) {
      for (const decimals of [0, 1, 2, 3, 4]) {
        setCurrencyFormat({ symbol: "৳", position, decimals });
        expect(formatPrice(10)).toMatch(/৳/);
      }
    }
  });
});

describe("formatCount", () => {
  it("shows small counts exactly", () => {
    expect(formatCount(1)).toBe("1");
    expect(formatCount(22)).toBe("22");
    expect(formatCount(999)).toBe("999");
  });

  it("groups thousands below the compact threshold", () => {
    expect(formatCount(1_240)).toBe("1,240");
    expect(formatCount(9_999)).toBe("9,999");
  });

  it("compacts from ten thousand", () => {
    expect(formatCount(10_000)).toBe("10K");
    expect(formatCount(12_400)).toBe("12.4K");
    expect(formatCount(999_000)).toBe("999K");
  });

  it("compacts millions", () => {
    expect(formatCount(1_000_000)).toBe("1M");
    expect(formatCount(1_200_000)).toBe("1.2M");
  });

  it("drops a trailing .0 rather than showing 12.0K", () => {
    expect(formatCount(12_000)).toBe("12K");
    expect(formatCount(2_000_000)).toBe("2M");
  });

  it("formats zero, though the page renders nothing at zero", () => {
    expect(formatCount(0)).toBe("0");
  });
});
