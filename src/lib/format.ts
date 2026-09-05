import type { CurrencyFormat } from "@/types/store-settings";

/**
 * How the merchant has chosen to write money.
 *
 * Held at module scope and set once per render pass, rather than passed to each of the ~50
 * `formatPrice` calls across this app. Three things make that the right shape here, not merely the
 * convenient one:
 *
 *  - **`formatPrice` is called from BOTH server and client components.** `ProductCard` and
 *    `CartDrawer` are client; `OrderSummaryCard` and the product sections are server. A React hook
 *    is unavailable to the server half, and an `await`ed read is unavailable to the client half.
 *    Nothing that lives in React can serve both.
 *  - **`StoreSetting` is a SINGLETON.** Concurrent requests on the server share module scope, but
 *    they all want the SAME value — there is exactly one correct format per deployment at any
 *    instant, so there is no cross-request leak of different data. The only reachable anomaly is a
 *    page rendered during the instant a merchant's save propagates, which is cosmetic and no worse
 *    than the settings cache window that already exists.
 *  - **Threading it explicitly would mean prop-drilling** a deployment-constant value through every
 *    tree that renders a price, including Redux-connected drawers and rails with no props path from
 *    the layout.
 *
 * IF THIS EVER BECOMES MULTI-TENANT, this is the thing to revisit: the safety argument above rests
 * entirely on there being one store.
 */

/**
 * What prices look like before the settings have been applied, and if they never are.
 *
 * Reproduces this function's previous hardcoded output — `` `৳${value.toFixed(2)}` `` — minus the
 * missing thousands separator. So a code path that forgets to call `setCurrencyFormat` degrades to
 * roughly today's behaviour rather than to `undefined1200`.
 */
const FALLBACK_FORMAT: CurrencyFormat = { symbol: "৳", position: "BEFORE", decimals: 2 };

let currencyFormat: CurrencyFormat = FALLBACK_FORMAT;

/**
 * Applied by the root layout on the server, and by `CurrencyFormatProvider` in the browser.
 *
 * Not a hook and not a context, for the reason above: half the call sites cannot consume either.
 */
export function setCurrencyFormat(format: CurrencyFormat) {
  currencyFormat = format;
}

/**
 * Written as an escape, never as a pasted character: a literal U+00A0 is invisible in every editor
 * and indistinguishable from an ordinary space in a diff. The server and admin copies of this logic
 * spell it the same way.
 */
const NBSP = "\u00A0";

/** One formatter per distinct decimal count — a grid of 40 products should not build 40 of them. */
const formatterCache = new Map<number, Intl.NumberFormat>();

function digitsFormatter(decimals: number) {
  const cached = formatterCache.get(decimals);
  if (cached) return cached;

  /*
   * `en-US` for grouping, NOT `style: "currency"`. Currency style derives the symbol and its side
   * from the currency code and locale, which is exactly the decision this hands to the merchant —
   * `BDT` in `en-US` renders "BDT 1,200.00", not "৳1,200.00", and offers no way to move the symbol
   * to the trailing position.
   */
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  formatterCache.set(decimals, formatter);
  return formatter;
}

/**
 * A price, written the merchant's way.
 *
 * Spacing is a fixed consequence of the position, not a further setting: none when the symbol leads
 * (`৳1,200.00`), one non-breaking space when it trails (`1,200.00 ৳`). That is what leading-symbol
 * and trailing-symbol locales respectively do, and the non-breaking space keeps a price from
 * wrapping away from its symbol at the end of a line.
 *
 * Signature deliberately unchanged from when this was a two-line literal, so all ~50 existing call
 * sites keep working untouched.
 */
export function formatPrice(value: number) {
  const digits = digitsFormatter(currencyFormat.decimals).format(value);

  return currencyFormat.position === "AFTER"
    ? `${digits}${NBSP}${currencyFormat.symbol}`
    : `${currencyFormat.symbol}${digits}`;
}

/**
 * A count in a form that stays readable at a glance — "1,240", "12.4K", "1.2M".
 *
 * Thousands separators up to 10,000, and a compact suffix beyond it: a view
 * count is a rough indication of interest, and past a few thousand the exact
 * digits carry no meaning a shopper acts on.
 */
export function formatCount(value: number) {
  if (value < 10_000) return value.toLocaleString("en-US");
  if (value < 1_000_000) return `${trimZero(value / 1_000)}K`;
  return `${trimZero(value / 1_000_000)}M`;
}

/** One decimal place, but "12K" rather than "12.0K". */
function trimZero(value: number) {
  return value.toFixed(1).replace(/\.0$/, "");
}

/**
 * Rounds a money value to whole cents.
 *
 * Float multiplication drifts (79.99 * 3 === 239.96999999999997), which is
 * invisible in a single formatted value but compounds once line totals are
 * summed — a subtotal can then render a cent away from the sum of the lines
 * shown above it. Rounding at each computation step keeps them consistent.
 */
export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function discountPercent(price: number, compareAtPrice?: number) {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}
