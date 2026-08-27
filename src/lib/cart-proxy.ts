import { proxyRequest } from "@/lib/api-proxy";

/**
 * Cart-specific alias for the shared proxy. The forwarding logic is identical
 * for every backend call (see `api-proxy.ts`); this keeps the cart route
 * handlers reading in cart terms.
 */
export const proxyCartRequest = proxyRequest;
