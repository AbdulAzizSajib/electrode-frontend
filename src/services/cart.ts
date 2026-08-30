import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api-client";
import { buildAuthCookieHeader } from "@/lib/session";
import { toCartSummary } from "@/store/cartApi";
import type { ApiCart, CartSummary } from "@/types/cart";

/** Identifies a guest's cart. Set by the backend, relayed by /api/cart. */
const GUEST_TOKEN_COOKIE = "guestToken";

/**
 * Server-side read of the shopper's cart — signed in or guest.
 *
 * Checkout is a Server Component, so knowing up front whether the cart is empty
 * lets it render the empty state directly instead of flashing a spinner while
 * the client fetches. RTK Query still owns the cart once the page is
 * interactive; this only seeds the first paint.
 *
 * A guest's cart hangs off `guestToken` rather than a session, so that cookie is
 * forwarded alongside any auth cookies. Without it a guest gets no seeded cart
 * and sees exactly the spinner this function exists to avoid.
 *
 * Returns null on failure so the caller can fall back to the client query
 * rather than wrongly claiming the cart is empty.
 */
export async function getServerCart(): Promise<CartSummary | null> {
  try {
    const authCookie = await buildAuthCookieHeader();
    const guestToken = (await cookies()).get(GUEST_TOKEN_COOKIE)?.value;

    const cookie = [
      authCookie,
      guestToken ? `${GUEST_TOKEN_COOKIE}=${guestToken}` : null,
    ]
      .filter(Boolean)
      .join("; ");

    // Neither a session nor a guest cart — there is nothing to read.
    if (!cookie) return null;

    const { data } = await apiFetch<ApiCart>("/cart", { cookie });
    return toCartSummary(data);
  } catch {
    return null;
  }
}
