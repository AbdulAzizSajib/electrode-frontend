"use client";

import { useEffect, useState, useRef, type RefObject } from "react";

/**
 * Drives the mobile header's pinned behaviour.
 *
 * The header starts in the page's flow and scrolls away with it like any other
 * content. Once the page has scrolled past the header's own height — the point
 * at which it is fully out of view — it is PINNED, and slides back down from the
 * top edge (the `header-in` keyframe in `globals.css`) rather than snapping into
 * place. It then stays pinned while the shopper keeps scrolling.
 *
 * PINNED WITH `position: fixed`, NOT `sticky`. A sticky header made Android
 * Chrome paint smeared, repeated copies of the content scrolling beneath it
 * (seen on the Flash Deal section, gone the moment the header stopped sticking).
 * `fixed` is the path that phone already renders cleanly — the bottom nav is
 * fixed. Fixed takes the header OUT of the flow, so the caller renders a spacer
 * of `height` in its place while pinned; without it the page would jump up by
 * the header's height at the moment of pinning.
 *
 * UNPINNED ONLY AT THE VERY TOP, not when the shopper scrolls back above the
 * header's height. Between the top and that height, a pinned header and an
 * unpinned one sit in different places — pinned it is whole, unpinned it is
 * partly scrolled off — so unpinning there would visibly jump. At the top the two
 * coincide, so the handover is invisible.
 *
 * Window scroll is the right source even with Lenis running: Lenis animates the
 * real window scroll position, so `scroll` events and `scrollY` stay truthful.
 * Reads are coalesced to one per animation frame.
 */
export function useStickyReveal(headerRef: RefObject<HTMLElement | null>) {
  const [pinned, setPinned] = useState(false);
  /** The header's height, read while it is still in the flow — what the spacer must fill. */
  const [height, setHeight] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    function update() {
      frame.current = null;
      // Clamped: iOS overscroll at the top reports a negative position.
      const y = Math.max(window.scrollY, 0);
      const headerHeight = headerRef.current?.offsetHeight ?? 0;

      if (y > headerHeight) {
        setHeight(headerHeight);
        setPinned(true);
      } else if (y <= 0) {
        setPinned(false);
      }
    }

    function onScroll() {
      if (frame.current === null) frame.current = requestAnimationFrame(update);
    }

    // A reload restores the scroll position, so the page may open mid-way down.
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [headerRef]);

  return { pinned, height };
}
