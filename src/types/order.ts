import type { ApiCustomerAddress } from "@/types/address";

/**
 * Order types mirroring the backend's order endpoints. As everywhere else in
 * this API, monetary values arrive as decimal strings and are parsed to numbers
 * at the service boundary.
 *
 * Delivery is something the shopper PICKS: the store's options arrive with the
 * public settings, the shopper chooses one, and its key is sent on both the
 * quote and the order so the amount shown is the amount charged. Nothing is
 * matched against or inferred from the address.
 */

/** Whether an order is delivered to the shopper or collected by them. */
export type DeliveryMethod = "DELIVERY" | "PICKUP";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "COMPLETED";

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
  /**
   * What the shopper chose, captured when the order was placed. The label does
   * NOT change when the merchant later renames, reprices or deletes that
   * option — it is what this shopper agreed to.
   *
   * Null on two populations that legitimately have no choice recorded: orders
   * placed before delivery options existed, and landing-page orders, which are
   * priced by the page's own zones.
   */
  deliveryMethod?: DeliveryMethod | null;
  deliveryOptionKey?: string | null;
  deliveryOptionLabel?: string | null;
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
  /**
   * The delivery choice as it was at placement. Undefined for orders placed
   * before options existed and for landing-page orders — both of which have no
   * choice to show, which is different from having chosen delivery.
   */
  deliveryMethod?: DeliveryMethod;
  deliveryOptionLabel?: string;
  createdAt: string;
  items: OrderItem[];
  shippingAddress?: ApiCustomerAddress | null;
  /** e.g. "COD" — shown on the confirmation so payment terms are never implicit. */
  paymentMethod?: string;
}

/** A delivery address typed in at checkout, as a guest has none saved. */
/**
 * Every field is optional, `addressLine1` and `city` included: which of them a
 * guest must supply is a merchant setting (see `checkoutConfig`), so a field
 * the merchant is not collecting is simply absent. Mirrors the backend's
 * `guestAddressZodSchema`, which was relaxed for the same reason.
 */
export interface GuestAddressInput {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
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

/**
 * What to price, for `POST /orders/quote`.
 *
 * The delivery option key is REQUIRED, unlike the address fields that used to be
 * here: a quote whose delivery charge is missing is a total the shopper would be
 * shown and then not charged. The storefront always has a key to send, because
 * the option list arrives with the public settings before any quote is asked
 * for.
 *
 * There is no address on this request at all. It used to carry one because
 * delivery was matched from it while the shopper typed; nothing about an address
 * changes a price now.
 */
export interface CheckoutQuoteRequest {
  /** Which option the shopper picked. Priced exactly as configured. */
  deliveryOptionKey: string;
  /** Prices these lines instead of the cart, for a direct product order. */
  items?: CheckoutItemInput[];
}

/**
 * The option the server resolved and priced, echoed back.
 *
 * Lets the storefront confirm it priced what the shopper has selected, so a
 * stale key surfaces as a mismatch rather than as a silently different total.
 */
export interface CheckoutQuoteDelivery {
  optionKey: string;
  optionLabel: string;
  method: DeliveryMethod;
  price: number;
  days: number;
}

/**
 * The server's own arithmetic for this basket. Not an estimate — checkout uses
 * exactly this calculation, so what is shown here is what will be charged.
 */
export interface CheckoutQuote {
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  shippingAmount: number;
  /** What delivery costs before any waiver, so "Free" can be shown as a saving. */
  shippingBeforeWaiver: number;
  deliveryDays: number | null;
  totalAmount: number;
  /**
   * Null only on the landing-page path, which prices its own zones and never
   * consults the store's option list.
   */
  delivery: CheckoutQuoteDelivery | null;
}

/** Shared by both checkout flows. */
interface PlaceOrderCommon {
  notes?: string;
  /**
   * Which delivery option the shopper chose, and the ONLY thing that decides
   * what delivery costs. Must be the same key the quote was priced against, or
   * the amount shown and the amount charged are two different numbers.
   *
   * There is no `deliveryMethod` beside it: delivery-versus-collection is a
   * property of the option the merchant configured, so a client cannot assert
   * collection against a delivery price.
   */
  deliveryOptionKey: string;
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
      /** Absent when the merchant has turned the name field off. */
      fullName?: string;
      /**
       * Required, and not configurable: guest order lookup and the per-phone
       * cash-on-delivery limit are both keyed on it, so the backend refuses an
       * order without one regardless of settings.
       */
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
    deliveryMethod: order.deliveryMethod ?? undefined,
    deliveryOptionLabel: order.deliveryOptionLabel ?? undefined,
    createdAt: order.createdAt,
    items: (order.items ?? []).map(toOrderItem),
    shippingAddress: order.shippingAddress ?? null,
    // A guest order always carries exactly one payment (COD). Authenticated
    // orders currently carry none, so this stays undefined for them.
    paymentMethod: order.payments?.[0]?.method,
  };
}
