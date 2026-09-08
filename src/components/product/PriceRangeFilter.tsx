"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";

interface Props {
  /** Cheapest and dearest product in the catalog — the track's extremes. */
  min: number;
  max: number;
  /** The range currently applied, or null for an unfiltered end. */
  selectedMin: number | null;
  selectedMax: number | null;
  /** Called on Filter, never on drag — see the comment on `dirty`. */
  onApply: (range: { min: number; max: number } | null) => void;
}

/**
 * Two overlaid native range inputs, not a mouse-event slider.
 *
 * A hand-rolled slider has to reimplement keyboard control, focus, and touch
 * from scratch, and typically ends up mouse-only. Stacking two `input[range]`
 * gives arrow-key stepping, Home/End, and screen-reader announcement for free;
 * all this file adds is a painted track and the rule that the handles cannot
 * cross. The inputs stay transparent and the visible track is drawn beneath
 * them, so what the shopper drags is still the real control.
 */
export default function PriceRangeFilter({
  min,
  max,
  selectedMin,
  selectedMax,
  onApply,
}: Props) {
  const appliedLow = selectedMin ?? min;
  const appliedHigh = selectedMax ?? max;

  /*
   * The handles are local state: dragging must not re-query on every frame, so
   * the applied filter stays in the URL and this tracks the pending position
   * until Filter is pressed.
   *
   * `pending` is null whenever the handles agree with the applied range, and
   * the applied range is RE-READ during render — so a Clear-filters press, or a
   * back-navigation to a differently-filtered URL, moves the handles with no
   * resync effect. Storing the applied values instead would need an effect to
   * copy each new prop into state, which is the cascading render React warns
   * about; this way the props are simply the value when nothing is pending.
   */
  const [pending, setPending] = useState<{ low: number; high: number } | null>(null);

  const low = pending?.low ?? appliedLow;
  const high = pending?.high ?? appliedHigh;

  // A catalog whose products all cost the same gives the track no width, and a
  // slider that cannot move is worse than no slider.
  if (max <= min) return null;

  const span = max - min;
  const leftPercent = ((low - min) / span) * 100;
  const rightPercent = ((high - min) / span) * 100;

  const dirty = low !== appliedLow || high !== appliedHigh;

  return (
    <div>
      <h3 className="mb-5 text-sm font-bold tracking-wide text-gray-900 uppercase">
        Filter by price
      </h3>

      {/* Tall enough to hold the 20px handles; the track is centred within it. */}
      <div className="relative mb-5 h-5">
        {/* Unselected remainder of the range. */}
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-gray-200" />
        {/* The selected span, drawn over it. */}
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-gray-900"
          style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
        />

        {/*
         * Both inputs cover the full track, so the top one would swallow every
         * click. `pointer-events-none` on the input with `:auto` on the thumb
         * (see the utilities below) means only the 20px handles are
         * interactive, which lets the lower input's handle stay grabbable
         * across the whole track.
         */}
        <input
          type="range"
          min={min}
          max={max}
          value={low}
          aria-label="Minimum price"
          // Clamped rather than swapped: dragging the low handle past the high
          // one should stop it, not silently reverse which handle is held.
          onChange={(e) =>
            setPending({ low: Math.min(Number(e.target.value), high), high })
          }
          className="range-thumb absolute top-1/2 h-5 w-full -translate-y-1/2 appearance-none bg-transparent"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={high}
          aria-label="Maximum price"
          onChange={(e) =>
            setPending({ low, high: Math.max(Number(e.target.value), low) })
          }
          className="range-thumb absolute top-1/2 h-5 w-full -translate-y-1/2 appearance-none bg-transparent"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Price:{" "}
          <span className="font-semibold text-gray-900">{formatPrice(low)}</span>
          {" — "}
          <span className="font-semibold text-gray-900">{formatPrice(high)}</span>
        </p>

        {/*
         * An explicit apply, because each press is a server round-trip: a
         * filter-on-drag slider fires a query per frame, and the shopper reads
         * the numbers above while dragging anyway.
         */}
        <button
          type="button"
          disabled={!dirty}
          onClick={() => {
            // Dropped BEFORE navigating: once the range is applied it arrives
            // back as props, and a lingering `pending` would keep overriding
            // them — the handles would then ignore a later Clear-filters.
            setPending(null);
            // A full-width selection is no filter at all — clearing the params
            // keeps `?minPrice=0&maxPrice=20380` off every shared URL.
            onApply(low === min && high === max ? null : { min: low, max: high });
          }}
          className="rounded bg-gray-100 px-4 py-2 text-xs font-semibold tracking-wide text-gray-700 uppercase transition hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-gray-100 disabled:hover:text-gray-700"
        >
          Filter
        </button>
      </div>
    </div>
  );
}
