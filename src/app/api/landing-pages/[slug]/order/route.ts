import { proxyRequest } from "@/lib/api-proxy";

/**
 * Body: `{ quantity, zoneKey, fullName?, phone, address, notes?, expectedTotal? }`.
 *
 * Places the campaign order. Goes through the proxy rather than straight to the
 * backend for two reasons that both matter here:
 *
 *  - the real client's address reaches the backend, which is what the per-IP
 *    guest cash-on-delivery cap counts. Without it every order from this page
 *    would look like it came from this server process, and one visitor could
 *    drain the warehouse;
 *  - the `Idempotency-Key` header is forwarded, so a shopper who double-taps
 *    Submit on a slow connection gets one order rather than two.
 *
 * The proxy relays the backend's status and message untouched, which is what
 * lets a 409 naming the product and its available quantity, or the
 * price-changed refusal written in the shop's own currency, reach the shopper
 * verbatim.
 *
 * Longer timeout than a read, matching `/api/orders`: placing an order does
 * stock validation, the order transaction and the stock deduction.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return proxyRequest(
    request,
    `/landing-pages/by-slug/${encodeURIComponent(slug)}/order`,
    "POST",
    { timeoutMs: 30_000 },
  );
}
