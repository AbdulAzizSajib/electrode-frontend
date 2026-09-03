import { proxyRequest } from "@/lib/api-proxy";

/**
 * Records that a shopper opened this product's detail page.
 *
 * Goes through the proxy rather than straight to the backend so a signed-in
 * shopper is identified by their session cookie — which is httpOnly and
 * therefore unreachable from a browser fetch — and so the real client's
 * user-agent and address reach the backend for deduplication.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return proxyRequest(request, `/products/${id}/views`, "POST");
}
