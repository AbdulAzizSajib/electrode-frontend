"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, BadgeCheck, Loader2, Plus, Store, Truck } from "lucide-react";
import clsx from "clsx";
import AddressForm from "@/components/account/AddressForm";
import { Field } from "@/components/account/form-controls";
import { formatPrice, roundMoney } from "@/lib/format";
import {
  clearDirectOrderIntent,
  readDirectOrderIntent,
  saveGuestOrderContact,
  type DirectOrderIntent,
} from "@/lib/guest-checkout";
import { isBdPhone, normalizeBdPhone } from "@/lib/validation";
import { useGetAddressesQuery } from "@/store/addressApi";
import { EMPTY_CART, useGetCartQuery } from "@/store/cartApi";
import { usePlaceOrderMutation, useQuoteCheckoutQuery } from "@/store/orderApi";
import { formatAddress, type Address } from "@/types/address";
import type { CartLine, CartSummary } from "@/types/cart";
import type { PlaceOrderPayload } from "@/types/order";
import type {
  CheckoutConfig,
  CheckoutFieldKey,
  DeliveryOption,
} from "@/types/store-settings";
import CouponForm from "@/components/cart/CouponForm";

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

/** The guest's contact and delivery details, none of which they have saved. */
const EMPTY_GUEST_DETAILS = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  postalCode: "",
};

type GuestDetails = typeof EMPTY_GUEST_DETAILS;

