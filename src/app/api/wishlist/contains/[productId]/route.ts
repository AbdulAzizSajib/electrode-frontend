import { proxyRequest } from "@/lib/api-proxy";

type Context = { params: Promise<{ productId: string }> };

/**
 * Single-product saved check. Used on the product detail page, where exactly
 * one product is in question — a listing reads saved state from the cached
 * wishlist instead, so N cards cost one request rather than N.
 */
export async function GET(request: Request, { params }: Context) {
  const { productId } = await params;
  return proxyRequest(request, `/wishlist/contains/${productId}`, "GET");
}
