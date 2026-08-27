import { ApiError, apiFetch } from "@/lib/api-client";
import { buildAuthCookieHeader } from "@/lib/session";
import type { ApiOrder, ApiOrderItem, Order, OrderItem } from "@/types/order";

function toOrderItem(item: ApiOrderItem): OrderItem {
  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    name: item.productName,
    sku: item.sku,
    quantity: item.quantity,
    unitPrice: Number(item.unitPrice) || 0,
    totalPrice: Number(item.totalPrice) || 0,
  };
}

function toOrder(order: ApiOrder): Order {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: Number(order.subtotal) || 0,
    discountAmount: Number(order.discountAmount) || 0,
    shippingAmount: Number(order.shippingAmount) || 0,
    taxAmount: Number(order.taxAmount) || 0,
    totalAmount: Number(order.totalAmount) || 0,
    couponCode: order.couponCode ?? undefined,
    notes: order.notes ?? undefined,
    createdAt: order.createdAt,
    items: (order.items ?? []).map(toOrderItem),
    shippingAddress: order.shippingAddress ?? null,
  };
}

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
