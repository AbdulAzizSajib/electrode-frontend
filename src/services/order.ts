import { ApiError, apiFetch } from "@/lib/api-client";
import { buildAuthCookieHeader } from "@/lib/session";
import {
  toOrder,
  toOrderListItem,
  type ApiOrder,
  type Order,
  type OrderListItem,
} from "@/types/order";
import type { PaginationMeta } from "@/types/product";

/** Orders per history page. */
export const ORDER_HISTORY_PAGE_SIZE = 10;

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

/**
 * One page of the signed-in customer's order history, newest first.
 *
 * The endpoint is customer-scoped on the backend, so this lists only orders on
 * the caller's account — orders placed as a guest live on a separate guest
 * customer and do not appear (Track Order still finds them).
 *
 * Returns null when there is no session or the backend rejects it, so the page
 * can send the visitor to sign in. EVERY OTHER FAILURE IS RETHROWN rather than
 * returned as an empty list: "You haven't placed an order yet" during a backend
 * outage would be a false statement about the customer's account, which is the
 * one kind of degraded render this storefront does not allow.
 *
 * The sort is passed explicitly although it is the backend's default, so a
 * change of default cannot reorder the history underneath it.
 */
export async function getMyOrders(
  page: number,
): Promise<{ orders: OrderListItem[]; meta: PaginationMeta } | null> {
  const cookie = await buildAuthCookieHeader();
  if (!cookie) return null;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(ORDER_HISTORY_PAGE_SIZE),
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  try {
    const response = await apiFetch<ApiOrder[]>(`/orders?${query}`, { cookie });
    const data = Array.isArray(response.data) ? response.data : [];

    return {
      orders: data.map(toOrderListItem),
      meta: response.meta ?? {
        page,
        limit: ORDER_HISTORY_PAGE_SIZE,
        total: data.length,
        totalPages: data.length > 0 ? page : 0,
      },
    };
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}
