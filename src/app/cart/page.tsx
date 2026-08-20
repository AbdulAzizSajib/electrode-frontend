"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <div className="container-px mx-auto max-w-346 py-10">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Your Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <p className="text-gray-500">Your cart is currently empty.</p>
          <Link href="/products" className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white">
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
            {items.map((item) => (
              <div
                key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`}
                className="grid grid-cols-1 items-center gap-4 border-b border-gray-100 py-5 sm:grid-cols-[2fr_1fr_1fr_1fr]"
              >
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
                    <Image src={item.product.image} alt={item.product.title} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.product.vendor}</p>
                    <Link
                      href={`/products/${item.product.handle}`}
                      className="text-sm font-medium text-gray-900 hover:text-brand"
                    >
                      {item.product.title}
                    </Link>
                    {item.selectedOptions && (
                      <p className="mt-1 text-xs text-gray-500">
                        {Object.entries(item.selectedOptions)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </p>
                    )}
                    <button
                      onClick={() => removeItem(item.productId, item.selectedOptions)}
                      className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-sale sm:hidden"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
                <span className="text-sm text-gray-700">{formatPrice(item.product.price)}</span>
                <div className="flex items-center gap-2 rounded border border-gray-300 w-fit">
                  <button
                    className="p-2"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1, item.selectedOptions)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button
                    className="p-2"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1, item.selectedOptions)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex items-center justify-between sm:justify-end sm:gap-4">
                  <span className="text-sm font-semibold text-sale">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId, item.selectedOptions)}
                    className="hidden text-gray-400 hover:text-sale sm:block"
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit rounded-xl bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-gray-400">Taxes and shipping calculated at checkout</p>
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
              <span>Total</span>
              <span className="text-sale">{formatPrice(subtotal)}</span>
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
