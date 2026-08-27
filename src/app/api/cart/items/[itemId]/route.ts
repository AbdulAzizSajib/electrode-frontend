import { proxyCartRequest } from "@/lib/cart-proxy";

type Context = { params: Promise<{ itemId: string }> };

/** Body: `{ quantity }`. */
export async function PATCH(request: Request, { params }: Context) {
  const { itemId } = await params;
  return proxyCartRequest(request, `/cart/items/${itemId}`, "PATCH");
}

export async function DELETE(request: Request, { params }: Context) {
  const { itemId } = await params;
  return proxyCartRequest(request, `/cart/items/${itemId}`, "DELETE");
}
