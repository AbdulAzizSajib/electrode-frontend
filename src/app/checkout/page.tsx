"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/format";

const SHIPPING_FLAT_RATE = 9.99;
const FREE_SHIPPING_THRESHOLD = 130;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);

  const shipping = items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    // UI-only checkout: no payment is processed here. Wire this handler up
    // to your backend / payment provider (Stripe, Shopify, etc.) once it's
    // ready, then clear the cart and redirect on a confirmed order.
    setPlacing(true);
    setTimeout(() => {
      clearCart();
      router.push("/checkout/success");
    }, 900);
  }

  if (items.length === 0) {
    return (
      <div className="container-px mx-auto max-w-3xl py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mb-6 text-gray-500">Add some products before checking out.</p>
        <Link href="/products" className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-6xl py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <form onSubmit={handlePlaceOrder} className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Contact</h2>
            <input
              required
              type="email"
              placeholder="Email address"
              className="w-full rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand"
            />
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input required placeholder="First name" className="rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
              <input required placeholder="Last name" className="rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
              <input required placeholder="Address" className="sm:col-span-2 rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
              <input required placeholder="City" className="rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
              <input required placeholder="Postal code" className="rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
              <input required placeholder="Country" className="rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
              <input required placeholder="Phone" className="rounded border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand" />
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment</h2>
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
              Payment processing isn&apos;t connected yet — this checkout is a UI preview. Hook this
              section up to your backend and a payment provider (e.g. Stripe) to accept real orders.
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input placeholder="Card number" disabled className="rounded border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-400" />
              <input placeholder="Name on card" disabled className="rounded border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-400" />
              <input placeholder="Expiry (MM/YY)" disabled className="rounded border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-400" />
              <input placeholder="CVC" disabled className="rounded border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-400" />
            </div>
          </section>

          <button
            type="submit"
            disabled={placing}
            className="w-full rounded bg-brand py-3.5 text-sm font-semibold uppercase text-white hover:bg-brand-dark disabled:opacity-70"
          >
            {placing ? "Placing order…" : `Place Order — ${formatPrice(total)}`}
          </button>
        </form>

        <div className="h-fit rounded-xl bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
          <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-white">
                  <Image src={item.product.image} alt={item.product.title} fill className="object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-[10px] font-bold text-white">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm text-gray-800">{item.product.title}</p>
                  <p className="text-xs text-gray-500">{item.product.vendor}</p>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-sale">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
