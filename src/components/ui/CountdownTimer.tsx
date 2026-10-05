"use client";

import { useEffect, useState } from "react";

function getRemaining(target: number) {
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds, expired: diff === 0 };
}

const UNIT_LABELS = ["Days", "Hour", "Min", "Sec"] as const;

/**
 * Counts down to a real deadline.
 *
 * `endsAt` is required, not defaulted. It previously took `daysFromNow = 7` and
 * computed its own target inside `useState`, so the countdown restarted on every
 * mount and could never reach zero — it displayed a deadline that did not exist.
 * Requiring the prop turns any remaining fake countdown into a compile error
 * rather than leaving one silently in place.
 *
 * Renders nothing once the deadline passes. The backend already excludes expired
 * campaigns, so this covers two narrower cases: a visitor sitting on the page as
 * the campaign ends, and a cached response outliving its own `endsAt`.
 */
export default function CountdownTimer({ endsAt }: { endsAt: number }) {
  // Null until the first tick. The server cannot know the client's clock, so
  // rendering a real remaining time during render would differ from the first
  // client render and trip a hydration mismatch — which the old version did. A
  // placeholder renders identically on both passes.
  const [time, setTime] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    // Scheduled rather than called synchronously here: a setState in the effect
    // body runs a second render pass before paint on every mount.
    const tick = () => setTime(getRemaining(endsAt));
    const id = setInterval(tick, 1000);
    const first = requestAnimationFrame(tick);

    return () => {
      clearInterval(id);
      cancelAnimationFrame(first);
    };
  }, [endsAt]);

  if (time?.expired) return null;

  const values = time
    ? [time.days, time.hours, time.minutes, time.seconds]
    : [null, null, null, null];

  return (
    /*
     * `transform-gpu` gives the timer its own layer, so the repaint it causes
     * every second stays inside its own box. Without it, the repaint spread to
     * the section around it, and on Android Chrome — with the pinned mobile
     * header overlapping that section — it came out as smeared, repeated copies
     * of the campaign text above the timer.
     */
    <div
      className="flex w-full transform-gpu items-center justify-between gap-1.5 sm:w-auto sm:justify-start sm:gap-2"
      role="timer"
      aria-label="Time remaining"
    >
      {UNIT_LABELS.map((label, i) => (
        <div key={label} className="contents">
          <div className="flex min-w-13 flex-1 flex-col items-center justify-center rounded-xl border border-brand/15 bg-white px-2.5 py-2.5 shadow-xs sm:min-w-15 sm:flex-none sm:px-3.5 sm:py-2.5">
            <span className="text-lg font-extrabold leading-none tabular-nums text-gray-900 sm:text-xl">
              {values[i] === null ? "--" : String(values[i]).padStart(2, "0")}
            </span>
            <span className="mt-1 text-[10px] font-semibold tracking-wider text-gray-500 uppercase sm:text-[11px]">
              {label}
            </span>
          </div>
          {i < UNIT_LABELS.length - 1 && (
            <span aria-hidden="true" className="text-base font-bold text-brand/60 sm:text-lg">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
