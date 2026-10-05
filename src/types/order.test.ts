import { describe, expect, it } from "vitest";
import {
  CUSTOMER_CANCELLABLE_STATUSES,
  toOrderListItem,
  type ApiOrder,
  type ApiOrderItem,
} from "@/types/order";

const item = (quantity: number): ApiOrderItem => ({
  id: `item-${quantity}`,
  orderId: "order-1",
  productId: "product-1",
  variantId: null,
  productName: "Thing",
  sku: "SKU",
  quantity,
  unitPrice: "100.00",
  totalPrice: String(quantity * 100),
  createdAt: "2026-10-01T10:00:00.000Z",
});

const order = (overrides: Partial<ApiOrder> = {}): ApiOrder =>
  ({
    id: "order-1",
    orderNumber: "ORD-1001",
    customerId: "customer-1",
    status: "PENDING",
    subtotal: "500.00",
    discountAmount: "0.00",
    shippingAmount: "60.00",
    taxAmount: "0.00",
    totalAmount: "560.00",
    couponCode: null,
    notes: null,
    shippingAddressId: null,
    createdAt: "2026-10-01T10:00:00.000Z",
    updatedAt: "2026-10-01T10:00:00.000Z",
    items: [item(2), item(3)],
    ...overrides,
  }) as ApiOrder;

describe("toOrderListItem", () => {
  it("counts units across lines, not lines", () => {
    expect(toOrderListItem(order()).itemCount).toBe(5);
  });

  it("parses the total from the decimal string", () => {
    expect(toOrderListItem(order()).total).toBe(560);
  });

  it("counts an order without items as zero", () => {
    expect(toOrderListItem(order({ items: undefined })).itemCount).toBe(0);
    expect(toOrderListItem(order({ items: [] })).itemCount).toBe(0);
  });

  it("carries identity, status and date through unchanged", () => {
    expect(toOrderListItem(order({ status: "SHIPPED" }))).toMatchObject({
      id: "order-1",
      orderNumber: "ORD-1001",
      status: "SHIPPED",
      createdAt: "2026-10-01T10:00:00.000Z",
    });
  });
});

describe("CUSTOMER_CANCELLABLE_STATUSES", () => {
  // Mirrors the backend constant; if this fails, update both together.
  it("is exactly PENDING and CONFIRMED", () => {
    expect([...CUSTOMER_CANCELLABLE_STATUSES].sort()).toEqual(["CONFIRMED", "PENDING"]);
  });
});
