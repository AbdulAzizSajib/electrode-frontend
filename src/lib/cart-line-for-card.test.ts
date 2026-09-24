import { describe, expect, it } from "vitest";
import { cartLineForCard } from "@/lib/cart-line-for-card";
import type { CartLine } from "@/types/cart";

const line = (over: Partial<CartLine>): CartLine => ({
  id: "li-1",
  productId: "p-1",
  variantId: null,
  quantity: 1,
  name: "Kashmiri Sidr Honey",
  slug: "honey",
  image: "",
  unitPrice: 2000,
  lineTotal: 2000,
  stockQuantity: 10,
  ...over,
});

/**
 * Which line a card steps.
 *
 * The last case is the one worth having a test for: it is reachable in a few
 * clicks, silently wrong if the rule returns the first match, and invisible to
 * any test that only ever puts one thing in the cart.
 */
describe("cartLineForCard", () => {
  it("offers nothing for an empty cart", () => {
    expect(cartLineForCard([], "p-1")).toBeUndefined();
  });

  it("offers nothing when the cart holds only other products", () => {
    expect(cartLineForCard([line({ productId: "p-2" })], "p-1")).toBeUndefined();
  });

  it("offers the line when the cart holds exactly one for this product", () => {
    const only = line({ id: "li-9", quantity: 3 });
    expect(cartLineForCard([line({ productId: "p-2" }), only], "p-1")).toBe(only);
  });

  it("offers the variant's line for a variable product added through a chooser", () => {
    const red = line({ id: "li-red", variantId: "v-red", quantity: 2 });
    expect(cartLineForCard([red], "p-1")).toBe(red);
  });

  /*
   * Two variants of one product are two lines, and a listing card carries no
   * variant of its own. Returning the first would step whichever happened to be
   * earlier in the array — an arbitrary answer, and the shopper would see a
   * quantity move on a variant they did not name.
   */
  it("offers NOTHING when the cart holds two variants of the same product", () => {
    const red = line({ id: "li-red", variantId: "v-red" });
    const white = line({ id: "li-white", variantId: "v-white" });
    expect(cartLineForCard([red, white], "p-1")).toBeUndefined();
  });

  it("is unaffected by other products' variants", () => {
    const mine = line({ id: "li-mine" });
    const theirs = [
      line({ id: "a", productId: "p-2", variantId: "v-1" }),
      line({ id: "b", productId: "p-2", variantId: "v-2" }),
    ];
    expect(cartLineForCard([...theirs, mine], "p-1")).toBe(mine);
  });
});
