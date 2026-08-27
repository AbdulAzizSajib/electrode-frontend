import { proxyCartRequest } from "@/lib/cart-proxy";

/** Body: `{ productId, variantId?, quantity? }`. */
export async function POST(request: Request) {
  return proxyCartRequest(request, "/cart/items", "POST");
}
