"use client";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  CartQuantityControl,
  CartRemoveButton,
} from "@/components/cart/CartLineControls";
import CouponForm from "@/components/cart/CouponForm";
import { formatPrice } from "@/lib/format";
import { EMPTY_CART, useGetCartQuery } from "@/store/cartApi";

export default function CartPage() {
  const { data: cart = EMPTY_CART, isLoading, isError } = useGetCartQuery();

  if (isLoading) {
    return (
      <div className="container-px mx-auto flex max-w-346 justify-center py-20 text-gray-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  // Distinct from the empty state: showing an empty cart when the service is
  // down would tell the shopper their items are gone.
  if (isError) {
    return (
      <div className="container-px mx-auto max-w-346 py-20 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Your Cart</h1>
        <p className="text-gray-500">
          We couldn&apos;t load your cart right now. Please try again shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-346 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Your Cart</h1>

      {cart.lines.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-gray-500">Your cart is currently empty.</p>
          <Link
            href="/products"
            className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr] gap-4 border-b border-gray-200 pb-3 text-xs font-semibold uppercase text-gray-500 sm:grid">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span className="text-right">Total</span>
            </div>
            {cart.lines.map((line) => (
              <div
                key={line.id}
                className="grid grid-cols-1 items-center gap-4 border-b border-gray-100 py-5 sm:grid-cols-[2fr_1fr_1fr_1fr]"
              >
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
                    <Image src={line.image} alt={line.name} fill className="object-cover" />
                  </div>
                  <div>
                    <Link
                      href={`/products/${line.slug}`}
                      className="text-sm font-medium text-gray-900 hover:text-brand"
                    >
                      {line.name}
                    </Link>
                    {line.variantName && (
                      <p className="mt-1 text-xs text-gray-500">{line.variantName}</p>
                    )}
                    <CartRemoveButton line={line} withLabel className="mt-2 sm:hidden" />
                  </div>
                </div>
                <span className="text-sm text-gray-700">{formatPrice(line.unitPrice)}</span>
                <CartQuantityControl line={line} size="md" />
                <div className="flex items-center justify-between sm:justify-end sm:gap-4">
                  <span className="text-sm font-semibold text-sale">
                    {formatPrice(line.lineTotal)}
                  </span>
                  <CartRemoveButton line={line} className="hidden sm:block" />
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-xl bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            {cart.discountAmount > 0 && (
              <div className="mt-2 flex items-center justify-between text-sm text-green-700">
                <span>Discount{cart.discountCode ? ` (${cart.discountCode})` : ""}</span>
                <span>-{formatPrice(cart.discountAmount)}</span>
              </div>
            )}

            <CouponForm
              appliedCode={cart.discountCode}
              discountAmount={cart.discountAmount}
            />

            <p className="mt-4 text-xs text-gray-400">
              Taxes and shipping calculated at checkout
            </p>
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-sale">{formatPrice(cart.total)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded bg-brand py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 block rounded border border-gray-300 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-white"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
