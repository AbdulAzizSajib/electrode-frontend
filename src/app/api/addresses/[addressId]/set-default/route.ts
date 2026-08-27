import { proxyRequest } from "@/lib/api-proxy";

type Context = { params: Promise<{ addressId: string }> };

/** No body — the backend unsets any other default of the same type. */
export async function PATCH(request: Request, { params }: Context) {
  const { addressId } = await params;
  return proxyRequest(
    request,
    `/customers/me/addresses/${addressId}/set-default`,
    "PATCH",
  );
}
