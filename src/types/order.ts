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
  createdAt: string;
  updatedAt: string;
  items?: ApiOrderItem[];
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
}

/**
 * Body for `POST /orders`. `expectedTotal` is deliberately omitted — the
 * storefront cannot compute the server's total (the tax rate and free-shipping
 * threshold have no public endpoint), so sending an estimate would reject valid
 * orders as price mismatches.
 */
export interface PlaceOrderPayload {
  shippingAddressId: string;
  shippingMethodId: string;
  notes?: string;
  /**
   * Sent as the `Idempotency-Key` header rather than in the body. Identifies
   * one checkout *attempt*, so a retry after an unconfirmed outcome resolves
   * to the order already placed instead of placing a second one.
   */
  idempotencyKey: string;
}
