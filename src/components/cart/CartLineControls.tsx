"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import {
  useRemoveItemMutation,
  useUpdateItemQuantityMutation,
} from "@/store/cartApi";
import type { CartLine } from "@/types/cart";

/** How long to wait for more clicks before sending the settled quantity. */
const DEBOUNCE_MS = 400;

/**
 * Quantity stepper and remove control for one cart line, shared by the drawer
 * and the cart page so the mutation/disable behaviour stays identical in both.
 *
 * The displayed quantity is local state that moves on every click, and the
 * server is told only the value the shopper settled on. That is why the
 * stepper buttons are never disabled mid-flight: waiting on a roundtrip per
 * click is what made stepping a quantity feel frozen. Remove still disables,
 * because there the row itself disappears and a second click is ambiguous.
 */
export function CartQuantityControl({
  line,
  size = "sm",
}: {
  line: CartLine;
  size?: "sm" | "md";
}) {
  const [updateQuantity] = useUpdateItemQuantityMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveItemMutation();

  const [quantity, setQuantity] = useState(line.quantity);
  const [error, setError] = useState("");

  // The last quantity the server confirmed — what a rejected change reverts to.
  const confirmed = useRef(line.quantity);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track the server's value when it changes underneath us (another tab, a
  // reseed after some other mutation), but never stomp on a pending edit.
  useEffect(() => {
    confirmed.current = line.quantity;
    if (timer.current === null) {
      setQuantity(line.quantity);
    }
  }, [line.quantity]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const iconSize = size === "md" ? 14 : 14;
  const padding = size === "md" ? "p-2" : "p-1.5";

  /** Restarts the debounce so a burst of clicks results in one request. */
  function scheduleUpdate(next: number) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      timer.current = null;
      updateQuantity({ itemId: line.id, quantity: next })
        .unwrap()
        .then(() => {
          confirmed.current = next;
        })
        .catch((err: unknown) => {
          setQuantity(confirmed.current);
          const data = (err as { data?: { message?: unknown } })?.data;
          setError(
            typeof data?.message === "string"
              ? data.message
              : "Couldn't update the quantity.",
          );
        });
    }, DEBOUNCE_MS);
  }

  function step(delta: number) {
    setError("");
    const next = quantity + delta;

    // The API rejects a quantity below 1, so stepping down from 1 removes the
    // line instead — matching what the shopper expects the minus button to do.
    if (next < 1) {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      void removeItem(line.id);
      return;
    }

    setQuantity(next);
    scheduleUpdate(next);
  }

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
