import { apiFetch } from "@/lib/api-client";
import { buildAuthCookieHeader } from "@/lib/session";
import { toCartSummary } from "@/store/cartApi";
import type { ApiCart, CartSummary } from "@/types/cart";

/**
 * Server-side read of the signed-in shopper's cart.
 *
 * Checkout is a Server Component, so knowing up front whether the cart is empty
 * lets it render the empty state directly instead of flashing a spinner while
 * the client fetches. RTK Query still owns the cart once the page is
 * interactive; this only seeds the first paint.
 *
 * Returns null on failure so the caller can fall back to the client query
 * rather than wrongly claiming the cart is empty.
 */
export async function getServerCart(): Promise<CartSummary | null> {
  try {
    const cookie = await buildAuthCookieHeader();
    if (!cookie) return null;

    const { data } = await apiFetch<ApiCart>("/cart", { cookie });
    return toCartSummary(data);
  } catch {
    return null;
  }
}
