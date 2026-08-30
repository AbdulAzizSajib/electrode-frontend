import { proxyRequest } from "@/lib/api-proxy";

/**
 * Body: `{ orderNumber, phone }`.
 *
 * Guest order tracking. A guest holds no session, so the order number alone
 * cannot authorise this read — order numbers are enumerable. The number and the
 * phone the order was placed with together form the credential, which is also
 * why this is a POST: a query string would leave the phone in browser history,
 * access logs and referrer headers.
 *
 * The backend answers a wrong phone and a nonexistent order number with the
 * same 404 on purpose, so the response cannot be used to probe which order
 * numbers exist. The proxy relays it untouched.
 */
export async function POST(request: Request) {
  return proxyRequest(request, "/orders/track", "POST");
}
