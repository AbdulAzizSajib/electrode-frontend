import { apiFetch } from "@/lib/api-client";
import type { ApiShippingMethod, ShippingMethod } from "@/types/order";

/** Shipping options change rarely; a short window avoids refetching per checkout. */
const SHIPPING_REVALIDATE_SECONDS = 300;

/**
 * The merchant's active shipping methods, for the checkout selector. Public —
 * no auth required. Returns an empty list on failure so checkout can tell the
 * shopper no options are available rather than erroring.
 */
export async function getShippingMethods(): Promise<ShippingMethod[]> {
  try {
    const { data } = await apiFetch<ApiShippingMethod[]>("/shipping-methods", {
      revalidate: SHIPPING_REVALIDATE_SECONDS,
    });

    if (!Array.isArray(data)) return [];

    return data
      .filter((method) => method.isActive)
      .map((method) => ({
        id: method.id,
        name: method.name,
        // The API returns "" for an absent description, not null.
        description: method.description || undefined,
        price: Number(method.price) || 0,
        estimatedDays: method.estimatedDays ?? undefined,
      }))
      .sort((a, b) => a.price - b.price);
  } catch {
    return [];
  }
}
