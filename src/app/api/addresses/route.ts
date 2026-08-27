import { proxyRequest } from "@/lib/api-proxy";

const ADDRESSES_PATH = "/customers/me/addresses";

export async function GET(request: Request) {
  return proxyRequest(request, ADDRESSES_PATH, "GET");
}

export async function POST(request: Request) {
  return proxyRequest(request, ADDRESSES_PATH, "POST");
}
