import { describe, expect, it } from "vitest";
import type { Product, ProductOption, ProductVariant } from "@/types/product";
import {
  choicesForVariant,
  defaultVariant,
  presentedOptions,
  resolveOptions,
  resolveVariant,
  SYNTHETIC_OPTION_ID,
} from "@/lib/product-options";

const variant = (
  id: string,
  optionValueIds: string[],
  stock = 5,
): ProductVariant => ({
  id,
  name: id,
  sku: id,
  price: 100,
  stockQuantity: stock,
  attributes: {},
  inStock: stock > 0,
  optionValueIds,
});

const option = (
  id: string,
  name: string,
  values: string[],
  presentation: ProductOption["presentation"] = "LABEL",
): ProductOption => ({
  id,
  name,
  presentation,
  values: values.map((v) => ({ id: v, label: v.toUpperCase() })),
});

const product = (
  options: ProductOption[],
  variants: ProductVariant[],
): Product =>
  ({
    id: "p",
    slug: "p",
    name: "P",
    sku: "p",
    type: options.length > 0 ? "VARIABLE" : "SIMPLE",
    isVariable: options.length > 0,
    price: 100,
    image: "",
    images: [],
    stockQuantity: 10,
    inStock: true,
    isFeatured: false,
    reviewCount: 0,
    viewCount: 0,
    options,
    variants,
    attributes: [],
  }) as Product;

/** Colour(red|green) x Size(s|m) with only three of the four combinations made. */
const colour = option("o-colour", "Colour", ["red", "green"], "SWATCH");
const size = option("o-size", "Size", ["s", "m"]);
const twoOption = product(
  [colour, size],
  [
    variant("v-red-s", ["red", "s"]),
    variant("v-red-m", ["red", "m"], 0), // exists but sold out
    variant("v-green-s", ["green", "s"]),
    // green/m is never made
  ],
);

describe("presentedOptions", () => {
  it("returns the product's own options when it has them", () => {
    expect(presentedOptions(twoOption).map((o) => o.name)).toEqual([
      "Colour",
      "Size",
    ]);
  });

  it("invents one option from variant names for a product with none", () => {
    const legacy = product([], [variant("v-white", []), variant("v-black", [])]);
    const options = presentedOptions(legacy);

    expect(options).toHaveLength(1);
    expect(options[0].id).toBe(SYNTHETIC_OPTION_ID);
    expect(options[0].values.map((v) => v.id)).toEqual(["v-white", "v-black"]);
  });

  it("returns nothing for a product with neither options nor variants", () => {
    expect(presentedOptions(product([], []))).toEqual([]);
  });
});

describe("resolveVariant", () => {
  it("resolves a complete selection to one variant", () => {
    const v = resolveVariant(twoOption, { "o-colour": "red", "o-size": "s" });
    expect(v?.id).toBe("v-red-s");
  });

  it("returns null while the selection is incomplete", () => {
    expect(resolveVariant(twoOption, { "o-colour": "red" })).toBeNull();
    expect(resolveVariant(twoOption, {})).toBeNull();
  });

  it("returns null for a combination no variant provides", () => {
    expect(
      resolveVariant(twoOption, { "o-colour": "green", "o-size": "m" }),
    ).toBeNull();
  });

  it("resolves the synthetic option to the variant it names", () => {
    const legacy = product([], [variant("v-white", []), variant("v-black", [])]);
    const v = resolveVariant(legacy, { [SYNTHETIC_OPTION_ID]: "v-black" });
    expect(v?.id).toBe("v-black");
  });

  it("does not throw when a variant violates one-value-per-option", () => {
    // A variant carrying only one value on a two-option product — reachable
    // through a direct DB edit. It must degrade, not crash.
    const broken = product([colour, size], [variant("v-bad", ["red"])]);
    expect(() =>
      resolveVariant(broken, { "o-colour": "red", "o-size": "s" }),
    ).not.toThrow();
    expect(resolveVariant(broken, { "o-colour": "red", "o-size": "s" })).toBeNull();
  });
});

