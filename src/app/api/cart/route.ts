import { proxyCartRequest } from "@/lib/cart-proxy";

export async function GET(request: Request) {
  return proxyCartRequest(request, "/cart", "GET");
}
