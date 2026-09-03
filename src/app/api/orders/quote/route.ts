import { proxyRequest } from "@/lib/api-proxy";

/**
 * Body: `{ shippingAddressId? , country?, state?, shippingMethodId?, items? }`.
 *
 * Prices the basket without placing anything, so checkout can show what
 * delivery actually costs to the shopper's destination — and tell them up front
 * when nobody delivers there — rather than guessing and being corrected after
 * Place Order.
 *
 * A read in every sense that matters: it commits nothing, so it takes the
 * default timeout rather than the order route's longer one. The proxy relays
 * the backend's status and message untouched, which is what lets the
 * "cannot be delivered to Dhaka, Bangladesh" refusal reach the shopper naming
 * the product that caused it.
 */
export async function POST(request: Request) {
  return proxyRequest(request, "/orders/quote", "POST");
}
