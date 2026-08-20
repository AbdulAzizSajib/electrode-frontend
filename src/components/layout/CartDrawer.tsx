"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/format";

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold uppercase">Your Cart</h2>
          <button onClick={closeCart} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-gray-500">Your cart is empty.</p>
            <button
              onClick={closeCart}
              className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${JSON.stringify(item.selectedOptions)}`}
                  className="flex gap-3 border-b py-4"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
                    <Image src={item.product.image} alt={item.product.title} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="text-xs text-gray-500">{item.product.vendor}</p>
                    <Link href={`/products/${item.product.handle}`} className="text-sm font-medium hover:text-brand">
                      {item.product.title}
                    </Link>
                    {item.selectedOptions && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {Object.entries(item.selectedOptions)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </p>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded border border-gray-300">
                        <button
                          className="p-1.5"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.selectedOptions)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-4 text-center text-sm">{item.quantity}</span>
                        <button
                          className="p-1.5"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.selectedOptions)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.selectedOptions)}
                        className="text-gray-400 hover:text-sale"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold text-sale">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t px-5 py-4">
              <div className="mb-3 flex items-center justify-between text-base font-semibold">
                <span>Subtotal</span>
                <span className="text-sale">{formatPrice(subtotal)} USD</span>
              </div>
              <p className="mb-4 text-xs text-gray-500">Taxes and shipping calculated at checkout</p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="rounded border border-brand py-3 text-center text-sm font-semibold text-brand hover:bg-gray-50"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="rounded bg-brand py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  Check Out
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
