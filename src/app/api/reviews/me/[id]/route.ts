import { proxyRequest } from "@/lib/api-proxy";

type Context = { params: Promise<{ id: string }> };

/** Author-scoped: the backend rejects an id that is not the caller's own review. */
export async function PATCH(request: Request, { params }: Context) {
  const { id } = await params;
  return proxyRequest(request, `/reviews/me/${id}`, "PATCH");
}

export async function DELETE(request: Request, { params }: Context) {
  const { id } = await params;
  return proxyRequest(request, `/reviews/me/${id}`, "DELETE");
}
