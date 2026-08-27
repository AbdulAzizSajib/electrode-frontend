import { apiFetch } from "@/lib/api-client";
import { buildAuthCookieHeader } from "@/lib/session";
import { toAddress, type Address, type ApiCustomerAddress } from "@/types/address";

/**
 * The signed-in shopper's saved addresses, for server-rendering checkout with
 * a selection already made. Client-side reads and mutations go through
 * `addressApi` instead.
 *
 * Returns an empty list on failure — checkout treats "no addresses" as "add one
 * first", which is a safe outcome either way.
 */
export async function getMyAddresses(): Promise<Address[]> {
  try {
    const cookie = await buildAuthCookieHeader();
    if (!cookie) return [];

    const { data } = await apiFetch<ApiCustomerAddress[]>(
      "/customers/me/addresses",
      { cookie },
    );

    if (!Array.isArray(data)) return [];

    // Default first, so a selector can take the head of the list.
    return data
      .map(toAddress)
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
  } catch {
    return [];
  }
}
