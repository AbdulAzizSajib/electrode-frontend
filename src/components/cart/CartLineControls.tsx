"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { useRemoveItemMutation } from "@/store/cartApi";
import { useCartQuantity } from "@/components/cart/useCartQuantity";
import type { CartLine } from "@/types/cart";

/**
 * Quantity stepper and remove control for one cart line, shared by the drawer
 * and the cart page so the mutation/disable behaviour stays identical in both.
 *
 * The behaviour lives in `useCartQuantity` — the debounce, the revert, the
 * never-disabled buttons and the below-one removal — because the PRODUCT CARD
 * now needs the same behaviour behind different markup. Read that hook's
 * header for why each rule is there; this component is the drawer's and the
 * cart page's rendering of it and nothing more.
 *
 * Remove still disables while in flight, because there the row itself
 * disappears and a second click is ambiguous.
 */
export function CartQuantityControl({
  line,
  size = "sm",
}: {
  line: CartLine;
  size?: "sm" | "md";
}) {
  const { quantity, error, step, isRemoving } = useCartQuantity(line);

  const iconSize = size === "md" ? 14 : 14;
  const padding = size === "md" ? "p-2" : "p-1.5";

  return (
    <div>
      <div className="flex w-fit items-center gap-2 rounded border border-gray-300">
        <button
          className={`${padding} disabled:opacity-40`}
          onClick={() => step(-1)}
          disabled={isRemoving}
          aria-label="Decrease quantity"
        >
          <Minus size={iconSize} />
        </button>
        <span className="w-6 text-center text-sm">{quantity}</span>
        <button
          className={`${padding} disabled:opacity-40`}
          onClick={() => step(1)}
          disabled={isRemoving}
          aria-label="Increase quantity"
        >
          <Plus size={iconSize} />
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

export function CartRemoveButton({
  line,
  className,
  withLabel = false,
}: {
  line: CartLine;
  className?: string;
  withLabel?: boolean;
}) {
  const [removeItem, { isLoading }] = useRemoveItemMutation();

  return (
    <button
      onClick={() => void removeItem(line.id)}
      disabled={isLoading}
      className={`text-gray-400 hover:text-sale disabled:opacity-40 ${className ?? ""}`}
      aria-label="Remove item"
    >
      {withLabel ? (
        <span className="flex items-center gap-1 text-xs">
          <Trash2 size={14} /> Remove
        </span>
      ) : (
        <Trash2 size={16} />
      )}
    </button>
  );
}
