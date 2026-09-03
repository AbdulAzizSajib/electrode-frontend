import { describe, expect, it } from "vitest";
import reducer, {
  addToCompare,
  clearCompare,
  hydrateCompare,
  removeFromCompare,
} from "@/store/compareSlice";
import { COMPARE_LIMIT } from "@/lib/compare-storage";

const empty = { slugs: [], isHydrated: false };
const withSlugs = (slugs: string[]) => ({ slugs, isHydrated: true });

describe("compareSlice", () => {
  it("adds a product", () => {
    expect(reducer(empty, addToCompare("a")).slugs).toEqual(["a"]);
  });

  it("does not add the same product twice", () => {
    const state = reducer(withSlugs(["a"]), addToCompare("a"));
    expect(state.slugs).toEqual(["a"]);
  });

  it("removes a product", () => {
    const state = reducer(withSlugs(["a", "b"]), removeFromCompare("a"));
    expect(state.slugs).toEqual(["b"]);
  });

  it("removing a product that is not in the list is a no-op", () => {
    expect(reducer(withSlugs(["a"]), removeFromCompare("z")).slugs).toEqual(["a"]);
  });

  it("clears the list", () => {
    expect(reducer(withSlugs(["a", "b"]), clearCompare()).slugs).toEqual([]);
  });

  it("refuses to add past the limit, dropping nothing", () => {
    const full = withSlugs(
      Array.from({ length: COMPARE_LIMIT }, (_, i) => `p${i}`),
    );

    const state = reducer(full, addToCompare("one-too-many"));

    // The spec's requirement: the list is unchanged and no existing product is
    // silently evicted to make room.
    expect(state.slugs).toEqual(full.slugs);
    expect(state.slugs).not.toContain("one-too-many");
  });

  it("makes room after a removal", () => {
    const full = withSlugs(
      Array.from({ length: COMPARE_LIMIT }, (_, i) => `p${i}`),
    );

    const afterRemove = reducer(full, removeFromCompare("p0"));
    const afterAdd = reducer(afterRemove, addToCompare("new"));

    expect(afterAdd.slugs).toContain("new");
    expect(afterAdd.slugs).toHaveLength(COMPARE_LIMIT);
  });

  it("is not hydrated until hydrate runs", () => {
    expect(empty.isHydrated).toBe(false);
    expect(reducer(empty, hydrateCompare([])).isHydrated).toBe(true);
  });

  it("hydrates from storage and clamps an over-long stored list", () => {
    const stored = Array.from({ length: COMPARE_LIMIT + 3 }, (_, i) => `p${i}`);

    const state = reducer(empty, hydrateCompare(stored));

    expect(state.slugs).toHaveLength(COMPARE_LIMIT);
    expect(state.isHydrated).toBe(true);
  });
});
