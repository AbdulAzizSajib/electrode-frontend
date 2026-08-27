import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, PackageX } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getOrderById } from "@/services/order";
import { formatAddress, toAddress } from "@/types/address";

export const metadata: Metadata = {
  title: "Order Confirmed - Electrode",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const { orderId } = await searchParams;
  const id = typeof orderId === "string" ? orderId : undefined;

  // Read the order back from the server rather than trusting anything passed
  // through the client, so this page survives a reload and shows what was
  // actually recorded. The endpoint is customer-scoped, so someone else's id
  // yields null rather than leaking their order.
  const order = id ? await getOrderById(id) : null;

  // Never claim an order exists when we cannot show one.
  if (!order) {
    return (
      <div className="container-px mx-auto flex max-w-2xl flex-col items-center py-24 text-center">
        <PackageX size={48} className="mb-4 text-gray-300" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          We couldn&apos;t find that order
        </h1>
        <p className="mb-8 text-gray-500">
          It may have been removed, or the link may be incorrect. If you just
          placed an order, check your email for the confirmation.
        </p>
        <Link
          href="/products"
          className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const address = order.shippingAddress ? toAddress(order.shippingAddress) : null;

  return (
    <div className="container-px mx-auto max-w-3xl py-16">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 size={52} className="mb-4 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Thank you for your order</h1>
        <p className="text-gray-500">
          Your order{" "}
          <span className="font-semibold text-gray-900">{order.orderNumber}</span>{" "}
          has been placed and is now {order.status.toLowerCase()}.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-gray-200 p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Items</h2>
        <ul className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-start justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  {item.quantity} × {formatPrice(item.unitPrice)}
                  {item.sku ? ` · ${item.sku}` : ""}
                </p>
              </div>
              <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
                {formatPrice(item.totalPrice)}
              </span>
            </li>
          ))}
        </ul>

        {/* The recorded amounts, not the pre-order estimate. */}
        <dl className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
          <div className="flex items-center justify-between text-gray-600">
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between text-green-700">
              <dt>Discount{order.couponCode ? ` (${order.couponCode})` : ""}</dt>
              <dd>-{formatPrice(order.discountAmount)}</dd>
            </div>
          )}
          <div className="flex items-center justify-between text-gray-600">
            <dt>Shipping</dt>
            <dd>{formatPrice(order.shippingAmount)}</dd>
          </div>
          <div className="flex items-center justify-between text-gray-600">
            <dt>Tax</dt>
            <dd>{formatPrice(order.taxAmount)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
            <dt>Total</dt>
            <dd className="text-sale">{formatPrice(order.totalAmount)}</dd>
          </div>
        </dl>
      </div>

      {address && (
        <div className="mt-6 rounded-xl border border-gray-200 p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            Delivering to
          </h2>
          <p className="text-sm font-medium text-gray-900">{address.fullName}</p>
          <p className="mt-0.5 text-sm text-gray-500">{address.phone}</p>
          <p className="mt-0.5 text-sm text-gray-600">{formatAddress(address)}</p>
          {order.notes && (
            <p className="mt-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Note:</span> {order.notes}
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/products"
          className="rounded bg-brand px-6 py-3 text-center text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Continue Shopping
        </Link>
        <Link
          href="/account"
          className="rounded border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Go to My Account
        </Link>
      </div>
    </div>
  );
}
