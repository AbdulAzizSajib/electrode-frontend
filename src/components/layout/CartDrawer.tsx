"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import {
  CartQuantityControl,
  CartRemoveButton,
} from "@/components/cart/CartLineControls";
import { useScrollLock } from "@/components/providers/SmoothScrollProvider";
import { formatPrice } from "@/lib/format";
import { EMPTY_CART, useGetCartQuery } from "@/store/cartApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeCart, selectIsCartOpen } from "@/store/uiSlice";

/**
 * Longest the exit animation is allowed to take before the drawer is torn down
 * regardless. `transitionend` normally ends the exit, but it never fires if the
 * panel is hidden mid-transition (a route change unmounting an ancestor, a
 * background tab throttling frames) — without this the drawer would be stranded
 * on screen, covering the page with no way to dismiss it.
 */
const EXIT_FALLBACK_MS = 500;

type Phase = "closed" | "open" | "closing";

/** Focusable descendants, in DOM order, for the tab cycle. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCartOpen);

  /*
   * Visibility is a three-phase machine rather than a mirror of `isOpen`,
   * because the drawer has to outlive its own close: rendering `null` the frame
   * `isOpen` goes false (as this component used to) leaves no element to
   * animate out.
   *
   * closed  -> nothing rendered, nothing focusable, nothing to click
   * open    -> rendered at rest
   * closing -> rendered in the exit position, torn down when the motion ends
   */
  const [exiting, setExiting] = useState(false);

  // Drives the enter transition. Kept separate from `phase` because the panel
  // must first paint off-screen and only then move to its resting position —
  // mounting it already at rest gives React nothing to transition between.
  const [entered, setEntered] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  // The element focus returns to on close — captured at open time, since the
  // cart is opened from several places (header button, mobile bottom nav).
  const openerRef = useRef<HTMLElement | null>(null);

  /*
   * Derived, not stored: `isOpen` alone decides "open", so the only thing that
   * needs remembering is whether a drawer that has left `isOpen` is still
   * animating out (`exiting`). Reopening mid-close therefore needs no special
   * case — `isOpen` flips back to true and this reads "open" again, with
   * `entered` still true so the panel travels back from wherever it had reached.
   */
  const phase: Phase = isOpen ? "open" : exiting ? "closing" : "closed";

  // `skip` keeps a fully closed drawer from holding a subscription; the header's
  // own query still keeps the cart cached, so opening is instant. Kept alive
  // through `closing` so the contents don't blank out mid-animation.
  const { data: cart = EMPTY_CART, isError } = useGetCartQuery(undefined, {
    skip: phase === "closed",
  });

  useEffect(() => {
    if (!isOpen) return;
    openerRef.current ??= document.activeElement as HTMLElement | null;
  }, [isOpen]);

  // Flip to the resting position one frame after mount, so the browser has a
  // painted starting position to transition from.
  useEffect(() => {
    if (phase !== "open") return;
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  // Leaving "open" starts the exit: mark it pending, and send the panel back
  // off-screen so there is a transition for `transitionend` to report.
  useEffect(() => {
    if (isOpen) {
      // Opening cancels any exit still pending from a previous close.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExiting(false);
      return;
    }
    // Only a drawer already on screen has anything to animate out; `entered`
    // is false on a drawer that was never opened.
    setExiting(entered);
    setEntered(false);
    // `entered` is read as the current on-screen state, not tracked — adding it
    // to the deps would re-run this on the enter transition and cancel the exit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Backstop for a `transitionend` that never arrives — see EXIT_FALLBACK_MS.
  useEffect(() => {
    if (phase !== "closing") return;
    const timer = window.setTimeout(() => setExiting(false), EXIT_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Restore focus once the drawer is fully gone. Deferred to "closed" so focus
  // doesn't jump away while the panel is still visibly on screen.
  useEffect(() => {
    if (phase !== "closed") return;
    openerRef.current?.focus?.();
    openerRef.current = null;
  }, [phase]);

  const close = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  const isVisible = phase !== "closed";
  useScrollLock(isVisible);

  // Move focus into the panel on open, and keep Tab cycling inside it.
  useEffect(() => {
    if (phase !== "open") return;
    const panel = panelRef.current;
    if (!panel) return;

    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const targets = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (targets.length === 0) return;

      const first = targets[0];
      const last = targets[targets.length - 1];
      const active = document.activeElement;

      // Wrap at both ends, and pull focus back in if it has escaped the panel
      // entirely (which is what would otherwise let Tab reach the page behind).
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [phase, close]);

  // Nothing rendered while closed: no pointer target, no tab stop, nothing
  // exposed to assistive technology — the inert-when-closed requirement, for free.
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
      <div
        className={clsx(
          "absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out motion-reduce:transition-none",
          entered ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <div
        ref={panelRef}
        // The exit ends when the panel's own transform finishes. Guarded on
        // `propertyName` so a child's transition (a hover on a button inside)
        // can't bubble up and tear the drawer down early.
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === "transform") {
            setExiting(false);
          }
        }}
        className={clsx(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl",
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          entered ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold uppercase">Your Cart</h2>
          <button onClick={close} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-gray-500">
              We couldn&apos;t load your cart. Please try again.
            </p>
          </div>
        ) : cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-gray-500">Your cart is empty.</p>
            <button
              onClick={close}
              className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            {/* `data-lenis-prevent` keeps Lenis from claiming the wheel here, so
                this list scrolls itself instead of the page behind the drawer. */}
            <div
              className="flex-1 overflow-y-auto overscroll-contain px-5"
              data-lenis-prevent
            >
              {cart.lines.map((line) => (
                <div key={line.id} className="flex gap-3 border-b py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
                    <Image src={line.image} alt={line.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${line.slug}`}
                      onClick={close}
                      className="text-sm font-medium hover:text-brand"
                    >
                      {line.name}
                    </Link>
                    {line.variantName && (
                      <p className="mt-0.5 text-xs text-gray-500">{line.variantName}</p>
                    )}
                    <p className="mt-0.5 text-xs text-gray-500">
                      {formatPrice(line.unitPrice)} each
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <CartQuantityControl line={line} />
                      <CartRemoveButton line={line} />
                    </div>
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold text-sale">
                    {formatPrice(line.lineTotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t px-5 py-4">
              <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="mb-1 flex items-center justify-between text-sm text-green-700">
                  <span>Discount{cart.discountCode ? ` (${cart.discountCode})` : ""}</span>
                  <span>-{formatPrice(cart.discountAmount)}</span>
                </div>
              )}
              <div className="mb-3 flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-sale">{formatPrice(cart.total)} BDT</span>
              </div>
              <p className="mb-4 text-xs text-gray-500">
                Taxes and shipping calculated at checkout
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/cart"
                  onClick={close}
                  className="rounded border border-brand py-3 text-center text-sm font-semibold text-brand hover:bg-gray-50"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="rounded bg-brand py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  Check Out
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
