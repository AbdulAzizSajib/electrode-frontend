"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useRemoveItemMutation,
  useUpdateItemQuantityMutation,
} from "@/store/cartApi";
import type { CartLine } from "@/types/cart";

/** How long to wait for more clicks before sending the settled quantity. */
const DEBOUNCE_MS = 400;

/**
 * Stepping one cart line's quantity — everything except the markup.
 *
 * Extracted from `CartQuantityControl` when the PRODUCT CARD gained a stepper
 * of its own. The card renders differently (it fills the card's action slot,
 * at the card's own size) but must behave identically, and the alternative was
 * two implementations of "what happens when a shopper clicks + five times and
 * one request fails" — with the second one being the new, untested copy. The
 * card is also the most exposed to a burst of clicks, since it sits in a grid
 * the shopper is scanning.
 *
 * Four behaviours live here, and each exists because its absence was worse:
 *
 * - **The displayed quantity is local state that moves on every click**, and
 *   the server is told only the value the shopper settled on. This is why the
 *   stepper buttons are NEVER disabled mid-flight: waiting on a roundtrip per
 *   click is what made stepping a quantity feel frozen.
 * - **A 400 ms trailing debounce** collapses a burst into one request.
 * - **`confirmed` holds the last server-confirmed value**, and a rejected
 *   change reverts to it rather than leaving the card showing a quantity the
 *   cart does not hold.
 * - **An external change never stomps a pending edit.** The server's value can
 *   move underneath (another tab, a reseed after some other mutation); it is
 *   tracked always, but only displayed when nothing is in flight.
 *
 * Stepping below 1 REMOVES the line, because the API rejects a quantity of 0
 * and that is what a shopper expects the minus button to do at 1.
 *
 * See server/openspec/changes/add-product-slider-and-card-quantity, design.md
 * Decision 5.
 */
export function useCartQuantity(line: CartLine) {
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

  /** Restarts the debounce so a burst of clicks results in one request. */
  const scheduleUpdate = useCallback(
    (next: number) => {
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
    },
    [line.id, updateQuantity],
  );

  const step = useCallback(
    (delta: number) => {
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
    },
    [quantity, line.id, removeItem, scheduleUpdate],
  );

  return { quantity, error, step, isRemoving };
}
