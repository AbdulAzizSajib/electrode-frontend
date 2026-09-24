import type { CartLine } from "@/types/cart";

/**
 * The cart line a product card should step, if any.
 *
 * ── Why this is a module in `lib/` and not two lines in the card ─────────
 *
 * This repo's Vitest suite is `node`-environment and runs over `src/lib` only —
 * no DOM, no React renderer — so anything that must be PROVEN has to be a pure
 * module. This rule qualifies: getting it wrong means a shopper steps a variant
 * they did not choose, and the case that decides it (two variants of one
 * product in the cart) is reachable in about four clicks but easy to never
 * think of.
 *
 * ── The rule ─────────────────────────────────────────────────────────────
 *
 * A card matches a line on PRODUCT, and returns one only when the cart holds
 * exactly one line for that product. Two variants of one product are two lines,
 * and a listing card — which carries no variant of its own — cannot say which
 * of them a stepper would govern. Returning neither is deliberate: the card
 * then shows its purchase action, which leads to the chooser, where the shopper
 * names the variant themselves.
 *
 * Returning the FIRST match instead would step whichever line happened to be
 * earlier in the array, which is an arbitrary answer to a question the shopper
 * never asked.
 *
 * See server/openspec/changes/add-product-slider-and-card-quantity, design.md
 * Decision 4.
 */
export function cartLineForCard(lines: readonly CartLine[], productId: string): CartLine | undefined {
  const matches = lines.filter((line) => line.productId === productId);
  return matches.length === 1 ? matches[0] : undefined;
}
