import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import CancelOrderButton from "@/components/order/CancelOrderButton";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { getCurrentUser } from "@/lib/current-user";
import { formatDate } from "@/lib/format";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";
import { getOrderById } from "@/services/order";
import { getStoreSettings } from "@/services/store-settings";
import { CUSTOMER_CANCELLABLE_STATUSES } from "@/types/order";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "account",
    fallbackTitle: "Order details",
  });
}

/**
 * One of the signed-in customer's orders, in full.
 *
 * The body is `OrderSummaryCard` — the component checkout confirmation and Track
 * Order already share — so the three views of an order cannot drift.
 *
 * Another customer's order and an order that does not exist both render the
 * same not-found page: the backend answers both with 404, `getOrderById` maps
 * both to null, and nothing here tells them apart, so order ids cannot be
 * probed. See server/openspec/changes/add-storefront-order-history.
 */
export default async function MyOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  // The proxy gates /account optimistically by decoding the token; this is the
  // check that actually confirms the session, matching the other account pages.
  if (!user) {
    redirect(`/account/login?redirect=${encodeURIComponent(`/account/orders/${id}`)}`);
  }

  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="container-px mx-auto max-w-3xl py-16">
      <Link
        href="/account/orders"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand"
      >
        <ChevronLeft size={16} />
        Back to my orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>

        {/* Always mounted so a refused cancel can still show its reason after
            the refresh hides the button — see CancelOrderButton. */}
        <CancelOrderButton
          orderId={order.id}
          orderNumber={order.orderNumber}
          cancellable={CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)}
        />
      </div>

      <OrderSummaryCard order={order} />
    </div>
  );
}
