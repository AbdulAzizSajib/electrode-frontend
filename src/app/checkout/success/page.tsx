import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, PackageX } from "lucide-react";
import GuestOrderConfirmation from "@/components/checkout/GuestOrderConfirmation";
import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { getOrderById } from "@/services/order";

export const metadata: Metadata = {
  title: "Order Confirmed - Electrode",
};

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const { orderId, orderNumber } = await searchParams;
  const id = typeof orderId === "string" ? orderId : undefined;
  const number = typeof orderNumber === "string" ? orderNumber : undefined;

  // A guest arrives with an order *number*, not an id: they have no session, so
  // the order is retrieved with the phone it was placed with. That phone lives
  // in sessionStorage, which only the browser can read — hence a client
  // component for this branch. Deliberately not in the URL: the backend made
  // tracking a POST to keep phone numbers out of URLs and logs.
  if (!id && number) {
    return <GuestOrderConfirmation orderNumber={number} />;
  }

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
          placed an order, you can look it up with your order number and phone.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/track-order"
            className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white"
          >
            Track an order
          </Link>
          <Link
            href="/products"
            className="rounded border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

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

      <OrderSummaryCard order={order} />

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
