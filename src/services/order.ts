import { ApiError, apiFetch } from "@/lib/api-client";
import { buildAuthCookieHeader } from "@/lib/session";
import { toOrder, type ApiOrder, type Order } from "@/types/order";

/**
 * A single order belonging to the signed-in customer.
 *
 * The endpoint is customer-scoped, so another shopper's id yields a not-found
 * rather than leaking their order — which is what lets the confirmation page
 * take the id straight from the URL. Returns null when the order does not exist
 * or is not the caller's; other failures return null too, so the page shows its
 * not-found state rather than claiming an order was placed.
 */
export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const cookie = await buildAuthCookieHeader();
    if (!cookie) return null;

    const { data } = await apiFetch<ApiOrder>(`/orders/${id}`, { cookie });
    return data ? toOrder(data) : null;
  } catch (error) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}

/**
 * An order retrieved without a session, by the number and phone it was placed
 * with. Needs no cookie: the pair *is* the credential.
 *
 * The backend answers a wrong phone and an unknown order number with the same
 * 404 so the response cannot be used to probe which order numbers exist — hence
 * one null here for both, with no attempt to tell the caller which it was.
 */
export async function getGuestOrder(
  orderNumber: string,
  phone: string,
): Promise<Order | null> {
  try {
    const { data } = await apiFetch<ApiOrder>("/orders/track", {
      method: "POST",
      body: { orderNumber, phone },
    });
    return data ? toOrder(data) : null;
  } catch (error) {
    if (error instanceof ApiError) return null;
    throw error;
  }
}
