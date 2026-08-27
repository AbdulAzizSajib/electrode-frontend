import { proxyCartRequest } from "@/lib/cart-proxy";

/**
 * Body: `{ code }`. Note the asymmetry in the backend's routes — applying posts
 * to `/cart/apply-coupon`, removing deletes `/cart/coupon`.
 */
export async function POST(request: Request) {
  return proxyCartRequest(request, "/cart/apply-coupon", "POST");
}

export async function DELETE(request: Request) {
  return proxyCartRequest(request, "/cart/coupon", "DELETE");
}
