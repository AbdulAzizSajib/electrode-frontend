import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import { getCurrentUser } from "@/lib/current-user";
import { formatDate, formatPrice } from "@/lib/format";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";
import { getMyOrders } from "@/services/order";
import { getStoreSettings } from "@/services/store-settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "account",
    fallbackTitle: "My Orders",
  });
}

/** `?page=` as a positive whole number; anything else is page 1. */
function readPage(raw: string | string[] | undefined): number {
  const page = Number(Array.isArray(raw) ? raw[0] : raw);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

/**
 * The signed-in customer's orders, newest first, ten per page.
 *
 * Server-rendered and uncached, so a reload always shows each order's real
 * status. Paging is a plain `?page=` link rather than client state, so the back
 * button and a shared URL both land on the same page.
 *
 * See server/openspec/changes/add-storefront-order-history.
 */
export default async function MyOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const page = readPage((await searchParams).page);
  const pagePath = page > 1 ? `/account/orders?page=${page}` : "/account/orders";

  const user = await getCurrentUser();

  // The proxy gates /account optimistically by decoding the token; this is the
  // check that actually confirms the session, matching the other account pages.
  if (!user) {
    redirect(`/account/login?redirect=${encodeURIComponent(pagePath)}`);
  }

  const result = await getMyOrders(page);

  // The session was valid a moment ago but the backend refused it.
  if (!result) {
    redirect(`/account/login?redirect=${encodeURIComponent(pagePath)}`);
  }

  const { orders, meta } = result;

  return (
    <div className="container-px mx-auto max-w-3xl py-16">
      <Link
        href="/account"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand"
      >
        <ChevronLeft size={16} />
        Back to account
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-gray-900">My Orders</h1>
      <p className="mb-8 text-sm text-gray-500">
        Orders you placed while signed in, newest first.
      </p>

      {orders.length === 0 ? (
        meta.total === 0 && page === 1 ? (
          /*
           * The first-time empty state names guest orders explicitly: a customer
           * who ordered before registering would otherwise read an empty history
           * as a lost order.
           */
          <div className="rounded-xl border border-gray-200 p-8 text-center">
            <p className="font-medium text-gray-900">You haven&apos;t placed an order yet.</p>
            <p className="mt-1 text-sm text-gray-500">
              Orders you place while signed in appear here. To find an order placed
              without signing in, use Track Order.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                Start shopping
              </Link>
              <Link
                href="/track-order"
                className="rounded border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:border-brand hover:text-brand"
              >
                Track Order
              </Link>
            </div>
          </div>
        ) : (
          // Past the last page — "you have no orders" would be untrue here.
          <div className="rounded-xl border border-gray-200 p-8 text-center">
            <p className="font-medium text-gray-900">No orders on this page.</p>
            <Link
              href="/account/orders"
              className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
            >
              Go to the first page
            </Link>
          </div>
        )
      ) : (
        <>
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900">#{order.orderNumber}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {formatDate(order.createdAt)} · {order.itemCount}{" "}
                      {order.itemCount === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-sm font-semibold tabular-nums text-gray-900">
                      {formatPrice(order.total)}
                    </span>
                    <ChevronRight size={16} className="text-gray-400" aria-hidden />
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {meta.totalPages > 1 && (
            <nav
              aria-label="Order history pages"
              className="mt-6 flex items-center justify-between text-sm"
            >
              {page > 1 ? (
                <Link
                  href={page === 2 ? "/account/orders" : `/account/orders?page=${page - 1}`}
                  className="rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:border-brand hover:text-brand"
                >
                  Previous
                </Link>
              ) : (
                <span />
              )}
              <span className="text-gray-500">
                Page {meta.page} of {meta.totalPages}
              </span>
              {page < meta.totalPages ? (
                <Link
                  href={`/account/orders?page=${page + 1}`}
                  className="rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:border-brand hover:text-brand"
                >
                  Next
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
