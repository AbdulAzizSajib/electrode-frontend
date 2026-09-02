"use client";

import { useEffect, useState } from "react";
import { ChevronUp, ShoppingBag } from "lucide-react";
import clsx from "clsx";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { formatPrice } from "@/lib/format";
import { EMPTY_CART, useGetCartQuery } from "@/store/cartApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openCart, selectIsCartOpen } from "@/store/uiSlice";

/**
 * How far down the page the back-to-top button appears. Roughly one viewport,
 * so it shows up only once "back to top" is a journey worth shortcutting.
 */
const SHOW_TOP_BUTTON_AFTER_PX = 600;

/**
 * Geometry for the progress ring drawn around the back-to-top button.
 *
 * The ring is stroked on a circle inset by half the stroke width, so the stroke
 * sits fully inside the 40px (`size-10`) button box rather than being clipped in
 * half at the edge.
 */
const RING_SIZE = 40;
const RING_STROKE = 2;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * The two floating affordances on the right edge: a cart summary pinned to the
 * middle of the viewport, and a back-to-top button in the bottom corner that
 * fades in once the page has been scrolled.
 *
 * They share a component because both are right-edge overlays owned by the same
 * scroll state, but they are separate fixed elements — each anchors to a
 * different part of the viewport.
 *
 * Desktop-only (`md:` up), matching the header's own cart button — the mobile
 * bottom nav already carries a cart entry, and these would sit on top of it.
 */
export default function CartRail() {
  const dispatch = useAppDispatch();
  const isCartOpen = useAppSelector(selectIsCartOpen);
  const { lenis } = useSmoothScroll();

  // Shares the cache the header's query already fills, so this adds a
  // subscription rather than a request.
  const { data: cart = EMPTY_CART } = useGetCartQuery();

  const [showTopButton, setShowTopButton] = useState(false);

  /**
   * How far through the page we are, 0–1. The storefront hides its scrollbar, so
   * this ring is the only cue for depth — without it there is nothing on screen
   * saying how much page is left.
   */
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      setShowTopButton(window.scrollY > SHOW_TOP_BUTTON_AFTER_PX);

      // Total scrollable distance, not document height — the last viewport of
      // content is visible without scrolling, so it is not part of the journey.
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;

      // A page shorter than the viewport has nothing to divide by. Guarding here
      // keeps the ring at 0 instead of NaN, which would drop the dash offset
      // attribute entirely and paint a full ring.
      setScrollProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
    };
    update();

    // Listens on `scroll` rather than Lenis's own event so the button still
    // works on the reduced-motion path, where there is no Lenis instance.
    // Lenis drives the real window scroll, so this fires either way.
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const scrollToTop = () => {
    // Prefer Lenis so the ride up matches the page's own easing; fall back to
    // the native smooth scroll when Lenis is off for reduced motion.
    if (lenis) {
      lenis.scrollTo(0);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Both float on the right edge but anchor to different places, so they are
  // separate fixed elements rather than one stacked rail.
  return (
    <>
      {/* Cart summary — centred on the viewport. */}
      <div
        className={clsx(
          "fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 md:block",
          "transition-opacity duration-200",
          // Yielding to the drawer keeps the rail from sitting on top of the very
          // panel it opens.
          isCartOpen && "pointer-events-none opacity-0",
        )}
      >
        <button
          onClick={() => dispatch(openCart())}
          className="flex w-20 flex-col overflow-hidden rounded-l-md shadow-lg"
          aria-label={`Open cart, ${cart.itemCount} items`}
        >
          <span className="flex flex-col items-center gap-1 bg-brand px-2 py-2.5 text-white">
            <ShoppingBag size={20} />
            <span className="text-[11px] font-semibold leading-none">
              {cart.itemCount} Items
            </span>
          </span>
          <span className="bg-white px-2 py-1.5 text-[11px] font-semibold text-gray-800">
            {formatPrice(cart.subtotal)}
          </span>
        </button>
      </div>

      {/*
        Back to top — anchored to the bottom-right corner, independent of the cart
        summary above it.

        Kept mounted and faded rather than conditionally rendered, so it has an
        element to transition. `invisible` (not just transparent) at rest keeps it
        out of the tab order while hidden.
      */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        tabIndex={showTopButton ? 0 : -1}
        className={clsx(
          "fixed bottom-6 right-4 z-30 hidden size-10 items-center justify-center rounded-full md:flex",
          "bg-brand text-white shadow-lg",
          "transition-all duration-200 hover:bg-brand-dark motion-reduce:transition-none",
          showTopButton ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        {/*
          Progress ring. Rotated so the stroke starts at 12 o'clock and fills
          clockwise, which is how a progress dial is read — an unrotated SVG
          circle starts at 3 o'clock.

          `aria-hidden` because the button's own label already says what it does;
          the ring is decoration duplicating the scroll position a screen reader
          user tracks by other means.
        */}
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
          className="pointer-events-none absolute inset-0 size-full -rotate-90"
        >
          {/* Track — the unscrolled remainder, dimmed against the brand fill. */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeWidth={RING_STROKE}
          />
          {/*
            Progress — one full-circumference dash, revealed by walking its
            offset from a full circumference (empty) down to 0 (complete).
          */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RING_RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - scrollProgress)}
          />
        </svg>
        <ChevronUp size={20} className="relative" />
      </button>
    </>
  );
}
