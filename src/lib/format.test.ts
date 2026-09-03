import { describe, expect, it } from "vitest";
import { formatCount } from "@/lib/format";

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
