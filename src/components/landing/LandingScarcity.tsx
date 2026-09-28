import type { LandingPageScarcity } from "@/types/landing-page";

/**
 * Progress toward a limited run — "১০০ জন হতে বাকি আছে ৩৫ জন".
 *
 * A SERVER COMPONENT, because the figures arrive already computed. They are
 * counted by the backend from this page's real orders, and there is no way for
 * a merchant to seed or offset them: no column holds a starting count and no
 * payload field can carry one.
 *
 * That constraint is the whole reason this section is allowed to exist. A
 * "৬৫ জন কিনেছেন" that a merchant typed in is a lie told to every visitor, and
 * a shopper who catches one fabricated figure discounts every other claim on
 * the page — including the true ones. So this renders real numbers or nothing.
 *
 * Past the target it reports the run as MET rather than a negative remainder,
 * which is both meaningless and an obvious tell that the figure is computed.
 */
export default function LandingScarcity({
  scarcity,
}: {
  scarcity: LandingPageScarcity | null;
}) {
  // No run declared — no indicator at all, not an empty bar at 0%.
  if (!scarcity) return null;

  const bn = (value: number) => value.toLocaleString("bn-BD");
  const percent = Math.min(100, Math.round((scarcity.taken / scarcity.target) * 100));

  return (
    <section className="rounded-xl border border-lp-border bg-lp-surface p-4 shadow-[0_4px_15px_rgba(0,0,0,0.05)]">
      {scarcity.met ? (
        /*
         * The run is over. Said plainly rather than left as a full bar the
         * shopper has to interpret — and NOT dressed up as still-available,
         * which would take an order against an offer that has ended.
         */
        <p className="text-sm font-medium text-lp-muted">
          এই অফারের নির্ধারিত সংখ্যা পূর্ণ হয়ে গেছে।
        </p>
      ) : (
        <>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <p className="text-sm font-medium text-lp-text">
              {bn(scarcity.target)} জন হতে বাকি আছে{" "}
              <span className="font-bold text-lp-accent">{bn(scarcity.remaining)} জন</span>
            </p>
            <p className="text-xs text-lp-muted">
              ইতিমধ্যে {bn(scarcity.taken)} জন কিনেছেন
            </p>
          </div>

          <div
            className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-lp-surface-alt"
            role="progressbar"
            aria-valuenow={scarcity.taken}
            aria-valuemin={0}
            aria-valuemax={scarcity.target}
            aria-label="অফারের অগ্রগতি"
          >
            <div
              className="h-full rounded-full bg-lp-accent transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </>
      )}
    </section>
  );
}
