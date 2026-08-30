"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, PackageX } from "lucide-react";
import GuestOrderLookupForm from "@/components/order/GuestOrderLookupForm";
import OrderSummaryCard from "@/components/order/OrderSummaryCard";
import { readGuestOrderPhone } from "@/lib/guest-checkout";
import { useTrackOrderMutation } from "@/store/orderApi";
import { toOrder, type Order } from "@/types/order";

/**
 * Confirmation for a shopper with no session.
 *
 * The order is read back from the server rather than carried through client
 * state, so a reload still shows it — the property that made client state alone
 * the wrong carrier. The phone half of the credential comes from
 * `sessionStorage` (see lib/guest-checkout.ts); putting it in the URL would
 * leak it into history, referrer headers and any shared link.
 *
 * When the phone is missing — a shared link, a new tab, cleared storage — the
 * order still exists and the shopper is one field away from it, so the lookup
 * form is offered pre-filled rather than a dead "not found".
 */
export default function GuestOrderConfirmation({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const [trackOrder] = useTrackOrderMutation();

  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<"loading" | "found" | "needs-phone" | "not-found">(
    "loading",
  );

  useEffect(() => {
    let active = true;

    // Must stay inside an effect: `sessionStorage` does not exist during the
    // server render, so resolving this any earlier would have the server and
    // the client disagree about which branch to show — a hydration mismatch.
    const phone = readGuestOrderPhone(orderNumber);
    if (!phone) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState("needs-phone");
      return;
    }

    trackOrder({ orderNumber, phone })
      .unwrap()
      .then((result) => {
        if (!active) return;
        const data = result?.data;
        if (data) {
          setOrder(toOrder(data));
          setState("found");
        } else {
          setState("not-found");
        }
      })
      .catch(() => {
        if (!active) return;
        // The stored phone did not resolve this order — let the shopper enter
        // one rather than asserting the order does not exist.
        setState("needs-phone");
      });

    return () => {
      active = false;
    };
  }, [orderNumber, trackOrder]);

  if (state === "loading") {
    return (
      <div className="container-px mx-auto flex max-w-3xl flex-col items-center gap-3 py-24 text-gray-500">
        <Loader2 size={24} className="animate-spin" />
        <p className="text-sm">Loading your order...</p>
      </div>
    );
  }

  if (state === "needs-phone") {
    return (
      <div className="container-px mx-auto max-w-md py-20">
        <div className="mb-8 text-center">
          <CheckCircle2 size={44} className="mx-auto mb-3 text-green-500" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Your order is placed
          </h1>
          <p className="text-sm text-gray-500">
            Order{" "}
            <span className="font-semibold text-gray-900">{orderNumber}</span>.
            Enter the phone number you ordered with to see the details.
          </p>
        </div>
        <GuestOrderLookupForm
          initialOrderNumber={orderNumber}
          onFound={(found) => {
            setOrder(found);
            setState("found");
          }}
          submitLabel="View order"
        />
      </div>
    );
  }

  if (state === "not-found" || !order) {
    return (
      <div className="container-px mx-auto flex max-w-2xl flex-col items-center py-24 text-center">
        <PackageX size={48} className="mb-4 text-gray-300" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          We couldn&apos;t find that order
        </h1>
        <p className="mb-8 text-gray-500">
          The link may be incorrect. You can look an order up with its number and
          the phone it was placed with.
        </p>
        <Link
          href="/track-order"
          className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
          Track an order
        </Link>
      </div>
    );
  }

  return (
    <div className="container-px mx-auto max-w-3xl py-16">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 size={52} className="mb-4 text-green-500" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Thank you for your order
        </h1>
        <p className="text-gray-500">
          Your order{" "}
          <span className="font-semibold text-gray-900">{order.orderNumber}</span>{" "}
          has been placed and is now {order.status.toLowerCase()}.
        </p>
        {/* A guest has no account to check later, so the one thing they need to
            keep is spelled out here rather than assumed. */}
        <p className="mt-3 max-w-md text-sm text-gray-500">
          Save your order number — with the phone you ordered with, you can check
          your order any time on the{" "}
          <Link href="/track-order" className="font-semibold text-brand hover:underline">
            order tracking
          </Link>{" "}
          page.
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
          href="/track-order"
          className="rounded border border-gray-300 px-6 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Track This Order
        </Link>
      </div>
    </div>
  );
}
