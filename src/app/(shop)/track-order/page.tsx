"use client";

import { useState } from "react";
import Link from "next/link";
import GuestOrderLookupForm from "@/components/order/GuestOrderLookupForm";
import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import type { Order } from "@/types/order";

/**
 * Order tracking for a shopper with no session — chiefly guests, who have no
 * account page to check.
 *
 * Keyed on order number *and* phone, not email: the backend matches guest
 * orders by the phone they were placed with, and an order number on its own is
 * enumerable.
 */
export default function TrackOrderPage() {
  const [order, setOrder] = useState<Order | null>(null);

  if (order) {
    return (
      <div className="container-px mx-auto max-w-3xl py-16">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Order {order.orderNumber}
          </h1>
          <p className="text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()} — currently{" "}
            <span className="font-semibold text-gray-900">
              {order.status.toLowerCase()}
            </span>
            .
          </p>
        </div>

        <OrderSummaryCard order={order} />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setOrder(null)}
            className="rounded border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Track another order
          </button>
          <Link
            href="/products"
            className="rounded bg-brand px-6 py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-md py-20">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Track Your Order</h1>
      <p className="mb-8 text-sm text-gray-500">
        Enter your order number and the phone number you ordered with.
      </p>

      <GuestOrderLookupForm onFound={setOrder} />

      <p className="mt-6 text-center text-sm text-gray-500">
        Have an account?{" "}
        <Link href="/account" className="font-semibold text-brand hover:underline">
          See all your orders
        </Link>
      </p>
    </div>
  );
}
