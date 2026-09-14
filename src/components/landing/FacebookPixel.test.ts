/**
 * The browser half of Purchase deduplication.
 *
 * `trackLandingPagePurchase` must hand `fbq` an `eventID` matching the order id
 * the SERVER sends as `event_id` to the Conversions API. Meta collapses the pair
 * into one conversion on that match.
 *
 * If this regresses, nothing in the shop misbehaves: orders complete, the pixel
 * fires, Meta accepts everything. The only symptom is conversions roughly
 * doubling, which a merchant discovers by raising ad spend against revenue that
 * does not exist. That is exactly the kind of failure worth a test.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { trackLandingPagePurchase } from "@/components/landing/FacebookPixel";

type FbqCall = unknown[];

/*
 * This suite runs in the `node` environment, like every other test here — the
 * project deliberately has no jsdom (see vitest.config.mts). `window` is defined
 * as an alias of `globalThis` for the duration, which is enough: the function
 * under test reads exactly one property off it, and installing a whole DOM to
 * check the shape of an `fbq` call would be a dependency bought for nothing.
 */
const globalWithWindow = globalThis as unknown as { window?: unknown; fbq?: unknown };

beforeEach(() => {
  globalWithWindow.window = globalThis;
});

/** Installs a stub `fbq` and returns the calls it receives. */
const stubFbq = () => {
  const calls: FbqCall[] = [];
  globalWithWindow.fbq = (...args: unknown[]) => {
    calls.push(args);
  };
  return calls;
};

afterEach(() => {
  delete globalWithWindow.fbq;
  delete globalWithWindow.window;
});

describe("trackLandingPagePurchase", () => {
  it("sends the order id as fbq's eventID", () => {
    const calls = stubFbq();

    trackLandingPagePurchase("1247199439643328", 2499.5, "BDT", "order_abc123");

    expect(calls).toHaveLength(1);
    const [event, name, data, options] = calls[0];
    expect(event).toBe("track");
    expect(name).toBe("Purchase");
    expect(data).toEqual({ value: 2499.5, currency: "BDT" });
    // The deduplication key. fbq reads it from this fourth argument, NOT from
    // the event data — putting it in `data` would send it and dedupe nothing.
    expect(options).toEqual({ eventID: "order_abc123" });
  });

  it("omits the options argument entirely when no id is given", () => {
    const calls = stubFbq();

    trackLandingPagePurchase("1247199439643328", 100, "BDT");

    expect(calls[0][3]).toBeUndefined();
  });

  it("reports the same id on a repeat call, so a reload cannot double-count", () => {
    const calls = stubFbq();

    trackLandingPagePurchase("1247199439643328", 100, "BDT", "order_abc123");
    trackLandingPagePurchase("1247199439643328", 100, "BDT", "order_abc123");

    // Two events, one conversion: the id is derived from the ORDER, not the page
    // load, so Meta deduplicates the repeat. The confirmation page is reachable
    // by URL and shoppers do revisit it.
    expect(calls).toHaveLength(2);
    expect(calls[0][3]).toEqual(calls[1][3]);
  });

  it("does nothing when no pixel is configured", () => {
    const calls = stubFbq();

    trackLandingPagePurchase(null, 100, "BDT", "order_abc123");

    expect(calls).toHaveLength(0);
  });

  it("does nothing when fbq has not loaded", () => {
    // An ad blocker or a slow network. Must not throw — measurement is never
    // worth an error on the confirmation the shopper is reading.
    expect(() =>
      trackLandingPagePurchase("1247199439643328", 100, "BDT", "order_abc123"),
    ).not.toThrow();
  });

  it("swallows an error thrown by fbq itself", () => {
    globalWithWindow.fbq = () => {
      throw new Error("blocked");
    };

    expect(() =>
      trackLandingPagePurchase("1247199439643328", 100, "BDT", "order_abc123"),
    ).not.toThrow();
  });
});
