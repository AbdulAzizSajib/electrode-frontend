"use client";

import type { CheckoutItemInput } from "@/types/order";

/**
 * Short-lived handoffs for guest checkout, kept in `sessionStorage`.
 *
 * Two things need carrying between pages, and neither belongs in the URL:
 *
 *  - the phone a guest just ordered with, so the confirmation can look the
 *    order back up. The backend deliberately made tracking a POST to keep phone
 *    numbers out of URLs, logs and referrer headers; putting one in a query
 *    string here would undo that.
 *  - a "buy this one product" intent from a product page, so checkout can order
 *    it directly without it ever entering the cart.
 *
 * `sessionStorage` over a cookie: the same information, but scoped to the tab
 * that needs it and gone when the tab closes, rather than riding along on every
 * subsequent request. It survives a reload, which is the property the
 * confirmation depends on.
 *
 * Every read is defensive — storage can be unavailable (private browsing,
 * blocked cookies) or hold something another version wrote. A bad value means
 * "no handoff", never a thrown error on a page that would otherwise render.
 */

const GUEST_ORDER_KEY = "guestOrderContact";
const DIRECT_ORDER_KEY = "directOrderIntent";

/** What a guest needs to retrieve the order they just placed. */
export interface GuestOrderContact {
  orderNumber: string;
  phone: string;
}

/**
 * A single product carried from its page into checkout.
 *
 * `display` exists only to render the summary without a second lookup — the
 * product API is keyed by slug, not id, so checkout could not otherwise show
 * what is being bought. It is never sent to the server: the backend resolves
 * name, SKU and price from the database, so a tampered price here changes
 * nothing but what this one shopper briefly sees.
 */
export interface DirectOrderIntent {
  item: CheckoutItemInput;
  display: {
    name: string;
    image: string;
    unitPrice: number;
    variantName?: string;
  };
}

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable. The order still went through; the shopper
    // falls back to the tracking form, so this must never throw.
  }
}

function remove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Nothing to do — see writeJson.
  }
}

export function saveGuestOrderContact(contact: GuestOrderContact): void {
  writeJson(GUEST_ORDER_KEY, contact);
}

/**
 * The stored phone, but only for the order being asked about. Without the
 * order-number check, opening an older confirmation link would pair it with a
 * newer order's phone and report "not found" for an order that exists.
 */
export function readGuestOrderPhone(orderNumber: string): string | null {
  const stored = readJson<GuestOrderContact>(GUEST_ORDER_KEY);
  if (!stored || typeof stored.phone !== "string") return null;
  return stored.orderNumber === orderNumber ? stored.phone : null;
}

export function clearGuestOrderContact(): void {
  remove(GUEST_ORDER_KEY);
}

export function saveDirectOrderIntent(intent: DirectOrderIntent): void {
  writeJson(DIRECT_ORDER_KEY, intent);
}

export function readDirectOrderIntent(): DirectOrderIntent | null {
  const stored = readJson<DirectOrderIntent>(DIRECT_ORDER_KEY);
  const item = stored?.item;

  // Guard the shape rather than trusting it: a malformed intent would otherwise
  // reach the API as an unorderable line and fail the whole checkout.
  if (
    !item ||
    typeof item.productId !== "string" ||
    typeof item.quantity !== "number" ||
    item.quantity < 1
  ) {
    return null;
  }

  return {
    item,
    display: {
      name: stored?.display?.name ?? "Selected item",
      image: stored?.display?.image ?? "",
      unitPrice: Number(stored?.display?.unitPrice) || 0,
      variantName: stored?.display?.variantName,
    },
  };
}

export function clearDirectOrderIntent(): void {
  remove(DIRECT_ORDER_KEY);
}
