import { describe, expect, it } from "vitest";
import { buildCompareRows, differingRows } from "@/lib/compare-rows";

const p = (...pairs: [string, string][]) => ({
  attributes: pairs.map(([name, value]) => ({ name, value })),
});

describe("buildCompareRows", () => {
  it("aligns a specification both products record", () => {
    const rows = buildCompareRows([
      p(["Connectivity", "Wi-Fi"]),
      p(["Connectivity", "Bluetooth"]),
    ]);

    expect(rows).toEqual([
      { name: "Connectivity", values: ["Wi-Fi", "Bluetooth"] },
    ]);
  });

  it("gives every product a cell when only one records the specification", () => {
    const rows = buildCompareRows([p(["Battery", "30h"]), p(["Colour", "Black"])]);

    // The union, and crucially every row is as wide as the product list — a
    // missing value is an explicit null, never a dropped cell that would shift
    // the column.
    expect(rows).toEqual([
      { name: "Battery", values: ["30h", null] },
      { name: "Colour", values: [null, "Black"] },
    ]);
    expect(rows.every((r) => r.values.length === 2)).toBe(true);
  });

  it("keeps first-seen order across products", () => {
    const rows = buildCompareRows([
      p(["B", "1"], ["A", "2"]),
      p(["C", "3"], ["A", "4"]),
    ]);

    expect(rows.map((r) => r.name)).toEqual(["B", "A", "C"]);
  });

  it("returns no rows for products with no specifications", () => {
    expect(buildCompareRows([p(), p()])).toEqual([]);
  });

  it("handles a single product", () => {
    expect(buildCompareRows([p(["Weight", "45g"])])).toEqual([
      { name: "Weight", values: ["45g"] },
    ]);
  });
});

describe("differingRows", () => {
  it("drops a row every product agrees on", () => {
    const rows = buildCompareRows([
      p(["Brand", "Vividus"], ["Battery", "30h"]),
      p(["Brand", "Vividus"], ["Battery", "20h"]),
    ]);

    expect(differingRows(rows).map((r) => r.name)).toEqual(["Battery"]);
  });

  it("treats a partially-recorded specification as a difference", () => {
    // The spec calls this out explicitly: absent is a distinct value, not
    // agreement. Without it, a specification only one product lists would be
    // hidden by the very filter meant to surface differences.
    const rows = buildCompareRows([p(["Battery", "30h"]), p()]);

    expect(differingRows(rows)).toHaveLength(1);
  });

  it("returns nothing when the products agree on everything", () => {
    const rows = buildCompareRows([p(["Brand", "Vividus"]), p(["Brand", "Vividus"])]);

    expect(differingRows(rows)).toEqual([]);
  });

  it("treats every row of a single product as differing only when it has one value", () => {
    // One product means one value per row, so nothing can differ.
    const rows = buildCompareRows([p(["Weight", "45g"])]);

    expect(differingRows(rows)).toEqual([]);
  });
});
