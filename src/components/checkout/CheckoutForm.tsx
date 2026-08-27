"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, Plus, Truck } from "lucide-react";
import clsx from "clsx";
import AddressForm from "@/components/account/AddressForm";
import { formatPrice, roundMoney } from "@/lib/format";
import { useGetAddressesQuery } from "@/store/addressApi";
import { EMPTY_CART, useGetCartQuery } from "@/store/cartApi";
import { usePlaceOrderMutation } from "@/store/orderApi";
import { formatAddress, type Address } from "@/types/address";
import type { CartSummary } from "@/types/cart";
import type { ShippingMethod } from "@/types/order";

/**
 * Surfaces the backend's own message — e.g. an out-of-stock line naming the
 * item, or the proxy's 504 copy when a checkout's outcome is unknown.
 */
function errorMessage(error: unknown): string {
  const data = (error as { data?: { message?: unknown } } | undefined)?.data;
  return typeof data?.message === "string"
    ? data.message
    : "We couldn't place your order. Please try again.";
}

/** A 504 from the proxy means the outcome is unknown, not that it failed. */
function isIndeterminate(error: unknown): boolean {
  return (error as { status?: number } | undefined)?.status === 504;
}

export default function CheckoutForm({
  shippingMethods,
  initialAddresses,
  initialCart,
}: {
  shippingMethods: ShippingMethod[];
  initialAddresses: Address[];
  /** Server-read cart, so an empty cart renders immediately without a spinner. */
  initialCart: CartSummary | null;
}) {
  const router = useRouter();
  const { data, isLoading } = useGetCartQuery();

  // Prefer live data once it arrives; fall back to what the server read.
  const cart = data ?? initialCart ?? EMPTY_CART;
  // Only truly "loading" when the server had nothing to show either.
  const cartLoading = isLoading && !initialCart;
  // Server-rendered addresses seed the list; the query keeps it live after an
  // inline add, so the new address appears without a reload.
  const { data: addresses = initialAddresses } = useGetAddressesQuery();
  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();

  const [addressId, setAddressId] = useState<string | null>(
    initialAddresses.find((a) => a.isDefault)?.id ?? initialAddresses[0]?.id ?? null,
  );
  const [shippingMethodId, setShippingMethodId] = useState<string | null>(
    shippingMethods[0]?.id ?? null,
  );
  const [notes, setNotes] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [error, setError] = useState("");
  // Distinct from `error`: the order may actually have been placed, so the
  // shopper is pointed at their orders rather than nudged to try again.
  const [indeterminate, setIndeterminate] = useState(false);

  // One key per checkout *attempt*. Pressing Place Order again after a failure
  // deliberately reuses it — that is what lets the server recognise the retry
  // and hand back the order it already placed instead of placing a second one.
  // It is regenerated only when the order itself changes, below.
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  // What makes this a materially different order. Notes are excluded: editing
  // them after an unconfirmed attempt should not turn a retry into a duplicate.
  const orderFingerprint = [
    addressId,
    shippingMethodId,
    cart.lines
      .map((l) => `${l.id}:${l.quantity}`)
      .sort()
      .join(","),
  ].join("|");
  const lastFingerprint = useRef(orderFingerprint);

  useEffect(() => {
    if (lastFingerprint.current === orderFingerprint) return;
    lastFingerprint.current = orderFingerprint;
    setIdempotencyKey(crypto.randomUUID());
  }, [orderFingerprint]);

  // Keep a selection once addresses load or the shopper adds their first one.
  useEffect(() => {
    if (addressId && addresses.some((a) => a.id === addressId)) return;
    const next = addresses.find((a) => a.isDefault) ?? addresses[0];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (next) setAddressId(next.id);
  }, [addresses, addressId]);

  const selectedShipping =
    shippingMethods.find((m) => m.id === shippingMethodId) ?? null;

  // An ESTIMATE only. The server applies tax and any free-shipping threshold
  // from settings the storefront cannot read, so this is deliberately not
  // presented as the amount payable.
  const estimatedTotal = roundMoney(
    cart.total + (selectedShipping?.price ?? 0),
  );

  const canOrder = Boolean(addressId && shippingMethodId) && cart.lines.length > 0;

  async function handlePlaceOrder(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIndeterminate(false);
    // The address form renders inside this one, so Enter in one of its inputs
    // reaches here. Placing an order mid-edit is never what was meant.
    if (isAddingAddress) return;
    if (!addressId || !shippingMethodId) return;

    try {
      const result = await placeOrder({
        shippingAddressId: addressId,
        shippingMethodId,
        notes: notes.trim() || undefined,
        idempotencyKey,
      }).unwrap();

      const orderId = result?.data?.id;
      router.push(
        orderId ? `/checkout/success?orderId=${orderId}` : "/checkout/success",
      );
    } catch (err) {
      // Selections stay in state and the cart is untouched, so the shopper can
      // fix the problem (e.g. reduce a quantity) and try again. On a 504 the
      // cart is refetched instead (see orderApi) because the order may have
      // committed — and the key is deliberately NOT regenerated, so pressing
      // Place Order again resolves to that order rather than duplicating it.
      setError(errorMessage(err));
      if (isIndeterminate(err)) {
        setIndeterminate(true);
      }
    }
  }

  if (cartLoading) {
    return (
      <div className="container-px mx-auto flex max-w-6xl justify-center py-20 text-gray-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="container-px mx-auto max-w-3xl py-20 text-center">
        <h1 className="mb-3 text-2xl font-bold text-gray-900">Your cart is empty</h1>
        <p className="mb-6 text-gray-500">Add some products before checking out.</p>
        <Link
          href="/products"
          className="rounded bg-brand px-6 py-3 text-sm font-semibold text-white"
        >
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
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Delivery address
            </h2>

            {isAddingAddress ? (
              <div className="rounded-xl border border-gray-200 p-5">
                <AddressForm
                  // This sits inside the checkout's own <form>; a nested
                  // <form> tag would be dropped by the parser, leaving Save
                  // address submitting the checkout instead.
                  asForm={false}
                  defaultToDefault={addresses.length === 0}
                  onSaved={(saved) => {
                    setIsAddingAddress(false);
                    if (saved.id) setAddressId(saved.id);
                  }}
                  onCancel={() => setIsAddingAddress(false)}
                />
              </div>
            ) : addresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center">
                <p className="mb-4 text-sm text-gray-500">
                  You need a delivery address before you can order.
                </p>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  Add an address
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={clsx(
                      "flex cursor-pointer gap-3 rounded-xl border p-4 transition-colors",
                      addressId === address.id
                        ? "border-brand bg-brand/5"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={addressId === address.id}
                      onChange={() => setAddressId(address.id)}
                      className="mt-1 accent-brand"
                    />
                    <span className="text-sm">
                      <span className="font-medium text-gray-900">
                        {address.fullName}
                      </span>
                      {address.isDefault && (
                        <span className="ml-2 rounded bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                          Default
                        </span>
                      )}
                      <span className="mt-0.5 block text-gray-500">
                        {address.phone}
                      </span>
                      <span className="mt-0.5 block text-gray-600">
                        {formatAddress(address)}
                      </span>
                    </span>
                  </label>
                ))}
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(true)}
                  className="flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                >
                  <Plus size={15} /> Use a different address
                </button>
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Shipping method
            </h2>
            {shippingMethods.length === 0 ? (
              <p className="rounded border border-gray-200 p-4 text-sm text-gray-500">
                No shipping methods are available right now. Please try again
                shortly.
              </p>
            ) : (
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <label
                    key={method.id}
                    className={clsx(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                      shippingMethodId === method.id
                        ? "border-brand bg-brand/5"
                        : "border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethodId === method.id}
                      onChange={() => setShippingMethodId(method.id)}
                      className="accent-brand"
                    />
                    <Truck size={18} className="shrink-0 text-gray-400" />
                    <span className="flex-1 text-sm">
                      <span className="font-medium text-gray-900">
                        {method.name}
                      </span>
                      {method.estimatedDays !== undefined && (
                        <span className="mt-0.5 block text-gray-500">
                          Estimated delivery in {method.estimatedDays}{" "}
                          {method.estimatedDays === 1 ? "day" : "days"}
                        </span>
                      )}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(method.price)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Order note <span className="text-sm font-normal text-gray-400">(optional)</span>
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="e.g. Please call before delivery"
              className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand"
            />
          </section>

          {error && (
            <div
              role="alert"
              className={clsx(
                "flex items-start gap-2 rounded border px-4 py-3 text-sm",
                indeterminate
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                {error}
                {indeterminate && (
                  <>
                    {" "}
                    <Link href="/track-order" className="font-semibold underline">
                      Check your orders
                    </Link>
                    .
                  </>
                )}
              </span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={!canOrder || placing}
              className="flex w-full items-center justify-center gap-2 rounded bg-brand py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {placing && <Loader2 size={16} className="animate-spin" />}
              {placing ? "Placing order..." : "Place Order"}
            </button>
            {!canOrder && (
              <p className="mt-2 text-center text-xs text-gray-500">
                {!addressId
                  ? "Choose a delivery address to continue."
                  : "Choose a shipping method to continue."}
              </p>
            )}
          </div>
        </form>

        <div className="h-fit rounded-xl bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
          <div className="max-h-72 space-y-4 overflow-y-auto pr-1">
            {cart.lines.map((line) => (
              <div key={line.id} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-white">
                  <Image src={line.image} alt={line.name} fill className="object-cover" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-[10px] font-bold text-white">
                    {line.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm text-gray-800">{line.name}</p>
                  {line.variantName && (
                    <p className="text-xs text-gray-500">{line.variantName}</p>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {formatPrice(line.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 border-t border-gray-200 pt-4 text-sm">
            <div className="flex items-center justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            {cart.discountAmount > 0 && (
              <div className="flex items-center justify-between text-green-700">
                <span>Discount{cart.discountCode ? ` (${cart.discountCode})` : ""}</span>
                <span>-{formatPrice(cart.discountAmount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {selectedShipping ? formatPrice(selectedShipping.price) : "—"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
            <span>Estimated total</span>
            <span className="text-sale">{formatPrice(estimatedTotal)}</span>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            An estimate. Tax and any free-shipping discount are applied by the
            store when your order is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}
