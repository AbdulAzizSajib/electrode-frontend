import { describe, expect, it } from "vitest";
import {
  DEFAULT_GRID_COLUMNS,
  PRODUCT_GRID_CLASS,
  PRODUCT_GRID_COLUMNS,
  PRODUCT_SLIDER_SKELETON_CARD_CLASS,
  homeRowSize,
  productCardSizes,
  relatedCount,
  resolveGridColumns,
} from "./product-grid";

describe("resolveGridColumns", () => {
  it.each([4, 5, 6] as const)("keeps %i", (n) => {
    expect(resolveGridColumns(n)).toBe(n);
  });

  it.each([3, 7, 4.5, "5", undefined, null, {}])("renders %j as six across", (value) => {
    expect(resolveGridColumns(value)).toBe(6);
  });

  it("defaults to the grid every shop had before", () => {
    expect(DEFAULT_GRID_COLUMNS).toBe(6);
  });
});

describe("PRODUCT_GRID_CLASS", () => {
  it.each(PRODUCT_GRID_COLUMNS)("gives %i columns its own literal lg class and no other", (n) => {
    const classes = PRODUCT_GRID_CLASS[n].split(" ");
    expect(classes).toContain(`lg:grid-cols-${n}`);
    expect(classes.filter((c) => c.startsWith("lg:grid-cols-"))).toHaveLength(1);
  });

  it("keeps the phone and tablet grid and the gap the same at every count", () => {
    const strip = (s: string) => s.replace(/ lg:grid-cols-\d$/, "");
    expect(new Set(PRODUCT_GRID_COLUMNS.map((n) => strip(PRODUCT_GRID_CLASS[n]))).size).toBe(1);
  });
});

describe("PRODUCT_SLIDER_SKELETON_CARD_CLASS", () => {
  it.each(PRODUCT_GRID_COLUMNS)("sizes a skeleton card for %i across with the 1.25rem gap", (n) => {
    const gaps = (n - 1) * 1.25;
    expect(PRODUCT_SLIDER_SKELETON_CARD_CLASS[n]).toContain(`lg:w-[calc((100%-${gaps}rem)/${n})]`);
  });
});

describe("productCardSizes", () => {
  it.each([
    [4, 25],
    [5, 20],
    [6, 17],
  ] as const)("asks for an image a %i-across card can fill", (n, vw) => {
    expect(productCardSizes(n)).toBe(`(min-width: 1024px) ${vw}vw, (min-width: 640px) 33vw, 50vw`);
  });
});

describe("homeRowSize", () => {
  it.each([
    [6, 12],
    [5, 10],
    [4, 12],
  ] as const)("at %i across asks for %i products", (n, size) => {
    expect(homeRowSize(n)).toBe(size);
  });

  it.each(PRODUCT_GRID_COLUMNS)("fills whole rows at %i across and never exceeds twelve", (n) => {
    expect(homeRowSize(n) % n).toBe(0);
    expect(homeRowSize(n)).toBeLessThanOrEqual(12);
  });
});

describe("relatedCount", () => {
  it.each(PRODUCT_GRID_COLUMNS)("shows one row of %i, within the six the page fetches", (n) => {
    expect(relatedCount(n)).toBe(n);
    expect(relatedCount(n)).toBeLessThanOrEqual(6);
  });
});
