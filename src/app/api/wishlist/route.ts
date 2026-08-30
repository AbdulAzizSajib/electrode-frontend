import { proxyRequest } from "@/lib/api-proxy";

/**
 * The wishlist is per-customer and authenticated by an httpOnly cookie on the
 * backend's own domain, so every call here goes through the proxy — a browser
 * fetch could not carry that cookie cross-site.
 *
 * There is no guest wishlist: unauthenticated requests get a 401, which the
 * client handles by not issuing them at all (see `useWishlistProductIds`).
 */
export async function GET(request: Request) {
  const { search } = new URL(request.url);
  return proxyRequest(request, `/wishlist${search}`, "GET");
}
