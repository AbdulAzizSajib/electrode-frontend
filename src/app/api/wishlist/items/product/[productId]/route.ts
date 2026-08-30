import { proxyRequest } from "@/lib/api-proxy";

type Context = { params: Promise<{ productId: string }> };

/**
 * Remove by product rather than by wishlist-item id — what a heart toggle has
 * on hand, since it knows the product it is rendered for but not the item row.
 *
 * Sits alongside `items/[itemId]`; the literal `product` segment is matched
 * ahead of the dynamic one, so a real item id can never be swallowed by this
 * route. Mirrors the backend's own `/wishlist/items/product/:productId`.
 */
export async function DELETE(request: Request, { params }: Context) {
  const { productId } = await params;
  return proxyRequest(request, `/wishlist/items/product/${productId}`, "DELETE");
}
