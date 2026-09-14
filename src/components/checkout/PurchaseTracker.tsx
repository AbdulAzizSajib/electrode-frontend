"use client";

import { useEffect, useRef } from "react";
import { trackLandingPagePurchase } from "@/components/landing/FacebookPixel";

/**
 * Reports a completed order to the browser pixel, once.
 *
 * A client island on an otherwise server-rendered confirmation, because `fbq`
 * only exists in the browser. It renders nothing.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * THE EVENT ID IS THE ORDER ID, AND THE SERVER SENDS THE SAME ONE.
 *
 * Meta collapses a browser event and a Conversions API event sharing an
 * `event_id` into one conversion. Without that the two are additive and every
 * sale is counted about twice — a merchant reading doubled conversions raises ad
 * spend against revenue that does not exist, which is worse than not reporting
 * server-side at all.
 *
 * A RELOAD DOES NOT DOUBLE-COUNT. The confirmation page is reachable by URL and
 * shoppers do revisit it; the id is derived from the ORDER, not from the page
 * load, so every repeat carries the same value and Meta still records one
 * conversion. The ref below additionally stops a double fire within a single
 * mount, which React's strict mode would otherwise cause in development.
 *
 * Never throws. The underlying helper is a no-op when no pixel is installed and
 * when `fbq` has not loaded — an ad blocker must not turn a completed purchase
 * into an error on the page the shopper is reading.
 */
export default function PurchaseTracker({
  pixelId,
  orderId,
  value,
  currency,
}: {
  /** Already resolved; null when no pixel should fire. */
  pixelId: string | null;
  /** Doubles as the deduplication key. See above. */
  orderId: string;
  value: number;
  currency: string;
}) {
  const reported = useRef(false);

  useEffect(() => {
    if (reported.current) return;
    reported.current = true;

    trackLandingPagePurchase(pixelId, value, currency, orderId);
  }, [pixelId, orderId, value, currency]);

  return null;
}
