import type { ApiCustomerAddress } from "@/types/address";
import type { AdvancePaymentChoice } from "@/types/store-settings";

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

/**
 * Mirrors the backend `OrderStatus` enum, and must be kept in step with it.
 *
 * Nothing here fails the build when a status is missing: every render site
 * shows the status as `order.status.toLowerCase()`, so an unlisted value still
 * displays, just without ever having been declared. That makes drift silent —
 * add new statuses here when the server gains them.
 *
 * `PACKED` means picked and boxed but not yet handed to a carrier.
 */
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
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

/**
 * Payment recorded against an order.
 *
 * An order placed with cash on delivery carries one row for the full total, in
 * `PENDING`. An order placed with an advance payment carries one row for the
 * ADVANCE ONLY, in `PROCESSING` — claimed, not yet checked — and the remainder
 * is the balance rather than a second row. See
 * server/openspec/changes/add-advance-payment-checkout, design.md Decision 3.
 */
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
  /**
   * The advance the shopper claims to have sent, present only when they did.
   *
   * The confirmation has to be able to say "we have your payment and are
   * checking it" rather than "your order is confirmed", because it is not: the
   * order sits until a human matches the reference against a statement. Absent
   * on a plain cash-on-delivery order, which is every order on a store with
   * advance payment off.
   */
  advancePayment?: {
    method: string;
    amount: number;
    /** `PROCESSING` = claimed and undecided, `PAID` = verified, `FAILED` = rejected. */
    status: string;
    /** What is still owed at the door. Zero on the full-payment choice. */
    balanceAmount: number;
  };
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
  /**
   * A CACHE KEY, NOT A REQUEST FIELD — `quoteCheckout` strips it before sending.
   *
   * For a cart order the server prices the cart itself, so nothing else on this
   * request changes when the cart does, and RTK Query would hand back the
   * previous quote: the shopper would see their subtotal move while the
   * delivery charge and the total on the Place Order button stayed priced for
   * the quantity they just changed.
   *
   * `providesTags: ["CheckoutQuote"]` was meant to cover this and cannot —
   * `cartApi` is a separate `createApi` instance and has no way to invalidate
   * another api's tag. Re-keying the query arg is what actually re-runs it.
   *
   * Absent for a direct order, which carries its lines in `items` and is
   * already re-keyed by them.
   *
   * See server/openspec/changes/add-product-slider-and-card-quantity, task 7.1.
   */
  cartKey?: string;
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
   * What each advance-payment choice would cost, and what each leaves for the
   * door. Computed by the server from this same quote, so the figure shown is
   * the figure placement will accept.
   *
   * ALWAYS present, even on a store with advance payment off — it is a pure
   * derivation of a total the response already carries, and the storefront
   * decides whether to offer the choices from the store settings rather than
   * from these being here. Optional on the type only so a cached response from
   * before this shipped does not read as a broken one.
   */
  advanceOptions?: Record<AdvancePaymentChoice, AdvanceSplit>;
  /**
   * Null only on the landing-page path, which prices its own zones and never
   * consults the store's option list.
   */
  delivery: CheckoutQuoteDelivery | null;
}

/** What one advance-payment choice costs now, and what it leaves for later. */
export interface AdvanceSplit {
  /** Sent before the order ships. */
  advanceAmount: number;
  /** Paid at the door. Zero on the full-payment choice. */
  balanceAmount: number;
}

/**
 * What the shopper says about money they have already sent.
 *
 * NO AMOUNT FIELD beyond the echo: the server computes what the advance is from
 * the choice and the delivery option it resolves. `expectedAdvanceAmount` is the
 * figure the shopper was SHOWN, sent back as an agreement check — if the world
 * moved underneath the page, the server refuses rather than recording them as
 * having underpaid an amount they were never shown. Mirrors
 * `advanceClaimZodSchema` in the backend's order.validation.ts.
 */
export interface AdvancePaymentClaim {
  choice: AdvancePaymentChoice;
  /** The merchant account's own id, echoed back exactly as received. */
  accountId: string;
  expectedAdvanceAmount: number;
  /** The shopper's own number, or the depositor's name/account. */
  senderIdentifier: string;
  transactionId: string;
}

/** The methods checkout can reach. COD is the door; the rest are advance claims. */
export type CheckoutPaymentMethod =
  | "COD"
  | "BKASH"
  | "NAGAD"
  | "ROCKET"
  | "BANK_TRANSFER";

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
  /**
   * How the shopper intends to pay. Omitted entirely on a plain cash-on-delivery
   * order, which is what the backend treats an absent value as.
   *
   * Anything other than `COD` is money the shopper says they have ALREADY sent,
   * and must arrive with `advancePayment` beside it — the backend rejects half a
   * claim in either direction.
   */
  paymentMethod?: CheckoutPaymentMethod;
  /** Present exactly when `paymentMethod` is an advance method. */
  advancePayment?: AdvancePaymentClaim;
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
      /*
       * `paymentMethod` and `advancePayment` sit on PlaceOrderCommon rather than
       * here, deliberately: a signed-in shopper sends the delivery charge on
       * exactly the same terms a guest does, and the backend's own check moved
       * out of its guest branch for that reason. Keeping them guest-only here
       * would have made the account path unable to express an advance order the
       * server would happily accept.
       */
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
    // orders currently carry none, so this stays undefined for them — with the
    // one exception below, which creates its row on every path.
    paymentMethod: order.payments?.[0]?.method,
    advancePayment: toAdvancePayment(order),
  };
}

/** The payment methods that mean "the shopper says they already sent this". */
const ADVANCE_METHODS = ["BKASH", "NAGAD", "ROCKET", "BANK_TRANSFER"];

/**
 * The advance claim on an order, if it has one.
 *
 * Recognised by METHOD rather than by status, because all three outcomes have
 * to be tellable apart on the confirmation: still being checked, verified, or
 * rejected. A cash-on-delivery row is not a claim and yields undefined.
 *
 * The balance is derived here rather than read: the order carries one payment
 * row for the advance alone, so what is left at the door is the total minus it.
 */
function toAdvancePayment(order: ApiOrder): Order["advancePayment"] {
  const payment = order.payments?.find((p) => ADVANCE_METHODS.includes(p.method));
  if (!payment) return undefined;

  const amount = Number(payment.amount) || 0;
  const total = Number(order.totalAmount) || 0;

  return {
    method: payment.method,
    amount,
    status: payment.status,
    balanceAmount: Math.max(0, Math.round((total - amount) * 100) / 100),
  };
}
