import { proxyRequest } from "@/lib/api-proxy";

type Context = { params: Promise<{ itemId: string }> };

export async function DELETE(request: Request, { params }: Context) {
  const { itemId } = await params;
  return proxyRequest(request, `/wishlist/items/${itemId}`, "DELETE");
}
