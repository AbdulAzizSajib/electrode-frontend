import { proxyRequest } from "@/lib/api-proxy";

/**
 * Body: `{ shippingAddressId, notes? }`.
 *
 * The proxy relays the backend's status and message untouched, which is what
 * lets a 409 — e.g. "Insufficient stock for 'JBL Flip 6' — requested 2,
 * available 0" — reach the shopper naming the item that actually failed.
 *
 * Placing an order does substantially more work than any read here (stock
 * validation, the order transaction, stock deduction), so it gets a longer
 * timeout than the default. That only reduces how often the outcome is
 * unknown, though — it cannot eliminate it, which is why the request also
 * carries an `Idempotency-Key` so a retry can never place a second order.
 */
export async function POST(request: Request) {
  return proxyRequest(request, "/orders", "POST", { timeoutMs: 30_000 });
}
