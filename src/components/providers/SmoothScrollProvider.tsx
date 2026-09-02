"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import Lenis from "lenis";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** Module-level so its identity is stable across renders, as useSyncExternalStore requires. */
function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

interface SmoothScrollContextValue {
  /**
   * The live Lenis instance, or `null` while smooth scrolling is off (reduced
   * motion, or before the first client render). Consumers must handle `null`
   * rather than assume it — that is the same branch that keeps the storefront
   * working if this provider is ever removed.
   */
  lenis: Lenis | null;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({ lenis: null });

/**
 * Access to the page's scroll authority. Returns `{ lenis: null }` outside the
 * provider, so a component can call this unconditionally.
 */
export function useSmoothScroll() {
  return useContext(SmoothScrollContext);
}

/**
 * Owns the single Lenis instance driving page scrolling.
 *
 * Deliberately initialised with no `wrapper`/`content`, so Lenis animates the
 * real window scroll position instead of transforming a container. That choice
 * is load-bearing: the transform-based mode establishes a containing block,
 * which silently breaks `position: sticky` (the pinned category nav) and the
 * `absolute` mega-menu dropdowns positioned against it.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  /*
   * The user's motion preference, read with `useSyncExternalStore` rather than
   * an effect: it is external browser state, and this gives a server/first-client
   * value of `true` so a reduced-motion user never gets a frame of smooth
   * scrolling before the preference is known. Changes re-render, which tears
   * Lenis down or builds it back up mid-session.
   */
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => true,
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    const instance = new Lenis({
      // Window-scroll mode — see the note on this component.
      autoRaf: true,
      // Lenis owns in-page anchor jumps, so they ease to the target and respect
      // `scroll-padding-top` rather than fighting the smooth scroll loop.
      anchors: true,
      /*
       * `allowNestedScroll` is deliberately left off.
       *
       * It makes Lenis inspect the composed path on every wheel event and hand
       * the event to any ancestor that merely *looks* scrollable in that
       * direction — which strands the page near the document end, where the
       * cursor sits over such an element and the first scrolls back up get
       * swallowed instead of moving the page.
       *
       * The genuinely nested scrollers (the cart drawer's item list, the mobile
       * menu's list) opt out explicitly with `data-lenis-prevent`, which is
       * exact rather than inferred.
       */
      duration: 1.05,
      // Standard exponential ease-out: quick to respond, long tail to settle.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Publishing an imperatively-created instance is the point of this effect;
    // the instance cannot exist during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  const value = useMemo(() => ({ lenis }), [lenis]);

  return (
    <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
  );
}

/**
 * Locks page scrolling for as long as `locked` is true, then restores it.
 *
 * Routed through Lenis rather than `body { overflow: hidden }` because that
 * idiom alone no longer stops the page once Lenis drives the scroll loop — it
 * keeps applying its own scroll regardless of the body's overflow. The body
 * fallback is still applied for the reduced-motion path, where there is no
 * Lenis instance and native overflow is the only lever.
 */
export function useScrollLock(locked: boolean) {
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    if (!locked) return;

    lenis?.stop();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      // Same instance the lock was taken on: if `lenis` is replaced while the
      // lock is held, the effect re-runs and this cleanup releases the old one
      // before the new one is stopped.
      lenis?.start();
      document.body.style.overflow = previousOverflow;
    };
  }, [locked, lenis]);
}
