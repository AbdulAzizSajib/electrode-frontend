"use client";

import { useEffect, useState } from "react";

/**
 * The offer countdown.
 *
 * A CLIENT ISLAND, and it has to be. The page is cached with a revalidate
 * window, so a server-rendered "৬ দিন বাকি" would be wrong the moment it was
 * stored and wronger every minute after — the figure has to be computed in the
 * browser, from the absolute instant the server sent.
 *
 * That instant is also what makes the countdown HONEST. Every visitor counts
 * down to the same moment, because there is one stored deadline rather than a
 * duration started at each arrival. A per-visitor timer is the fabrication this
 * feature refuses: it is a different deadline for every shopper and cannot be
 * true for any of them.
 *
 * ONCE IT REACHES ZERO IT STOPS AND DISAPPEARS. It does not restart, does not
 * roll over to a new deadline, and does not recompute per session. A campaign
 * that has been "ending in 6 days" for three months teaches shoppers the number
 * is decoration, which costs more than the urgency buys.
 *
 * Whether the offer actually CLOSES at zero is a separate, server-enforced
 * thing (`stopOrdersAtDeadline`) — this component only ever displays.
 */

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Bengali-Indic digits, padded, to match the copy around it. */
const pad = (value: number) => value.toString().padStart(2, "0").replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]!);

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

const remainingFrom = (deadline: number, now: number): Remaining | null => {
  const ms = deadline - now;
  if (ms <= 0) return null;

  return {
    days: Math.floor(ms / DAY),
    hours: Math.floor((ms % DAY) / HOUR),
    minutes: Math.floor((ms % HOUR) / MINUTE),
    seconds: Math.floor((ms % MINUTE) / SECOND),
  };
};

export default function LandingCountdown({ endsAt }: { endsAt: string }) {
  const deadline = new Date(endsAt).getTime();

  /*
   * NULL UNTIL HYDRATION, deliberately — the server and the first client render
   * must agree, and the server cannot know `Date.now()` at paint time without
   * baking a wrong number into the cache. The section reserves its space and
   * shows the deadline's DATE until the timer takes over, so the layout does
   * not jump and the panel never reads as broken while it waits.
   */
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (Number.isNaN(deadline)) return;

    const tick = () => setRemaining(remainingFrom(deadline, Date.now()));

    tick();
    setStarted(true);

    const id = setInterval(tick, SECOND);
    return () => clearInterval(id);
  }, [deadline]);

  // A malformed instant renders nothing rather than "NaN দিন".
  if (Number.isNaN(deadline)) return null;

  /*
   * Past the deadline: render NOTHING. Not "0 days 0 hours", which reads as a
   * broken timer, and certainly not a fresh countdown.
   */
  if (started && !remaining) return null;

  const units: [string, number][] = remaining
    ? [
        ["দিন", remaining.days],
        ["ঘন্টা", remaining.hours],
        ["মিনিট", remaining.minutes],
        ["সেকেন্ড", remaining.seconds],
      ]
    : [];

  return (
    <section className="rounded-xl border border-lp-accent/25 bg-lp-surface p-5 text-center shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
      <p className="text-sm font-semibold text-lp-text">অফার শেষ হতে বাকি আছে</p>

      {remaining ? (
        <ul className="mt-3 flex items-start justify-center gap-3">
          {units.map(([label, value]) => (
            <li key={label} className="min-w-16">
              {/*
                FILLED, not outlined. A countdown is the loudest thing on the
                page by intent, and a pale number in a pale box is a timer a
                reader's eye slides past — which defeats the only thing it is
                there to do.
              */}
              <span className="block rounded-lg bg-lp-accent px-3 py-2.5 text-2xl font-bold tabular-nums text-lp-accent-contrast">
                {pad(value)}
              </span>
              <span className="mt-1 block text-xs text-lp-muted">{label}</span>
            </li>
          ))}
        </ul>
      ) : (
        /*
         * The pre-hydration state. Shows the deadline's own date — true,
         * useful, and the same height as the timer that replaces it, so
         * nothing shifts when it does.
         */
        <p className="mt-3 py-2 text-lg font-semibold text-lp-accent">
          {new Date(deadline).toLocaleDateString("bn-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      )}
    </section>
  );
}
