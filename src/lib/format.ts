export function formatPrice(value: number) {
  return `৳${value.toFixed(2)}`;
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
