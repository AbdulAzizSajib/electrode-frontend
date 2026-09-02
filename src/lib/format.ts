export function formatPrice(value: number) {
  return `৳${value.toFixed(2)}`;
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
