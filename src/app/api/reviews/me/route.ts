import { proxyRequest } from "@/lib/api-proxy";

/**
 * The customer's own reviews, across every status — including the PENDING and
 * REJECTED ones the public product listing hides.
 */
export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyRequest(request, `/reviews/me${search}`, "GET");
}
