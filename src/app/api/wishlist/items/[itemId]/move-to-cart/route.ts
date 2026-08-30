import { proxyRequest } from "@/lib/api-proxy";

type Context = { params: Promise<{ itemId: string }> };

/**
 * Adds to the cart and removes from the wishlist in one backend transaction.
 * Because it mutates the cart too, the client invalidates `cartApi`'s tag on
 * success — `wishlistApi` cannot do that declaratively across slices.
 */
export async function POST(request: Request, { params }: Context) {
  const { itemId } = await params;
  return proxyRequest(request, `/wishlist/items/${itemId}/move-to-cart`, "POST");
}
