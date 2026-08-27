"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import {
  CartQuantityControl,
  CartRemoveButton,
} from "@/components/cart/CartLineControls";
import { formatPrice } from "@/lib/format";
import { EMPTY_CART, useGetCartQuery } from "@/store/cartApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeCart, selectIsCartOpen } from "@/store/uiSlice";

export default function CartDrawer() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsCartOpen);

  // `skip` keeps a closed drawer from holding a subscription; the header's own
  // query still keeps the cart cached, so opening is instant.
  const { data: cart = EMPTY_CART, isError } = useGetCartQuery(undefined, {
    skip: !isOpen,
  });

  if (!isOpen) return null;

  const close = () => dispatch(closeCart());

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={close} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold uppercase">Your Cart</h2>
          <button onClick={close} aria-label="Close cart">
            <X size={22} />
          </button>
        </div>

        {isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-gray-500">
              We couldn&apos;t load your cart. Please try again.
            </p>
          </div>
        ) : cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-gray-500">Your cart is empty.</p>
            <button
              onClick={close}
              className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {cart.lines.map((line) => (
                <div key={line.id} className="flex gap-3 border-b py-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
                    <Image src={line.image} alt={line.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${line.slug}`}
                      onClick={close}
                      className="text-sm font-medium hover:text-brand"
                    >
                      {line.name}
                    </Link>
                    {line.variantName && (
                      <p className="mt-0.5 text-xs text-gray-500">{line.variantName}</p>
                    )}
                    <p className="mt-0.5 text-xs text-gray-500">
                      {formatPrice(line.unitPrice)} each
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <CartQuantityControl line={line} />
                      <CartRemoveButton line={line} />
                    </div>
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold text-sale">
                    {formatPrice(line.lineTotal)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t px-5 py-4">
              <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              {cart.discountAmount > 0 && (
                <div className="mb-1 flex items-center justify-between text-sm text-green-700">
                  <span>Discount{cart.discountCode ? ` (${cart.discountCode})` : ""}</span>
                  <span>-{formatPrice(cart.discountAmount)}</span>
                </div>
              )}
              <div className="mb-3 flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span className="text-sale">{formatPrice(cart.total)} USD</span>
              </div>
              <p className="mb-4 text-xs text-gray-500">
                Taxes and shipping calculated at checkout
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="/cart"
                  onClick={close}
                  className="rounded border border-brand py-3 text-center text-sm font-semibold text-brand hover:bg-gray-50"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={close}
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