describe("resolveOptions", () => {
  it("reports which options are still unanswered", () => {
    const r = resolveOptions(twoOption, { "o-colour": "red" });

    expect(r.isComplete).toBe(false);
    expect(r.unansweredNames).toEqual(["Size"]);
    expect(r.variant).toBeNull();
  });

  it("is complete once every option is answered", () => {
    const r = resolveOptions(twoOption, { "o-colour": "red", "o-size": "s" });

    expect(r.isComplete).toBe(true);
    expect(r.unansweredNames).toEqual([]);
    expect(r.variant?.id).toBe("v-red-s");
  });

  it("returns every authored value regardless of availability", () => {
    // The spec forbids hiding; the shape must make hiding hard to do by accident.
    const r = resolveOptions(twoOption, { "o-colour": "green" });

    expect(r.options.map((o) => o.values.length)).toEqual([2, 2]);
  });

  it("marks a size no variant provides in the chosen colour as unavailable", () => {
    const r = resolveOptions(twoOption, { "o-colour": "green" });
    const sizes = r.options.find((o) => o.name === "Size")!;

    expect(sizes.values.find((v) => v.id === "s")!.isAvailable).toBe(true);
    // green/m is never made.
    expect(sizes.values.find((v) => v.id === "m")!.isAvailable).toBe(false);
  });

  it("marks an out-of-stock combination as unavailable", () => {
    const r = resolveOptions(twoOption, { "o-colour": "red" });
    const sizes = r.options.find((o) => o.name === "Size")!;

    // red/m exists but has no stock.
    expect(sizes.values.find((v) => v.id === "m")!.isAvailable).toBe(false);
  });

  it("recomputes availability when the other choice changes", () => {
    const withGreen = resolveOptions(twoOption, { "o-colour": "green" });
    const withRed = resolveOptions(twoOption, { "o-colour": "red" });

    const sizeM = (r: ReturnType<typeof resolveOptions>) =>
      r.options.find((o) => o.name === "Size")!.values.find((v) => v.id === "m")!;

    expect(sizeM(withGreen).isAvailable).toBe(false);
    expect(sizeM(withRed).isAvailable).toBe(false);

    // Both unavailable for different reasons — never made vs out of stock — and
    // 's' stays available under either colour.
    const sizeS = (r: ReturnType<typeof resolveOptions>) =>
      r.options.find((o) => o.name === "Size")!.values.find((v) => v.id === "s")!;
    expect(sizeS(withGreen).isAvailable).toBe(true);
    expect(sizeS(withRed).isAvailable).toBe(true);
  });

  it("marks a value available before any choice if any variant carries it", () => {
    const r = resolveOptions(twoOption, {});
    const sizes = r.options.find((o) => o.name === "Size")!;

    expect(sizes.values.find((v) => v.id === "s")!.isAvailable).toBe(true);
    // 'm' exists only as the sold-out red/m.
    expect(sizes.values.find((v) => v.id === "m")!.isAvailable).toBe(false);
  });

  it("carries the option's presentation and swatch through", () => {
    const r = resolveOptions(twoOption, {});
    expect(r.options.find((o) => o.name === "Colour")!.presentation).toBe("SWATCH");
    expect(r.options.find((o) => o.name === "Size")!.presentation).toBe("LABEL");
  });

  it("marks the chosen value as selected", () => {
    const r = resolveOptions(twoOption, { "o-colour": "red" });
    const colours = r.options.find((o) => o.name === "Colour")!;

    expect(colours.values.find((v) => v.id === "red")!.isSelected).toBe(true);
    expect(colours.values.find((v) => v.id === "green")!.isSelected).toBe(false);
  });

  it("presents a legacy product as one answered option", () => {
    const legacy = product([], [variant("v-white", []), variant("v-black", [])]);
    const r = resolveOptions(legacy, { [SYNTHETIC_OPTION_ID]: "v-white" });

    expect(r.options).toHaveLength(1);
    expect(r.isComplete).toBe(true);
    expect(r.variant?.id).toBe("v-white");
  });

  it("marks a sold-out legacy variant unavailable", () => {
    const legacy = product([], [variant("v-a", []), variant("v-b", [], 0)]);
    const r = resolveOptions(legacy, {});
    const values = r.options[0].values;

    expect(values.find((v) => v.id === "v-a")!.isAvailable).toBe(true);
    expect(values.find((v) => v.id === "v-b")!.isAvailable).toBe(false);
  });

  it("handles a product with no variants at all", () => {
    const simple = product([], []);
    const r = resolveOptions(simple, {});

    expect(r.options).toEqual([]);
    expect(r.isComplete).toBe(false);
    expect(r.variant).toBeNull();
    expect(r.unansweredNames).toEqual([]);
  });
});

describe("choicesForVariant", () => {
  it("produces the choices that select a variant", () => {
    expect(choicesForVariant(twoOption, twoOption.variants[0])).toEqual({
      "o-colour": "red",
      "o-size": "s",
    });
  });

  it("round-trips through resolveVariant", () => {
    for (const v of twoOption.variants) {
      expect(resolveVariant(twoOption, choicesForVariant(twoOption, v))?.id).toBe(
        v.id,
      );
    }
  });

  it("uses the variant id for a legacy product", () => {
    const legacy = product([], [variant("v-white", [])]);
    expect(choicesForVariant(legacy, legacy.variants[0])).toEqual({
      [SYNTHETIC_OPTION_ID]: "v-white",
    });
  });

  it("returns nothing for no variant", () => {
    expect(choicesForVariant(twoOption, null)).toEqual({});
  });
});

describe("defaultVariant", () => {
  it("prefers the first in-stock variant", () => {
    const p = product([], [variant("v-out", [], 0), variant("v-in", [])]);
    expect(defaultVariant(p)?.id).toBe("v-in");
  });

  it("falls back to the first variant when all are sold out", () => {
    const p = product([], [variant("v-a", [], 0), variant("v-b", [], 0)]);
    expect(defaultVariant(p)?.id).toBe("v-a");
  });

  it("returns null when there are no variants", () => {
    expect(defaultVariant(product([], []))).toBeNull();
  });
});
