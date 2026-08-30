import type { ApiCustomerAddress } from "@/types/address";

/**
 * Order and shipping types mirroring the backend's order and shipping-method
 * endpoints. As everywhere else in this API, monetary values arrive as decimal
 * strings and are parsed to numbers at the service boundary.
 */

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "COMPLETED";

export interface ApiShippingMethod {
  id: string;
  name: string;
  description: string | null;
  price: string;
  estimatedDays: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description?: string;
  price: number;
  estimatedDays?: number;
}

export interface ApiOrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  /** Snapshotted at order time — the product may be renamed later. */
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  createdAt: string;
}

/** Payment recorded against an order. Guest orders always carry one, COD. */
export interface ApiPayment {
  id: string;
  orderId: string;
  amount: string;
  method: string;
  status: string;
  createdAt: string;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  status: OrderStatus;
  subtotal: string;
  discountAmount: string;
  shippingAmount: string;
  taxAmount: string;
  totalAmount: string;
  couponCode: string | null;
  notes: string | null;
  shippingAddressId: string | null;
  /** Recorded at checkout rather than derived, so it stays true even when a
   *  guest's phone resolves onto an existing registered customer. */
  isGuestOrder?: boolean;
  createdAt: string;
  updatedAt: string;
  items?: ApiOrderItem[];
  payments?: ApiPayment[];
  shippingAddress?: ApiCustomerAddress | null;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: ApiCustomerAddress | null;
  /** e.g. "COD" — shown on the confirmation so payment terms are never implicit. */
  paymentMethod?: string;
}

/** A delivery address typed in at checkout, as a guest has none saved. */
export interface GuestAddressInput {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

/** One line of a cart-less checkout. The server resolves name, SKU and price. */
export interface CheckoutItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

/** Shared by both checkout flows. */
interface PlaceOrderCommon {
  shippingMethodId?: string;
  notes?: string;
  /**
   * Sent as the `Idempotency-Key` header rather than in the body. Identifies
   * one checkout *attempt*, so a retry after an unconfirmed outcome resolves
   * to the order already placed instead of placing a second one.
   */
  idempotencyKey: string;
}

/**
 * Body for `POST /orders`. `expectedTotal` is deliberately omitted — the
 * storefront cannot compute the server's total (the tax rate and free-shipping
 * threshold have no public endpoint), so sending an estimate would reject valid
 * orders as price mismatches.
 *
 * A union rather than one interface with everything optional: the backend
 * rejects a `shippingAddressId` sent by a guest, so "an address id *and* inline
 * address fields" is a 400 that a flat optional shape would happily typecheck.
 * Keyed on `mode`, mirroring the session flag the checkout UI branches on.
 */
export type PlaceOrderPayload =
  | (PlaceOrderCommon & {
      mode: "account";
      /** A saved address; the endpoint scopes it to the signed-in customer. */
      shippingAddressId: string;
    })
  | (PlaceOrderCommon & {
      mode: "guest";
      fullName: string;
      phone: string;
      shippingAddress: GuestAddressInput;
      /** Present for a direct product order; absent means "use my cart". */
      items?: CheckoutItemInput[];
      /** Guest orders are cash on delivery; the backend rejects anything else. */
      paymentMethod: "COD";
    });

/** Body for `POST /orders/track`. The number and phone together are the credential. */
export interface GuestOrderLookup {
  orderNumber: string;
  phone: string;
}

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

/**
 * The API shape mapped to the domain shape — decimal strings parsed to numbers,
 * nulls narrowed to undefined.
 *
 * Lives here rather than in `services/order.ts` because both sides of the
 * boundary need it: the signed-in confirmation maps server-side, while guest
 * tracking maps in the browser. `services/order.ts` transitively imports
 * `next/headers`, so importing it from a client component would fail the build.
 * This module is types and pure functions only.
 */
export function toOrder(order: ApiOrder): Order {
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
    // A guest order always carries exactly one payment (COD). Authenticated
    // orders currently carry none, so this stays undefined for them.
    paymentMethod: order.payments?.[0]?.method,
  };
}
