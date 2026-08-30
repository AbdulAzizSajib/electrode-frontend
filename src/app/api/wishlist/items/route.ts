import { proxyRequest } from "@/lib/api-proxy";

/** Body: `{ productId }`. Saving an already-saved product is not an error. */
export async function POST(request: Request) {
  return proxyRequest(request, "/wishlist/items", "POST");
}
