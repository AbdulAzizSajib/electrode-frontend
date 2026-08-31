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
    <div className="flex gap-2">
      {UNIT_LABELS.map((label, i) => (
        <div key={label} className="flex flex-col items-center">
          <span className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-sm font-semibold">
            {values[i] === null ? "--" : String(values[i]).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[10px] text-gray-500">{label}</span>
        </div>
      ))}
    </div>
  );
}
