"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import clsx from "clsx";
import { useScrollLock } from "@/components/providers/SmoothScrollProvider";

/**
 * Longest the exit slide is allowed to take before the panel is torn down
 * regardless. `transitionend` normally ends the exit, but it never fires if the
 * panel is hidden mid-transition (a route change unmounting an ancestor, a
 * background tab throttling frames) — without this the drawer would be stranded
 * over the listing with no way to dismiss it.
 */
const EXIT_FALLBACK_MS = 400;

/** Focusable descendants, in DOM order, for the tab cycle. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The width at which the sidebar is back in the page and this drawer is moot. */
const DESKTOP_QUERY = "(min-width: 1024px)";

type Phase = "closed" | "open" | "closing";

/**
 * Holds the filter panel below `lg`, where it is out of the page flow.
 *
 * The same three-phase visibility machine as `CartDrawer`, and for the same
 * reason: rendering `null` the frame `open` goes false leaves no element to
 * animate out. Slides from the left — the edge the sidebar occupies on desktop,
 * and the one the mobile menu drawer already uses.
 */
export default function ProductFiltersDrawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  // Whether a drawer that has left `open` is still animating out. "Open" is
  // `open` itself, so reopening mid-close needs no special case.
  const [exiting, setExiting] = useState(false);
  // Drives the enter transition, kept separate from the phase because the panel
  // must first paint off-screen and only then travel to its resting position.
  const [entered, setEntered] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  // The element focus returns to on close — the toolbar's Filters button.
  const openerRef = useRef<HTMLElement | null>(null);

  const phase: Phase = open ? "open" : exiting ? "closing" : "closed";
  const isVisible = phase !== "closed";

  useScrollLock(isVisible);

  useEffect(() => {
    if (!open) return;
    openerRef.current ??= document.activeElement as HTMLElement | null;
  }, [open]);

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
    if (open) {
      // Opening cancels any exit still pending from a previous close.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExiting(false);
      return;
    }
    // Only a drawer already on screen has anything to animate out.
    setExiting(entered);
    setEntered(false);
    // `entered` is read as the current on-screen state, not tracked — adding it
    // to the deps would re-run this on the enter transition and cancel the exit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Backstop for a `transitionend` that never arrives — see EXIT_FALLBACK_MS.
  useEffect(() => {
    if (phase !== "closing") return;
    const timer = window.setTimeout(() => setExiting(false), EXIT_FALLBACK_MS);
    return () => window.clearTimeout(timer);
  }, [phase]);

  // Restore focus once the drawer is fully gone, rather than while it is still
  // visibly on screen.
  useEffect(() => {
    if (phase !== "closed") return;
    openerRef.current?.focus?.();
    openerRef.current = null;
  }, [phase]);

  /*
   * Growing past `lg` puts the real sidebar back in the page, and this panel is
   * hidden with it. Closing on the same breakpoint is what releases the scroll
   * lock: left open, the page would sit frozen behind a drawer nobody can see
   * or dismiss.
   */
  useEffect(() => {
    if (!open) return;
    const query = window.matchMedia(DESKTOP_QUERY);
    if (query.matches) {
      onClose();
      return;
    }
    function onChange(event: MediaQueryListEvent) {
      if (event.matches) onClose();
    }
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [open, onClose]);

  // Move focus into the panel on open, and keep Tab cycling inside it.
  useEffect(() => {
    if (phase !== "open") return;
    const panel = panelRef.current;
    if (!panel) return;

    panel.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const targets = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (targets.length === 0) return;

      const first = targets[0];
      const last = targets[targets.length - 1];
      const active = document.activeElement;

      // Wrap at both ends, and pull focus back in if it has escaped the panel
      // entirely — which is what would otherwise let Tab reach the listing behind.
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
  }, [phase, onClose]);

  // Nothing rendered while closed: no pointer target, no tab stop, nothing
  // exposed to assistive technology — inert when closed, for free.
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
    >
      <div
        className={clsx(
          "absolute inset-0 bg-black/40 transition-opacity duration-300 ease-out motion-reduce:transition-none",
          entered ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <div
        ref={panelRef}
        // The exit ends when the panel's own transform finishes. Guarded on
        // `propertyName` so a child's transition (a hover on a button inside)
        // cannot bubble up and tear the drawer down early.
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === "transform") {
            setExiting(false);
          }
        }}
        className={clsx(
          "absolute top-0 left-0 flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-xl",
          "transition-transform duration-300 ease-out motion-reduce:transition-none",
          entered ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-sm font-bold tracking-wide text-gray-900 uppercase">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex size-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* The only scrolling region, so the heading and close button stay put. */}
        {/* `data-lenis-prevent` keeps Lenis from claiming the wheel here, so this
            panel scrolls itself instead of the listing behind it. */}
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-5 py-6"
          data-lenis-prevent
        >
          {children}
        </div>
      </div>
    </div>
  );
}