export default function CheckoutForm({
  isSignedIn,
  initialAddresses,
  initialCart,
  checkout,
}: {
  /** Decides which delivery section renders — saved addresses, or inline fields. */
  isSignedIn: boolean;
  initialAddresses: Address[];
  /** Server-read cart, so an empty cart renders immediately without a spinner. */
  initialCart: CartSummary | null;
  /**
   * What the merchant has configured checkout to ask for. The API applies the
   * same configuration when the order is submitted, so this decides what is
   * rendered, not what is ultimately allowed.
   */
  checkout: CheckoutConfig;
}) {
  const fields = checkout.fields;

  /** A guest field is only collected when the merchant shows it. */
  const shows = (key: CheckoutFieldKey) => fields[key].show;

  /**
   * What to send for a guest field: its trimmed value, or `undefined` when the
   * merchant is not collecting it or the shopper left it blank.
   */
  const collected = (key: CheckoutFieldKey & keyof GuestDetails) =>
    (shows(key) && guest[key].trim()) || undefined;

  /** Marks a field's label when it is shown but not mandatory. */
  const optionalSuffix = (key: CheckoutFieldKey) =>
    fields[key].required ? "" : " (optional)";
  const router = useRouter();
  const { data, isLoading } = useGetCartQuery();

  // Prefer live data once it arrives; fall back to what the server read.
  const cart = data ?? initialCart ?? EMPTY_CART;
  // Only truly "loading" when the server had nothing to show either.
  const cartLoading = isLoading && !initialCart;
  // Server-rendered addresses seed the list; the query keeps it live after an
  // inline add, so the new address appears without a reload.
  const { data: addresses = initialAddresses } = useGetAddressesQuery(undefined, {
    // The endpoint is session-scoped and 401s for a guest; asking would be a
    // guaranteed failed request on every guest checkout.
    skip: !isSignedIn,
  });
  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();

  const [guest, setGuest] = useState<GuestDetails>(EMPTY_GUEST_DETAILS);
  const [guestErrors, setGuestErrors] = useState<Partial<Record<keyof GuestDetails, string>>>({});

  /**
   * A "buy this one product" handoff from a product page. Read once on mount:
   * `sessionStorage` is unavailable during the server render, so reading it
   * inline would desync the two.
   *
   * Storage is cleared as soon as it is read, while the intent lives on in
   * component state for this visit. Otherwise a shopper who navigates away
   * without ordering leaves it behind, and their next trip to checkout silently
   * buys the old product instead of their cart.
   */
  const [directOrder, setDirectOrder] = useState<DirectOrderIntent | null>(null);
  useEffect(() => {
    const intent = readDirectOrderIntent();
    if (!intent) return;
    // Storage is not readable during the server render, so this genuinely
    // cannot be lifted out of an effect without breaking hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDirectOrder(intent);
    clearDirectOrderIntent();
  }, []);

  const updateGuest = (name: keyof GuestDetails, value: string) => {
    setGuest((prev) => ({ ...prev, [name]: value }));
    setGuestErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const [addressId, setAddressId] = useState<string | null>(
    initialAddresses.find((a) => a.isDefault)?.id ?? initialAddresses[0]?.id ?? null,
  );
  const [notes, setNotes] = useState("");

  /*
   * The delivery options the merchant configured, split by kind.
   *
   * Pickup points are dropped entirely when collection is switched off — the
   * merchant keeps them configured for later, but a shopper must not be able to
   * choose one, and the server refuses them in that state anyway.
   */
  const deliveryOptions = checkout.delivery.options;
  const deliveryAreas = deliveryOptions.filter((o) => o.kind === "DELIVERY");
  const pickupPoints = checkout.delivery.offersPickup
    ? deliveryOptions.filter((o) => o.kind === "PICKUP")
    : [];
  // The first step exists only when there is a genuine choice to make between
  // the two. Configured-but-not-offered pickup shows no step at all.
  const offersCollection = pickupPoints.length > 0;

  /*
   * Whether the shopper is collecting. Only ever true when collection is
   * actually on offer, so a merchant switching it off cannot leave a shopper
   * mid-checkout holding a choice the server will refuse.
   */
  const [collectInPerson, setCollectInPerson] = useState(false);
  const collecting = collectInPerson && offersCollection;
  const shownOptions = collecting ? pickupPoints : deliveryAreas;

  /*
   * Which option the shopper picked, by key.
   *
   * Null until they choose — with one exception: a single option is not a
   * choice, so it is selected for them below. Holding the KEY rather than the
   * option means a merchant edit between page load and submit surfaces as "that
   * option no longer exists" rather than as a stale price.
   */
  const [deliveryOptionKey, setDeliveryOptionKey] = useState<string | null>(null);

  const selectedOption: DeliveryOption | null =
    shownOptions.find((o) => o.key === deliveryOptionKey) ?? null;

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [error, setError] = useState("");
  // Distinct from `error`: the order may actually have been placed, so the
  // shopper is pointed at their orders rather than nudged to try again.
  const [indeterminate, setIndeterminate] = useState(false);
  // Latches once the order commits. Placing an order empties the cart cache
  // immediately (see orderApi), but the push to /checkout/success is async — so
  // without this the shopper is shown "Your cart is empty" for the frames in
  // between, which reads as the order having been lost.
  const [placed, setPlaced] = useState(false);

  // One key per checkout *attempt*. Pressing Place Order again after a failure
  // deliberately reuses it — that is what lets the server recognise the retry
  // and hand back the order it already placed instead of placing a second one.
  // It is regenerated only when the order itself changes, below.
  const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());

  // A direct order is bought on its own; the cart is neither read nor emptied.
  // Rendered from the intent's `display` fields, since the product API is keyed
  // by slug and checkout only has an id.
  const displayLines: CartLine[] = directOrder
    ? [
        {
          id: "direct",
          productId: directOrder.item.productId,
          variantId: directOrder.item.variantId ?? null,
          quantity: directOrder.item.quantity,
          name: directOrder.display.name,
          slug: "",
          variantName: directOrder.display.variantName,
          image: directOrder.display.image,
          unitPrice: directOrder.display.unitPrice,
          lineTotal: directOrder.display.unitPrice * directOrder.item.quantity,
          stockQuantity: 0,
        },
      ]
    : cart.lines;

  const displaySubtotal = directOrder
    ? displayLines[0].lineTotal
    : cart.subtotal;
  const displayDiscount = directOrder ? 0 : cart.discountAmount;
  const displayTotal = directOrder ? displayLines[0].lineTotal : cart.total;

  // What makes this a materially different order. Notes are excluded: editing
  // them after an unconfirmed attempt should not turn a retry into a duplicate.
  // The guest's own details are included for the same reason the address id is:
  // changing where an order ships makes it a different order, and reusing the
  // key would hand back the one already placed to the old address.
  const orderFingerprint = [
    addressId,
    // The delivery choice is priced, so changing it makes this a different
    // order — it must not reuse the previous attempt's key and be handed back
    // the order already placed at the old price.
    deliveryOptionKey ?? "",
    isSignedIn
      ? ""
      : [
          guest.fullName,
          guest.phone,
          guest.addressLine1,
          guest.addressLine2,
          guest.city,
          guest.postalCode,
        ].join("~"),
    displayLines
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

  /*
   * Keep the delivery selection valid for the list currently on show.
   *
   * Runs when the shopper switches between delivery and collection — the two
   * lists are disjoint, so the previous key never survives the switch — and when
   * settings are re-read after a stale-option refusal.
   *
   * A single option is auto-selected because it is not a choice: making the
   * shopper tick the only box adds a step and nothing else. Anything more is
   * left unselected, so the option they order under is one they actually picked.
   */
  useEffect(() => {
    if (deliveryOptionKey && shownOptions.some((o) => o.key === deliveryOptionKey)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeliveryOptionKey(shownOptions.length === 1 ? shownOptions[0].key : null);
  }, [shownOptions, deliveryOptionKey]);

  const hasLines = displayLines.length > 0;

  /*
   * The server's own arithmetic for this basket, for the option chosen.
   *
   * Asking the server is what makes the number shown here the number charged.
   * The option's price is public and the storefront could add it up itself, but
   * tax, the coupon and the free-delivery threshold are all server-side — so the
   * total still has to come from one place, and it is this one.
   *
   * Keyed on the option, and NOT on the address: the address no longer changes
   * any price, which is the point of the change. Skipped until the shopper has
   * chosen, because there is no delivery charge to quote before then.
   */
  const {
    data: quoteResponse,
    isFetching: quoting,
    error: quoteError,
  } = useQuoteCheckoutQuery(
    {
      deliveryOptionKey: deliveryOptionKey ?? "",
      items: directOrder ? [directOrder.item] : undefined,
    },
    { skip: !hasLines || !deliveryOptionKey },
  );

  const quote = quoteResponse?.data ?? null;

  /*
   * The server's refusal, verbatim. Three distinct situations reach here and
   * each needs its own message rather than one catch-all: the store has no
   * options configured at all, the chosen option has since been deleted, or a
   * pickup point was submitted while collection is off.
   */
  const quoteRefusal =
    (quoteError as { data?: { message?: string } } | undefined)?.data?.message ?? null;

  // A store that has configured nothing cannot take an order at all, and says so
  // rather than quietly charging nothing for delivery.
  const deliveryUnconfigured = deliveryOptions.length === 0;

  const shippingCharge = quote?.shippingAmount ?? selectedOption?.price ?? 0;
  const payableTotal = quote ? roundMoney(quote.totalAmount) : roundMoney(displayTotal);

  /*
   * A delivery option must be chosen — the server refuses an order without one,
   * and letting the shopper press the button only to be told no is worse than
   * telling them now. A signed-in shopper additionally needs a saved address,
   * unless they are collecting, in which case there is nothing to deliver to.
   */
  const needsAddress = !collecting;
  const canOrder =
    !quoteRefusal &&
    !deliveryUnconfigured &&
    Boolean(deliveryOptionKey) &&
    hasLines &&
    (isSignedIn ? Boolean(addressId) || !needsAddress : true);

  /*
   * A refusal naming a stale option is recoverable, and recovering means
   * re-reading the settings this page was rendered with.
   *
   * `router.refresh()` re-runs the server component, which re-fetches the store
   * settings and hands down a fresh option list; the selection effect above then
   * drops the key that no longer exists and asks the shopper to choose again.
   * There is no client settings endpoint to re-read instead — the options arrive
   * as a server-rendered prop.
   */
  const staleOption = Boolean(
    quoteRefusal && /no longer available|choose again/i.test(quoteRefusal),
  );
  const refreshedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!staleOption || !deliveryOptionKey) return;
    // Once per offending key: refreshing on every render of the same refusal
    // would loop, since the refusal survives until the shopper picks again.
    if (refreshedFor.current === deliveryOptionKey) return;
    refreshedFor.current = deliveryOptionKey;
    router.refresh();
  }, [staleOption, deliveryOptionKey, router]);

  /**
   * Guest-only. Mirrors what the API requires, no stricter — and now that "what
   * the API requires" is a merchant setting, this reads the same configuration
   * the server validates against rather than a hardcoded list of its own.
   */
  function validateGuest(): boolean {
    const errors: Partial<Record<keyof GuestDetails, string>> = {};

    const requireField = (key: CheckoutFieldKey & keyof GuestDetails, message: string) => {
      // A hidden field is never required — the merchant is not collecting it.
      if (fields[key].show && fields[key].required && !guest[key].trim()) {
        errors[key] = message;
      }
    };

    requireField("fullName", "Your name is required.");
    requireField("phone", "Phone number is required.");
    // The address is not asked for at all when the shopper is collecting, so it
    // cannot be required either — the same rule the server applies in
    // `collectMissingCheckoutFields`, applied here so the two agree.
    if (!collecting) {
      requireField("addressLine1", "Address is required.");
      requireField("addressLine2", "This field is required.");
      requireField("city", "City is required.");
      requireField("postalCode", "Postal code is required.");
    }

    // Format is checked independently of whether the field is mandatory: a
    // phone number that IS given must still be a real one.
    if (fields.phone.show && guest.phone.trim() && !isBdPhone(guest.phone)) {
      errors.phone = "Enter a valid Bangladeshi mobile number.";
    }

    setGuestErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handlePlaceOrder(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setIndeterminate(false);
    // The address form renders inside this one, so Enter in one of its inputs
    // reaches here. Placing an order mid-edit is never what was meant.
    if (isAddingAddress) return;
    // No address is needed to collect in person, so it only gates a delivery.
    if (isSignedIn && needsAddress && !addressId) return;
    if (!isSignedIn && !validateGuest()) return;
    // The server refuses an order without one; this is the same refusal, said
    // before the request rather than after.
    if (!deliveryOptionKey) return;

    // Normalized so the phone stored against the order matches what the
    // confirmation will send back to look it up.
    const normalizedPhone = normalizeBdPhone(guest.phone) ?? guest.phone.trim();

    const payload: PlaceOrderPayload = isSignedIn
      ? {
          mode: "account",
          shippingAddressId: addressId as string,
          // The same key the quote was priced against, so the amount shown and
          // the amount charged come from one choice. Whether this is a delivery
          // or a collection is the option's own property, not a claim the client
          // makes alongside it.
          deliveryOptionKey,
          notes: notes.trim() || undefined,
          idempotencyKey,
        }
      : {
          mode: "guest",
          deliveryOptionKey,
          /*
           * A field the merchant is not collecting is sent as `undefined`, not
           * as an empty string — the server treats absent and blank alike, but
           * sending "" would record an empty value on the order's address as
           * though the shopper had been asked and left it blank.
           *
           * The whole address goes unsent when collecting: there is nothing to
           * deliver to, and the server stops requiring it for the same reason.
           */
          fullName: collected("fullName"),
          phone: normalizedPhone,
          shippingAddress: collecting
            ? {}
            : {
                addressLine1: collected("addressLine1"),
                addressLine2: collected("addressLine2"),
                city: collected("city"),
                postalCode: collected("postalCode"),
              },
          // Present only for a direct product order; otherwise the cart is used.
          items: directOrder ? [directOrder.item] : undefined,
          paymentMethod: "COD",
          notes: notes.trim() || undefined,
          idempotencyKey,
        };

    try {
      const result = await placeOrder(payload).unwrap();

      setPlaced(true);
      // The handoff is spent either way — leaving it would re-apply the same
      // direct order to the shopper's next visit to checkout.
      clearDirectOrderIntent();

      const orderNumber = result?.data?.orderNumber;
      if (!isSignedIn && orderNumber) {
        // A guest has no session to look this order up with later, so the pair
        // that authorises the read is kept for the confirmation page.
        saveGuestOrderContact({ orderNumber, phone: normalizedPhone });
        router.push(
          `/checkout/success?orderNumber=${encodeURIComponent(orderNumber)}`,
        );
        return;
      }

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

  // The order is in, we're just waiting on the navigation. Hold a confirming
  // state rather than the checkout — or, worse, the empty-cart message.
  if (placed) {
    return (
      <div className="container-px mx-auto flex max-w-6xl flex-col items-center gap-3 py-20 text-gray-500">
        <Loader2 size={24} className="animate-spin" />
        <p className="text-sm">Confirming your order...</p>
      </div>
    );
  }

  // A direct product order carries its own line, so neither the cart's loading
  // state nor its emptiness has any bearing on whether it can be placed.
  if (!directOrder && cartLoading) {
    return (
      <div className="container-px mx-auto flex max-w-6xl justify-center py-20 text-gray-400">
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  if (!directOrder && cart.lines.length === 0) {
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
          {/* Hidden entirely when collecting — there is nothing to deliver to,
              and the fields' required rules are dropped with them. Switching
              back to a delivery area restores both. */}
          {needsAddress && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Delivery address
            </h2>

            {!isSignedIn ? (
              /* A guest has nothing saved, so the details are typed in here.
                 Signing in is offered but never required — an extra step at
                 this moment is what loses the order. */
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link
                    href="/account/login?redirect=/checkout"
                    className="font-semibold text-brand hover:underline"
                  >
                    Sign in
                  </Link>{" "}
                  to use your saved addresses.
                </p>

                {/* Each field renders only if the merchant collects it, and
                    says so in its label when it is not mandatory. */}
                {shows("fullName") && (
                  <Field
                    label={`Full name${optionalSuffix("fullName")}`}
                    name="fullName"
                    value={guest.fullName}
                    onChange={(e) => updateGuest("fullName", e.target.value)}
                    error={guestErrors.fullName}
                    placeholder="e.g. Rahim Uddin"
                    autoComplete="name"
                  />
                )}
                {shows("phone") && (
                  <Field
                    label={`Phone number${optionalSuffix("phone")}`}
                    name="phone"
                    value={guest.phone}
                    onChange={(e) => updateGuest("phone", e.target.value)}
                    error={guestErrors.phone}
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                )}
                {shows("addressLine1") && (
                  <Field
                    label={`Address${optionalSuffix("addressLine1")}`}
                    name="addressLine1"
                    value={guest.addressLine1}
                    onChange={(e) => updateGuest("addressLine1", e.target.value)}
                    error={guestErrors.addressLine1}
                    placeholder="House, road, area"
                    autoComplete="address-line1"
                  />
                )}
                {shows("addressLine2") && (
                  <Field
                    label={`Apartment, floor${optionalSuffix("addressLine2")}`}
                    name="addressLine2"
                    value={guest.addressLine2}
                    onChange={(e) => updateGuest("addressLine2", e.target.value)}
                    error={guestErrors.addressLine2}
                    autoComplete="address-line2"
                  />
                )}
                {(shows("city") || shows("postalCode")) && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {shows("city") && (
                      <Field
                        label={`City${optionalSuffix("city")}`}
                        name="city"
                        value={guest.city}
                        onChange={(e) => updateGuest("city", e.target.value)}
                        error={guestErrors.city}
                        placeholder="e.g. Dhaka"
                        autoComplete="address-level2"
                      />
                    )}
                    {shows("postalCode") && (
                      <Field
                        label={`Postal code${optionalSuffix("postalCode")}`}
                        name="postalCode"
                        value={guest.postalCode}
                        onChange={(e) => updateGuest("postalCode", e.target.value)}
                        error={guestErrors.postalCode}
                        autoComplete="postal-code"
                        inputMode="numeric"
                      />
                    )}
                  </div>
                )}
              </div>
            ) : isAddingAddress ? (
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
          )}

          <section>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Delivery
            </h2>

            {/* A store that has configured no options cannot take an order at
                all. Said as the setup problem it is, rather than blamed on
                anything the shopper typed. */}
            {deliveryUnconfigured ? (
              <div
                role="alert"
                className="flex items-start gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>
                  Delivery has not been set up for this store yet, so orders
                  cannot be placed. Please contact the store.
                </span>
              </div>
            ) : (
              <>
                {/* The server's refusal, verbatim — a deleted option, or a
                    pickup submitted after collection was switched off. */}
                {quoteRefusal && (
                  <div
                    role="alert"
                    className="mb-4 flex items-start gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    <AlertCircle size={16} className="mt-0.5 shrink-0" />
                    <span>{quoteRefusal}</span>
                  </div>
                )}

                {/* Step one, and ONLY when there is a real choice between the
                    two. With collection off, the shopper goes straight to the
                    delivery areas and never sees this. */}
                {offersCollection && (
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setCollectInPerson(false)}
                      className={clsx(
                        "flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                        !collecting
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-gray-200 text-gray-600 hover:border-gray-300",
                      )}
                    >
                      <Truck size={16} /> Deliver to me
                    </button>
                    <button
                      type="button"
                      onClick={() => setCollectInPerson(true)}
                      className={clsx(
                        "flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                        collecting
                          ? "border-brand bg-brand/5 text-brand"
                          : "border-gray-200 text-gray-600 hover:border-gray-300",
                      )}
                    >
                      <Store size={16} /> Collect in person
                    </button>
                  </div>
                )}

                {/* Step two: the matching list. Chosen by the shopper, never
                    matched to their address — which is the whole change. */}
                {shownOptions.length === 0 ? (
                  <p className="rounded border border-gray-200 p-4 text-sm text-gray-500">
                    {collecting
                      ? "No pickup points are available at the moment."
                      : "No delivery areas are available at the moment."}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {shownOptions.map((option) => (
                      <label
                        key={option.key}
                        className={clsx(
                          "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                          deliveryOptionKey === option.key
                            ? "border-brand bg-brand/5"
                            : "border-gray-200 hover:border-gray-300",
                        )}
                      >
                        <input
                          type="radio"
                          name="deliveryOption"
                          checked={deliveryOptionKey === option.key}
                          onChange={() => setDeliveryOptionKey(option.key)}
                          className="accent-brand"
                        />
                        <span className="flex-1 text-sm">
                          <span className="font-medium text-gray-900">{option.label}</span>
                          {option.days > 0 && (
                            <span className="mt-0.5 block text-gray-500">
                              {collecting ? "Ready in" : "Estimated delivery in"}{" "}
                              {option.days} {option.days === 1 ? "day" : "days"}
                            </span>
                          )}
                        </span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatPrice(option.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {!deliveryOptionKey && shownOptions.length > 1 && (
                  <p className="mt-3 text-sm text-gray-500">
                    Choose an option to see your total.
                  </p>
                )}
              </>
            )}
          </section>

          {!isSignedIn && (
            <section>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment</h2>
              <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                <BadgeCheck size={18} className="mt-0.5 shrink-0 text-green-600" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Cash on delivery</p>
                  <p className="mt-0.5 text-gray-500">
                    Pay in cash when your order arrives. No advance payment is
                    needed.
                  </p>
                </div>
              </div>
            </section>
          )}

          {checkout.showOrderNote && (
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
          )}

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
            {/* Merchant-authored, and rendered only when there is something to
                say — an empty notice must leave no container or spacing behind. */}
            {checkout.notice.trim() && (
              <p className="mb-4 rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {checkout.notice.trim()}
              </p>
            )}
            <button
              type="submit"
              disabled={!canOrder || placing}
              className="flex w-full items-center justify-center gap-2 rounded bg-brand py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {placing && <Loader2 size={16} className="animate-spin" />}
              {placing ? "Placing order..." : "Place Order"}
            </button>
            {!canOrder && !deliveryUnconfigured && (
              <p className="mt-2 text-center text-xs text-gray-500">
                {isSignedIn && needsAddress && !addressId
                  ? "Choose a delivery address to continue."
                  : !deliveryOptionKey
                    ? "Choose a delivery option to continue."
                    : "Please fix the problem above to continue."}
              </p>
            )}
          </div>
        </form>

        <div className="h-fit rounded-xl bg-gray-50 p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
          {directOrder && (
            <p className="mb-4 rounded bg-white px-3 py-2 text-xs text-gray-500">
              Buying this item directly. Your cart is untouched.
            </p>
          )}
          <div className="max-h-72 space-y-4 overflow-y-auto pr-1" data-lenis-prevent>
            {displayLines.map((line) => (
              <div key={line.id} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-white">
                  {line.image && (
                    <Image src={line.image} alt={line.name} fill className="object-cover" />
                  )}
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
              <span>{formatPrice(quote?.subtotal ?? displaySubtotal)}</span>
            </div>
            {(quote?.discountAmount ?? displayDiscount) > 0 && (
              <div className="flex items-center justify-between text-green-700">
                <span>Discount{cart.discountCode ? ` (${cart.discountCode})` : ""}</span>
                <span>-{formatPrice(quote?.discountAmount ?? displayDiscount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-gray-600">
              {/* Names the option the shopper chose, so the line they are about
                  to be charged is the one they picked rather than a generic
                  "Delivery" they have to map back onto a choice. */}
              <span>
                {selectedOption?.label ?? (collecting ? "Collection" : "Delivery")}
              </span>
              <span>
                {quoteRefusal ? (
                  <span className="text-red-600">Unavailable</span>
                ) : quote ? (
                  // A waived delivery charge says so, and says what it would
                  // have cost — "Free" alone hides the saving.
                  !collecting && quote.shippingAmount === 0 && quote.shippingBeforeWaiver > 0 ? (
                    <span className="text-green-700">
                      Free{" "}
                      <span className="text-gray-400 line-through">
                        {formatPrice(quote.shippingBeforeWaiver)}
                      </span>
                    </span>
                  ) : (
                    formatPrice(shippingCharge)
                  )
                ) : (
                  "—"
                )}
              </span>
            </div>
            {quote && quote.taxAmount > 0 && (
              <div className="flex items-center justify-between text-gray-600">
                <span>Tax</span>
                <span>{formatPrice(quote.taxAmount)}</span>
              </div>
            )}
            {!collecting && quote?.deliveryDays != null && quote.deliveryDays > 0 && (
              <p className="text-xs text-gray-400">
                Arrives in about {quote.deliveryDays}{" "}
                {quote.deliveryDays === 1 ? "day" : "days"}.
              </p>
            )}
          </div>

          {/*
            The same coupon box the cart page has, gated by the same setting, so
            a shopper who skipped straight to checkout is not asked to go back
            to the cart to redeem a code. Not offered for a direct "buy this
            one" order, which is bought outside the cart the coupon applies to.
          */}
          {checkout.showCouponBox && !directOrder && (
            <CouponForm
              appliedCode={cart.discountCode}
              discountAmount={cart.discountAmount}
            />
          )}

          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
            <span>Total</span>
            <span className="text-sale">
              {quoting && !quote ? "…" : formatPrice(payableTotal)}
            </span>
          </div>
          {!quote && !quoteRefusal && (
            <p className="mt-2 text-xs text-gray-400">
              {deliveryUnconfigured
                ? "This store has not set up delivery yet."
                : "Delivery and tax are added once you choose an option."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
