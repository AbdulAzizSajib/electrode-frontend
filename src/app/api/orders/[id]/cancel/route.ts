import { proxyRequest } from "@/lib/api-proxy";

type Context = { params: Promise<{ id: string }> };

/*
 * The signed-in customer's cancel, from the order detail page. A pass-through
 * because the call is browser-initiated and the backend's auth cookies live on
 * the backend's domain. The backend decides whether the order may still be
 * cancelled; this route does not. See
 * server/openspec/changes/add-storefront-order-history.
 */
export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  return proxyRequest(request, `/orders/${encodeURIComponent(id)}/cancel`, "PATCH");
}
