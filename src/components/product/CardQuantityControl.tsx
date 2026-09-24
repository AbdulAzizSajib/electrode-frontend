"use client";

import { Minus, Plus } from "lucide-react";
import { useCartQuantity } from "@/components/cart/useCartQuantity";
import { FOCUS_RING } from "@/lib/focus-ring";
import type { CartLine } from "@/types/cart";

/**
 * The quantity stepper a product card shows once its product is in the cart.
 *
 * Fills the card's action slot, so it is the same height as the "Add to cart"
 * button it replaces — a card that changed height on add would reflow the grid
 * around it, and in the slider would resize its neighbours.
 *
 * ── Why this is not `CartQuantityControl` with another `size` ────────────
 *
 * Only the markup differs, and it differs in ways a `size` prop cannot carry:
 * this one is full-width and brand-coloured to read as the card's primary
 * action, where the drawer's is a small bordered box beside a line. The
 * BEHAVIOUR is shared through `useCartQuantity` — the debounce, the revert, the
 * never-disabled buttons and the below-one removal all come from there, so this
 * cannot drift from the drawer's stepper.
 *
 * Stepping below one removes the line, and the card then goes back to showing
 * its purchase action — which happens for free, because the card renders this
 * only while a matching cart line exists.
 *
 * See server/openspec/changes/add-product-slider-and-card-quantity, design.md
 * Decision 5.
 */
export default function CardQuantityControl({
  line,
  productName,
}: {
  line: CartLine;
  /** Names the two buttons out of context, e.g. for a screen reader in a grid. */
  productName: string;
}) {
  const { quantity, error, step, isRemoving } = useCartQuantity(line);

  return (
    <div>
      <div className="flex min-h-11 w-full items-stretch justify-between overflow-hidden rounded border border-brand">
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={isRemoving}
          aria-label={`Decrease quantity of ${productName}`}
          className={`flex w-11 shrink-0 items-center justify-center bg-brand text-white transition-colors hover:opacity-90 disabled:opacity-40 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          <Minus size={14} />
        </button>

        {/*
         * `aria-live` so a shopper using a screen reader hears the new figure
         * without having to move focus off the button they are pressing.
         */}
        <span
          aria-live="polite"
          aria-label={`Quantity of ${productName}`}
          className="flex flex-1 items-center justify-center text-sm font-semibold tabular-nums text-gray-900"
        >
          {quantity}
        </span>

        <button
          type="button"
          onClick={() => step(1)}
          disabled={isRemoving}
          aria-label={`Increase quantity of ${productName}`}
          className={`flex w-11 shrink-0 items-center justify-center bg-brand text-white transition-colors hover:opacity-90 disabled:opacity-40 motion-reduce:transition-none ${FOCUS_RING}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-1 text-xs text-sale">
          {error}
        </p>
      )}
    </div>
  );
}
