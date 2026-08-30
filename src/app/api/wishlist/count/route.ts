import { proxyRequest } from "@/lib/api-proxy";

/** Backs the header badge. */
export async function GET(request: Request) {
  return proxyRequest(request, "/wishlist/count", "GET");
}
