import { proxyRequest } from "@/lib/api-proxy";

type Context = { params: Promise<{ addressId: string }> };

const addressPath = (addressId: string) => `/customers/me/addresses/${addressId}`;

export async function GET(request: Request, { params }: Context) {
  const { addressId } = await params;
  return proxyRequest(request, addressPath(addressId), "GET");
}

export async function PATCH(request: Request, { params }: Context) {
  const { addressId } = await params;
  return proxyRequest(request, addressPath(addressId), "PATCH");
}

export async function DELETE(request: Request, { params }: Context) {
  const { addressId } = await params;
  return proxyRequest(request, addressPath(addressId), "DELETE");
}
