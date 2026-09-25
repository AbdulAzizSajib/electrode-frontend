"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, BadgeCheck, Loader2, Plus, Store, Truck } from "lucide-react";
import clsx from "clsx";
import AddressForm from "@/components/account/AddressForm";
import AdvancePaymentSection, {
  defaultAdvanceClaim,
  EMPTY_ADVANCE_CLAIM,
  type AdvanceClaimDraft,
  type AdvanceClaimErrors,
} from "@/components/checkout/AdvancePaymentSection";
import DestinationField from "@/components/account/DestinationField";
import {
  CartQuantityControl,
  CartRemoveButton,
} from "@/components/cart/CartLineControls";
import { Field } from "@/components/account/form-controls";
import {
  findDestination,
  refusalMessage,
  resolveDeliveryOption,
  type Destination,
} from "@/lib/delivery-destination";
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
import type { CheckoutPaymentMethod, PlaceOrderPayload } from "@/types/order";
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

  /*
   * WHERE THE ORDER IS GOING — which is now what decides the delivery charge.
   *
   * A guest chooses it in the address fields above. A signed-in shopper's comes
   * from the address they selected, so switching address moves the charge with
   * it and nothing has to be re-entered.
   *
   * Null for an address saved before the picker existed: `findDestination`
   * refuses to guess a district out of free text, because a guess that is
   * usually right is a wrong delivery charge on the orders where it is not.
   * Those fall through to the option cards below. See design.md, D7.
   */
  const [guestDestination, setGuestDestination] = useState<Destination | null>(null);

  /*
   * The address the order is going to.
   *
   * An address added without leaving checkout is held here as well, because
   * `onSaved` selects it a moment before the list query has refetched it: the
   * shopper would otherwise watch the delivery options reappear and vanish
   * again as the charge they had just settled was unresolved and re-resolved.
   */
  const [addedAddress, setAddedAddress] = useState<Address | null>(null);
  const selectedAddress =
    addresses.find((a) => a.id === addressId) ??
    (addedAddress && addedAddress.id === addressId ? addedAddress : null);

  const destination: Destination | null = isSignedIn
    ? findDestination(selectedAddress?.state, selectedAddress?.city)
    : guestDestination;

  /*
   * The picker answers BOTH halves at once. The area lands in `guest.city`,
   * which is what keeps the merchant's own rule for that field — shown,
   * required — governing this one, with no second rule beside it to disagree.
   * The district travels separately, as `state`, when the order is sent.
   */
  const chooseDestination = (next: Destination | null) => {
    setGuestDestination(next);
    updateGuest("city", next?.area ?? "");
  };

  /*
   * The option the destination makes this, or the reason it makes none.
   *
   * Collection is handed a null destination deliberately: a pickup point is
   * somewhere the shopper goes, not somewhere an address resolves to, and which
   * one they collect from stays their own choice.
   */
  const destinationResolution = resolveDeliveryOption(
    collecting ? null : destination,
    deliveryOptions,
  );
  const derivedOption = destinationResolution.resolved
    ? destinationResolution.option
    : null;

  /*
   * The option in force: derived when the destination decided one, otherwise
   * the one the shopper picked off the cards — and the cards are shown exactly
   * when nothing was derived. One of the two and never both, so there is a
   * single key to quote against, to submit, and to fingerprint the attempt.
   */
  const selectedOption: DeliveryOption | null =
    derivedOption ?? shownOptions.find((o) => o.key === deliveryOptionKey) ?? null;
  const optionKeyInForce = selectedOption?.key ?? null;

  const refusalReason = destinationResolution.resolved
    ? null
    : destinationResolution.reason;

  /*
   * THE OPTION CARDS ARE THE WAY OUT, NOT THE FIRST QUESTION.
   *
   * They used to appear the moment checkout loaded, before a district had been
   * chosen — a full price list offering a choice the address was about to
   * overrule, on a page whose whole point is that nobody has to know which
   * bucket they live in. So while the shopper still has a picker in front of
   * them and simply has not used it yet, there is nothing to show: the summary
   * says the charge follows from their area, and it does.
   *
   * "Still has a picker" is the whole of the condition, and it is doing real
   * work. A shopper COLLECTING has no destination to give and must still choose
   * a pickup point. A merchant who does not collect a city leaves a guest with
   * nothing to answer with at all. In both, an unanswered destination is
   * permanent, and hiding the cards would leave a store unable to take an
   * order — which is the one thing D5 exists to prevent.
   */
  const awaitingDestination =
    refusalReason === "NO_DESTINATION" && !collecting && (isSignedIn || shows("city"));

  /** The shopper is asked to choose only when the destination could not. */
  const asksForOption = !derivedOption && !awaitingDestination;

  /**
   * Why they are being asked, when there is a reason worth saying. Null while
   * they simply have not answered yet — telling someone their area could not be
   * worked out before they have named one is an error message for nothing.
   */
  const optionRefusal = refusalReason ? refusalMessage(refusalReason) : null;

  /*
   * Whether this store takes money before it ships.
   *
   * The ONE condition the whole payment surface reads from. With it false —
   * which is every store that has never configured it, since the API normalises
   * an absent block to disabled — checkout renders the unchanged
   * cash-on-delivery panel and the claim is never assembled, so the order goes
   * out through the identical path it did before this existed.
   *
   * The account lists are checked too, not just the flag: the backend refuses to
   * enable the feature with no accounts, so this can only differ from
   * `enabled` if a merchant edits the row by hand — and offering a choice with
   * nowhere to send money would be worse than not offering it.
   */
  const advanceConfig = checkout.advancePayment;
  const advanceOffered =
    advanceConfig.enabled &&
    advanceConfig.mobileAccounts.length + advanceConfig.bankAccounts.length > 0;

  /*
   * Seeded with the advance charge and the first account already chosen, so a
   * shopper lands on the number to send to rather than on two questions about
   * how they would like to be asked. `defaultAdvanceClaim` carries the reasoning
   * and the consequence — with a choice always set, an advance is required for
   * as long as the merchant leaves the feature on.
   *
   * Lazily, and only where the merchant offers it: a store with the feature off
   * must start from a claim that is empty in every field, because that is what
   * "this shopper is not paying in advance" is spelled as everywhere below.
   */
  const [advanceClaim, setAdvanceClaim] = useState<AdvanceClaimDraft>(() =>
    advanceOffered ? defaultAdvanceClaim(advanceConfig) : EMPTY_ADVANCE_CLAIM,
  );
  const [advanceErrors, setAdvanceErrors] = useState<AdvanceClaimErrors>({});

  const patchAdvanceClaim = (patch: Partial<AdvanceClaimDraft>) => {
    setAdvanceClaim((prev) => ({ ...prev, ...patch }));
    // Clearing only the fields that were touched keeps a message on a field the
    // shopper has not revisited, which is where they still need to see it.
    setAdvanceErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch) as (keyof AdvanceClaimDraft)[]) {
        delete next[key as keyof AdvanceClaimErrors];
      }
      return next;
    });
  };

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

  /*
   * The lines and their quantities, as one string.
   *
   * Two things need it and must not disagree. It is part of `orderFingerprint`
   * below, which regenerates the idempotency key so a corrected order cannot be
   * submitted under a previous attempt's key. And it re-keys the delivery quote
   * — for a cart order the server prices the cart itself, so without this the
   * quote would not re-run when a quantity changed here and the total would
   * stay priced for the old one. See `CheckoutQuoteRequest.cartKey`.
   */
  const lineSignature = displayLines
    .map((l) => `${l.id}:${l.quantity}`)
    .sort()
    .join(",");

  // What makes this a materially different order. Notes are excluded: editing
  // them after an unconfirmed attempt should not turn a retry into a duplicate.
  // The guest's own details are included for the same reason the address id is:
  // changing where an order ships makes it a different order, and reusing the
  // key would hand back the one already placed to the old address.
  const orderFingerprint = [
    addressId,
    // The delivery choice is priced, so changing it makes this a different
    // order — it must not reuse the previous attempt's key and be handed back
    // the order already placed at the old price. The key IN FORCE, not the one
    // the shopper clicked: on a derived order they clicked none.
    optionKeyInForce ?? "",
    // The destination itself, which is recorded on the order as well as being
    // what decided that key. Two districts resolving to the same option are
    // still two different places to send a parcel to.
    destination ? destination.district + "/" + destination.area : "",
    /*
     * The payment claim, for the same reason as the delivery option and more
     * sharply: an order paid for in advance by a DIFFERENT transaction is a
     * different order. Reusing the key would hand back the one already placed
     * and silently discard the second reference — money sent against nothing.
     */
    advanceClaim.choice ?? "",
    advanceClaim.accountId ?? "",
    advanceClaim.transactionId.trim(),
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
    lineSignature,
  ].join("|");
  const lastFingerprint = useRef(orderFingerprint);

  /*
   * A choice made against a list of accounts that has since changed is dropped.
   *
   * The merchant can delete an account between this page rendering and the
   * shopper acting on it. Without this the claim would name an id the server no
   * longer knows and be refused with an account error — after the shopper had
   * already sent the money to a number that is now off the page.
   */
  useEffect(() => {
    if (!advanceClaim.accountId) return;
    const stillOffered =
      advanceConfig.mobileAccounts.some((a) => a.id === advanceClaim.accountId) ||
      advanceConfig.bankAccounts.some((a) => a.id === advanceClaim.accountId);
    if (stillOffered) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAdvanceClaim((prev) => ({ ...prev, accountId: null }));
  }, [advanceConfig, advanceClaim.accountId]);

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

  const asksAboutDelivery = asksForOption || offersCollection;

  /*
   * The payment step needs an option to price it, so it waits for one — which
   * means "the merchant offers advance payment" is NOT the same as "this
   * section has a payment step in it right now".
   */
  const showsPaymentStep = advanceOffered && selectedOption !== null;

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
      deliveryOptionKey: optionKeyInForce ?? "",
      items: directOrder ? [directOrder.item] : undefined,
      // Re-keys the quote when the cart changes. A direct order needs none —
      // its lines are in `items`, which already re-keys it.
      cartKey: directOrder ? undefined : lineSignature,
    },
    { skip: !hasLines || !optionKeyInForce },
  );

  /*
   * The quote, and ONLY while there is an option for it to be a quote of.
   *
   * The query is skipped without one, but a skipped query still hands back what
   * it last fetched, and that figure is now reachable: clearing the destination
   * takes the option away again, where a radio button could only ever be moved
   * from one option to another. Without this guard the summary kept charging
   * ৳120 for a delivery nobody had chosen — and `payableTotal` read from the
   * same stale quote, so the total agreed with it.
   */
  const quote = optionKeyInForce ? (quoteResponse?.data ?? null) : null;

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

  /*
   * With the destination answering the delivery question, the section can be
   * left holding nothing at all, which is where a shopper starts now that the
   * option cards wait for a destination. Rendering a heading over an empty box
   * is how a form looks broken, so the section goes when there is nothing left
   * in it.
   *
   * `showsPaymentStep` USED TO KEEP IT ALIVE, and no longer does: the payment
   * step moved into the summary card, so an advance-payment store with its
   * delivery question already answered has nothing to put in this section at
   * all. Leaving the condition in would render an empty "Delivery" heading over
   * a panel that is now two columns away.
   *
   * The misconfigured store keeps the section either way — "delivery is not set
   * up" is the one thing that still has to be said.
   */
  const deliverySectionShown = deliveryUnconfigured || asksAboutDelivery;

  const shippingCharge = quote?.shippingAmount ?? selectedOption?.price ?? 0;
  const payableTotal = quote ? roundMoney(quote.totalAmount) : roundMoney(displayTotal);

  /*
   * What each advance choice costs, straight from the quote.
   *
   * Recomputed by the server on every re-quote, and the quote re-runs whenever
   * the delivery option or the cart changes — so the figure the shopper reads
   * moves with the option they pick rather than going stale behind it. There is
   * deliberately no separate client-side recomputation to keep in step, because
   * a second implementation of "how much should they send" is how a shopper is
   * shown ৳130, sends ৳130, and has the claim refused for not being ৳150.
   *
   * Null until a delivery option is chosen, since there is no delivery charge to
   * quote before then.
   */
  const advanceSplits = quote?.advanceOptions ?? null;
  const selectedAdvance =
    advanceClaim.choice && advanceSplits ? advanceSplits[advanceClaim.choice] : null;

  /*
   * An advance order is one where the shopper has actually chosen to pay now.
   * Choosing nothing is the default and means cash on delivery, exactly as
   * before — the choices are an offer, not a requirement.
   */
  const payingInAdvance = advanceOffered && advanceClaim.choice !== null;

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
    Boolean(optionKeyInForce) &&
    hasLines &&
    (isSignedIn ? Boolean(addressId) || !needsAddress : true) &&
    /*
     * An advance choice is only complete once there is an account, a sender and
     * a reference. The button stays disabled rather than the shopper pressing it
     * and being told what they missed — they have already sent real money by
     * this point, and a refusal at that moment reads as the money being lost.
     *
     * A ZERO advance is refused here too, and it is not a theoretical case: it
     * is what "pay the delivery charge" means on an order whose delivery was
     * waived by the free-shipping threshold. The server refuses it (there is no
     * transaction of ৳0 to verify), so the reason is said below the button
     * instead of arriving as a 400 after the shopper has typed a reference.
     */
    (!payingInAdvance ||
      (Boolean(advanceClaim.accountId) &&
        advanceClaim.senderIdentifier.trim() !== "" &&
        advanceClaim.transactionId.trim() !== "" &&
        selectedAdvance !== null &&
        selectedAdvance.advanceAmount > 0));

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
    if (!staleOption || !optionKeyInForce) return;
    // Once per offending key: refreshing on every render of the same refusal
    // would loop, since the refusal survives until the shopper picks again.
    if (refreshedFor.current === optionKeyInForce) return;
    refreshedFor.current = optionKeyInForce;
    router.refresh();
  }, [staleOption, optionKeyInForce, router]);

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
      requireField("city", "Please choose your district and area.");
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

  /**
   * The method implied by the account the shopper picked.
   *
   * Sent so the request is well-formed — the backend rejects a claim with no
   * advance method — but it is NOT what decides how the payment is recorded.
   * The server re-derives the method from the same account, so a client that
   * sent the wrong one changes nothing.
   */
  function claimedMethod(accountId: string): CheckoutPaymentMethod {
    const mobile = advanceConfig.mobileAccounts.find((a) => a.id === accountId);
    return mobile ? mobile.provider : "BANK_TRANSFER";
  }

  /**
   * The claim's own required fields, mirroring what the backend demands.
   *
   * Separate from `validateGuest` because it applies to a signed-in shopper
   * too: advance payment is not a guest feature, and the backend's own check
   * deliberately sits outside its guest branch for the same reason.
   */
  function validateAdvanceClaim(): boolean {
    const errors: AdvanceClaimErrors = {};

    if (!advanceClaim.choice) {
      errors.choice = "Choose how you would like to pay.";
    }
    if (!advanceClaim.accountId) {
      errors.accountId = "Choose the account you sent the money to.";
    }
    if (!advanceClaim.senderIdentifier.trim()) {
      errors.senderIdentifier = "Tell us which number or account you paid from.";
    }
    if (!advanceClaim.transactionId.trim()) {
      errors.transactionId = "Enter the transaction id from your payment.";
    }

    setAdvanceErrors(errors);
    return Object.keys(errors).length === 0;
  }

  /**
   * Turns a refusal about the claim into a message on the field that caused it.
   *
   * Three of these need their own handling rather than the generic banner, and
   * all three share a property: the shopper has ALREADY SENT the money. A
   * catch-all "we couldn't place your order, please try again" tells someone who
   * is ৳130 out of pocket to do the whole thing again, including paying.
   *
   * Returns true when it handled the error, so the caller leaves the banner
   * alone and the message stays beside the field the shopper has to fix.
   */
  function handleClaimFailure(err: unknown): boolean {
    const status = (err as { status?: number } | undefined)?.status;
    const message = errorMessage(err);

    // A reference someone else already claimed, or the shopper submitted twice.
    // Named on the field, because the fix is a different id — not a retry.
    if (status === 409 && /transaction id/i.test(message)) {
      setAdvanceErrors({
        transactionId:
          "This transaction id is already recorded against another order. Check the id from your payment app — do not send the money again.",
      });
      return true;
    }

    /*
     * The advance moved underneath the shopper — they changed a delivery option,
     * or a coupon landed, between reading the figure and pressing the button.
     * The server's message names both amounts, so it is shown verbatim above the
     * button; what this adds is clearing the reference, because the money they
     * sent was for the OLD figure and resubmitting the same id against the new
     * one would be claiming a payment they did not make.
     */
    if (status === 409 && /advance has changed/i.test(message)) {
      setError(message);
      setAdvanceErrors({
        transactionId:
          "The amount changed after you paid. Send the difference and enter that transaction id, or choose cash on delivery and contact us about the payment you already sent.",
      });
      return true;
    }

    // The merchant removed the account between this page loading and the order
    // being placed. Re-reading the settings is what puts the current list on
    // screen; the effect above then drops the selection that no longer exists.
    if (status === 400 && /payment account is no longer available/i.test(message)) {
      setAdvanceErrors({ accountId: message });
      router.refresh();
      return true;
    }

    return false;
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
    // before the request rather than after. The key in force, since on a
    // derived order the shopper never clicked one.
    if (!optionKeyInForce) return;

    // The claim is checked before anything is sent, for the same reason the
    // button is disabled: a refusal after the money has left is the one failure
    // the shopper cannot undo.
    if (payingInAdvance && !validateAdvanceClaim()) return;

    // Normalized so the phone stored against the order matches what the
    // confirmation will send back to look it up.
    const normalizedPhone = normalizeBdPhone(guest.phone) ?? guest.phone.trim();

    /*
     * The claim, or nothing at all.
     *
     * Both keys are omitted entirely on a cash-on-delivery order rather than
     * sent as `COD` with an empty claim — the backend treats an absent
     * `paymentMethod` as cash on delivery, and a claim without an advance method
     * is rejected outright. Omitting is what keeps the feature-off path byte for
     * byte the request it was before this shipped.
     *
     * The method sent is the one the chosen ACCOUNT implies, not one the shopper
     * names: the server re-derives it from the same account, because a shopper
     * who could name a bKash account and declare it Nagad would send staff to
     * the wrong statement to verify it.
     */
    const advanceFields =
      payingInAdvance && advanceClaim.choice && advanceClaim.accountId && selectedAdvance
        ? {
            paymentMethod: claimedMethod(advanceClaim.accountId),
            advancePayment: {
              choice: advanceClaim.choice,
              accountId: advanceClaim.accountId,
              // Echoed back so the server can notice the page went stale
              // between the figure being read and the money being sent.
              expectedAdvanceAmount: selectedAdvance.advanceAmount,
              senderIdentifier: advanceClaim.senderIdentifier.trim(),
              transactionId: advanceClaim.transactionId.trim(),
            },
          }
        : {};

    const payload: PlaceOrderPayload = isSignedIn
      ? {
          mode: "account",
          shippingAddressId: addressId as string,
          // The same key the quote was priced against, so the amount shown and
          // the amount charged come from one choice. Whether this is a delivery
          // or a collection is the option's own property, not a claim the client
          // makes alongside it — and whether a person or their address picked it
          // is not something the server is told either. See design.md, D8.
          deliveryOptionKey: optionKeyInForce,
          notes: notes.trim() || undefined,
          idempotencyKey,
          ...advanceFields,
        }
      : {
          mode: "guest",
          deliveryOptionKey: optionKeyInForce,
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
                /*
                 * The two halves of the one answer the picker took. `state` is
                 * the district — an existing field on both this payload and the
                 * saved address, already validated and already persisted, which
                 * is what keeps this change out of the server entirely.
                 */
                city: collected("city"),
                state: destination?.district,
                postalCode: collected("postalCode"),
              },
          // Present only for a direct product order; otherwise the cart is used.
          items: directOrder ? [directOrder.item] : undefined,
          notes: notes.trim() || undefined,
          idempotencyKey,
          ...advanceFields,
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

      // A refusal about the claim is answered on the field that caused it, so
      // the shopper is not told to retry an order they have already paid for.
      if (handleClaimFailure(err)) return;

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
    <div className="container-px mx-auto max-w-7xl py-10">
      {/*
        THE MERCHANT'S NOTICE SITS AT THE TOP, under the title and across both
        columns.

        It used to sit directly above Place Order, which is the right place for
        a note ABOUT the button — "you are agreeing to X by pressing this". What
        merchants actually write here is a condition on the whole order: that
        stock is not guaranteed, that someone will ring to confirm. Read for the
        first time at the bottom of the summary card, after the address, the
        delivery choice and a transaction id have all been typed in, that is a
        term disclosed after the work rather than before it.

        Full width rather than in a column, because it qualifies both of them.

        The wrapper carries the spacing so the notice can leave NOTHING behind
        when it is empty — no container, no margin, no gap where a banner would
        have been. That rule came with the notice and outranks where it sits.
      */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        {checkout.notice.trim() && (
          <p className="mt-4 rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 text-center font-bold">
            {checkout.notice.trim()}
          </p>
        )}
      </div>

      {/*
        FIVE COLUMNS, NOT THREE — the summary takes two of them rather than one.
        At thirds the summary was half the width of the form beside it, which
        left the product rows wrapping their names to one line and the money
        column crammed against the edge. The order being placed deserves at
        least as much room as the address being typed, and the extra fifth is
        what lets a product name, a quantity stepper and a price sit on one row
        without any of them truncating.
      */}
      {/*
        MOBILE REORDERS AROUND THE SUMMARY, DESKTOP DOES NOT.

        The summary card used to sit SECOND on one column — after the address,
        before the delivery options — so that a shopper checked what they were
        buying on the way down rather than scrolling past the button to find it.
        It now goes LAST, and the reason is the same reason: the card holds the
        payment step and Place Order, so anything left above it is a question
        the shopper would be answering after being shown the button for it. The
        order on one column is now: type where it goes, choose how it ships,
        leave a note, then check the basket and pay.

        The left column is `display: contents` below `lg` so its sections become
        siblings of the summary card in the same flex column and can be ordered
        around it; `contents` drops that box, so its `space-y-8` moves to the
        column's `gap-8` for that range. At `lg` it is a block again in column 3
        and every `order-*` is dropped, so the two-column layout is unchanged.
      */}
      {/*
        THE FORM IS THE GRID, which it did not used to be — it was the left
        column, with the summary card as its sibling. Place Order now sits at
        the bottom of that card, and a submit button outside its form is not a
        submit button. The alternative was `form="…"` on the button by id, which
        works and would have left the payment fields above it outside the form
        too: no Enter-to-submit from the transaction id field, and a shape that
        reads like an accident to the next person in here.

        The left column keeps its own box, so `contents` below `lg` and the
        `order-*` classes on its sections behave exactly as before.
      */}
      <form
        onSubmit={handlePlaceOrder}
        className="flex flex-col gap-8 lg:grid lg:grid-cols-5 lg:items-start"
      >
        {/*
          STICKY, AND THE SUMMARY CARD IS NOT — the reverse of how this page
          used to work, for the reason the reversal followed: the card now holds
          the payment step and Place Order, so it is the tall column, and a
          sticky element taller than the viewport pins at its top and never
          scrolls, putting its own button out of reach. The short column is the
          one that can be pinned, and pinning it is what keeps the address and
          the chosen delivery option on screen while the shopper works down the
          payment step beside it.

          PLAIN `sticky`, WITH NO HEIGHT GATE AND NO INNER SCROLLER, and both
          omissions were tried the other way first.

          A `min-height` media query — stick only on a viewport tall enough to
          hold the column — reads as the careful answer and is worse than
          useless: the height it has to guess at is the rendered height of a form
          whose fields the merchant configures, so on a scaled 1080p display, the
          common case, the gate simply never opened and nothing was sticky at
          all. A feature that silently does nothing on the machine it is being
          looked at is not a safer feature.

          A bounded height with `overflow-y-auto` covers every viewport and costs
          two things this page cannot pay: the district picker's list is
          deliberately not a portal (see SearchableSelect), so a scroll container
          here clips it, and Lenis owns the wheel page-wide, so an inner scroller
          needs `data-lenis-prevent` — which then swallows the page scroll
          whenever the cursor is over a column that had no overflow to scroll.

          What is given up: on a viewport shorter than this column, its last few
          pixels cannot be scrolled to, because a sticky box pins at its top and
          stops. That is the same trade the summary card made here for as long as
          it was the pinned one, and the thing at the bottom of this column is an
          optional note rather than the button.
        */}
        <div className="contents lg:block lg:space-y-8 lg:col-span-3 lg:sticky lg:top-24">
          {/*
            EVERY STEP IS A CARD, ON THE SAME CHROME AS THE SUMMARY.

            The left column used to be bare headings and fields on the page's own
            background while the summary opposite was a bordered card, which made
            the one column read as a panel and the other as loose page — two
            halves of one checkout drawn as two different kinds of thing. They now
            share `rounded-xl border border-gray-200 bg-gray-50 shadow-sm`.

            THE FILL IS WHAT DOES THE WORK, not the border. The page background is
            merchant-themable and white by default, so a white card on it was a
            card only by its outline; a step that is tinted is a step you can see
            the edges of without looking for them.

            The grey is a fixed neutral rather than a theme token on purpose —
            every other surface on this page (the payment plate, the notice, the
            disabled button) is already drawn from the same `gray-*` scale, and
            deriving it from the merchant's background would put a colour they
            chose for the page underneath content that has to stay readable.

            EVERY CONTROL ON THE CARD IS PAINTED WHITE, from the card rather than
            from itself. `Field` and the note's textarea draw no background of
            their own, which was right while they sat on the page's white and is
            wrong the moment the surface under them is tinted — a field a shopper
            has to type into must not be the same colour as the panel around it.
            Reached with `[&_input]` / `[&_textarea]` for the same reason the
            payment plate reaches for it: `Field` spreads its props onto the
            input AFTER its own class string, so a `className` passed in replaces
            the control instead of adding to it.

            The radio inputs in the delivery fieldset are caught by that selector
            too and are unaffected by it — a native radio draws from
            `accent-color`, not from its background.
          */}
          {/* Hidden entirely when collecting — there is nothing to deliver to,
              and the fields' required rules are dropped with them. Switching
              back to a delivery area restores both. */}
          {needsAddress && (
          <section className="order-1 lg:order-0 rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm [&_input]:bg-white [&_textarea]:bg-white">
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
                    label={`Full Name${optionalSuffix("fullName")}`}
                    name="fullName"
                    value={guest.fullName}
                    onChange={(e) => updateGuest("fullName", e.target.value)}
                    error={guestErrors.fullName}
                    placeholder="আপনার সম্পূর্ণ নাম লিখুন ..."
                    autoComplete="name"
                  />
                )}
                {shows("phone") && (
                  <Field
                    label={`Mobile Number${optionalSuffix("phone")}`}
                    name="phone"
                    value={guest.phone}
                    onChange={(e) => updateGuest("phone", e.target.value)}
                    error={guestErrors.phone}
                    placeholder="সঠিক মোবাইল নম্বর লিখুন ..."
                    autoComplete="tel"
                    inputMode="tel"
                  />
                )}
                {/*
                  THE DESTINATION IS ASKED BEFORE THE STREET ADDRESS.

                  It used to come after, in the order a postal address is
                  written: street, then area, then city. That is the right order
                  for addressing an envelope and the wrong one for this form,
                  because here this field is not part of the address — it is what
                  DECIDES the order. Choosing a district and area resolves the
                  delivery option, the charge, and with it the advance to send;
                  see `chooseDestination`. Asked last, a shopper typed out a full
                  street address before finding out what delivery would cost, and
                  anyone who balked at the figure had already done the typing.

                  Postal code moves with it rather than staying behind, because
                  the two share a row when the merchant collects both and a
                  half-width box on its own is not a layout.
                */}
                {(shows("city") || shows("postalCode")) && (
                  /* Two columns only when there are two fields to put in them.
                     A lone field in a two-column grid is a half-width box with
                     nothing beside it, which was survivable for a short "City"
                     input and is not for a picker whose closed state reads
                     "Select District and City…" and whose list has to show a
                     district and an area on one line. */
                  <div
                    className={clsx(
                      "grid grid-cols-1 gap-4",
                      shows("city") && shows("postalCode") && "sm:grid-cols-2",
                    )}
                  >
                    {/*
                        THE CITY FIELD, ASKED AS A PLACE RATHER THAN AS TEXT.

                        It was a text box, and what came back was "dhaka",
                        "Dahka", "savar, dhaka" — which cannot be searched,
                        cannot be given to a courier, and cannot say what
                        delivery costs. Chosen from the list it is a place the
                        system knows, which is what lets the delivery option
                        follow from it instead of being asked for separately.

                        Still governed by the merchant's own `city` setting:
                        shown when they collect a city, required when they
                        require one, and gone entirely when they do not — in
                        which case nothing is derived and the shopper picks a
                        delivery option themselves, as before.
                      */}
                    {shows("city") && (
                      <DestinationField 
                        id="destination"
                        label={`District / City${optionalSuffix("city")}`}
                        value={guestDestination}
                        onChange={chooseDestination}
                        error={guestErrors.city}
                      />
                    )}
                    {shows("postalCode") && (
                      <Field
                        label={`Postal code${optionalSuffix("postalCode")}`}
                        name="postalCode"
                        value={guest.postalCode}
                        onChange={(e) => updateGuest("postalCode", e.target.value)}
                        error={guestErrors.postalCode}
                        placeholder="আপনার পোস্টাল কোড লিখুন ..."
                        autoComplete="postal-code"
                        inputMode="numeric"
                      />
                    )}
                  </div>
                )}
                {shows("addressLine1") && (
                  <Field
                    label={`Full Address${optionalSuffix("addressLine1")}`}
                    name="addressLine1"
                    value={guest.addressLine1}
                    onChange={(e) => updateGuest("addressLine1", e.target.value)}
                    error={guestErrors.addressLine1}
                    placeholder="বাড়ি/মহল্লা/রাস্তা/এরিয়ার বিস্তারিত ঠিকানা লিখুন ..."
                    autoComplete="address-line1"
                  />
                )}
                {shows("addressLine2") && (
                  <Field
                    label={`Apartment, Floor${optionalSuffix("addressLine2")}`}
                    name="addressLine2"
                    value={guest.addressLine2}
                    onChange={(e) => updateGuest("addressLine2", e.target.value)}
                    error={guestErrors.addressLine2}
                    placeholder="আপনার অ্যাপার্টমেন্ট, ফ্লোর লিখুন ..."
                    autoComplete="address-line2"
                  />
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
                    if (!saved.id) return;
                    setAddressId(saved.id);
                    // Its district and area are the destination from this
                    // moment, not from whenever the address list catches up.
                    setAddedAddress(saved);
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

          {/*
            DELIVERY ONLY. PAYMENT IS ANSWERED IN THE SUMMARY CARD.

            The two were one section for a while, and the reasoning that merged
            them still stands where it was aimed: what the advance costs IS the
            delivery charge just picked, so the two questions cannot be posed as
            unrelated decisions of equal weight. What changed is WHERE the second
            one is posed. Standing in this column, the payment step was a long
            way from the figure it is asking the shopper to send; in the summary
            card it sits directly under the Total, which is the number it is
            about. See the note at its mount point there.

            What stays here is the part that belongs to the address above it:
            where the order is going, and what that costs. The alternatives sit
            SIDE BY SIDE rather than stacked — a pair read at a glance is a
            choice, a pair a screenful apart is a list to work down.
          */}
          {deliverySectionShown && (
          <section className="order-3 lg:order-0 rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm [&_input]:bg-white [&_textarea]:bg-white">
            {/* Just "Delivery" again, and fixed rather than derived. The
                heading moved between "Delivery", "Payment" and "Delivery &
                Payment" for as long as this section could be holding either
                question; with payment answered in the summary card it only ever
                holds the one. */}
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Delivery</h2>

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

                {/*
                  STEP ONE, and ONLY when there is a real choice between the
                  two. With collection off the shopper never sees it, and
                  whatever comes next takes the number instead.

                  It survives the destination picker above deliberately:
                  collection is not somewhere an address resolves to, so this
                  one question cannot be answered by knowing where they live.
                */}
                {offersCollection && (
                  <fieldset className="mb-5 min-w-0" aria-label="How you want it">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setCollectInPerson(false)}
                        className={clsx(
                          "flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-colors",
                          !collecting
                            ? "border-brand bg-brand/5 text-brand ring-1 ring-brand"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
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
                            ? "border-brand bg-brand/5 text-brand ring-1 ring-brand"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300",
                        )}
                      >
                        <Store size={16} /> Collect in person
                      </button>
                    </div>
                  </fieldset>
                )}

                {/*
                  ASKING FOR THE DELIVERY OPTION IS NOW THE FALLBACK, NOT THE PATH.

                  When the shopper's district and area resolved to one of the
                  merchant's options, this whole question is gone: the charge is
                  already decided and named on the order summary, and asking
                  again would be offering them a way to contradict their own
                  address. See design.md, D5 and D6.

                  It is still here, unchanged, for every case where a
                  destination cannot decide — collection in person, an address
                  saved before the picker existed, an area no zone covers, an
                  option the merchant has since deleted, or a store that does
                  not collect a city at all. A store must never be left unable
                  to take an order because a map is out of date.

                  THE OPTIONS SIT SIDE BY SIDE, NOT STACKED. Stacked, they read
                  as a list to work down rather than one question to answer at a
                  glance — and with the payment panel opening INSIDE the chosen
                  row, picking the first area pushed the second one a screenful
                  down the page, so the alternative the shopper had just decided
                  against was no longer there to compare with. Side by side, the
                  two are one question; and what opens now opens below BOTH of
                  them, so the next step is always in the same place whichever
                  was picked.
                */}
                {asksForOption && (
                  <>
                {/* Why they are being asked after all, when there is something
                    worth saying — silent while they simply have not answered
                    yet, and silent for collection, which was never derived. */}
                {optionRefusal && (
                  <p className="mb-3 flex items-start gap-2 rounded border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                    <span>{optionRefusal}</span>
                  </p>
                )}

                {shownOptions.length === 0 ? (
                  <p className="rounded border border-gray-200 p-4 text-sm text-gray-500">
                    {collecting
                      ? "No pickup points are available at the moment."
                      : "No delivery areas are available at the moment."}
                  </p>
                ) : (
                  <fieldset
                    className="min-w-0"
                    aria-label={
                      collecting ? "Where you will collect from" : "Which delivery charge applies"
                    }
                  >
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {shownOptions.map((option) => {
                        const isSelected = deliveryOptionKey === option.key;

                        return (
                          <label
                            key={option.key}
                            className={clsx(
                              "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors",
                              // White when unselected, exactly as the account
                              // cards in the payment step are: on a tinted panel
                              // the fill is what says "this is a thing to pick".
                              isSelected
                                ? "border-brand bg-brand/5 ring-1 ring-brand"
                                : "border-gray-200 bg-white hover:border-gray-300",
                            )}
                          >
                            <input
                              type="radio"
                              name="deliveryOption"
                              checked={isSelected}
                              onChange={() => setDeliveryOptionKey(option.key)}
                              className="mt-0.5 accent-brand"
                            />
                            {/* Name, then when, then how much — down the card
                                rather than across it. A card is half the width
                                of the row it replaced, so a name and a price on
                                one line no longer reliably fit, and the price
                                carries the most weight of the three because it
                                is what a shopper compares the two areas on. */}
                            <span className="min-w-0 flex-1">
                              <span className="block text-sm font-medium text-gray-900">
                                {option.label}
                              </span>
                              {option.days > 0 && (
                                <span className="mt-0.5 block text-xs text-gray-500">
                                  {collecting ? "Ready in" : "Estimated delivery in"}{" "}
                                  {option.days} {option.days === 1 ? "day" : "days"}
                                </span>
                              )}
                              <span className="mt-2 block text-base font-bold text-gray-900">
                                {formatPrice(option.price)}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                )}

                {!deliveryOptionKey && shownOptions.length > 1 && (
                  <p className="mt-3 text-sm text-gray-500">
                    {advanceOffered
                      ? "Choose an option to see your total and how to pay."
                      : "Choose an option to see your total."}
                  </p>
                )}

                  </>
                )}
              </>
            )}
          </section>
          )}

          {/*
            THE CASH-ON-DELIVERY PANEL, AND THE ONE PLACE THE FEATURE SWITCHES.

            With advance payment off this is byte for byte the panel it always
            was, guest-only and static: cash on delivery, nothing collected up
            front, no choice offered. That is not a fallback, it is the whole
            guarantee — a store that predates this feature must behave exactly as
            it did, down to this still being its own section.

            It stays out here rather than folding into the delivery steps
            above, and the asymmetry is the point: with the feature off there is
            no payment DECISION to make, only a fact to state, so there is
            nothing to attach to a delivery option and nothing a shopper can get
            out of order. The confusion the merge fixes is two lists of radios;
            one list and a sentence is not that.

            With advance payment on, this renders nothing — the panel lives
            below the chosen delivery option as its own step, and for a
            SIGNED-IN shopper too, unlike this one. That mirrors the backend: the
            old cash-only check lived in the guest branch and was moved out,
            because a signed-in shopper sends the delivery charge on the same
            terms a guest does.
          */}
          {!advanceOffered && !isSignedIn && (
            <section className="order-4 lg:order-0 rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm [&_input]:bg-white [&_textarea]:bg-white">
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
            <section className="order-5 lg:order-0 rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm [&_input]:bg-white [&_textarea]:bg-white">
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

        </div>

        {/*
          A BORDERED CARD ON WHITE, not a grey block.
          
          The grey panel read as a muted aside — the least important thing on
          the page — when it is the one part a shopper actually checks before
          paying. A white card with its own border and a titled header gives it
          the same visual weight as the form, which is what the merchant's
          reference layout does.
          
          NO LONGER STICKY. It was, back when it held only the totals and was
          the shorter of the two columns. It now carries the payment step and
          Place Order, which makes it the taller one — and a sticky box taller
          than the viewport pins at its top and stops moving, so the button at
          its end could not be scrolled to at all. The form column opposite is
          pinned instead; see the note on it.

          `bg-gray-50` rather than white, matching the form's steps — see the
          note on the shared chrome over there. The one thing this costs is the
          payment plate inside, which is the same grey and so no longer reads as
          a raised surface; it keeps its border, and the white controls on it are
          what actually mark it out, so the step still holds together.
        */}
        {/* `[&_input]:bg-white` for the same reason the form's cards carry it:
            the coupon box is shared with the cart page and draws no background
            of its own, so on a tinted card it would be the same grey as the
            panel. It reaches the quantity steppers in the product rows too,
            which is wanted — every control on this card is a thing to touch. */}
        <div className="order-6 h-fit overflow-hidden rounded-xl border border-gray-200 bg-gray-50 shadow-sm lg:order-0 lg:col-span-2 [&_input]:bg-white">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-center text-lg font-bold text-gray-900">Order Details</h2>
          </div>

          <div className="px-5 py-4">
          {directOrder && (
            <p className="mb-4 rounded bg-gray-50 px-3 py-2 text-xs text-gray-500">
              Buying this item directly. Your cart is untouched.
            </p>
          )}
          {/*
            A HEADER ROW over the lines, so the right-hand column is labelled
            rather than left as bare numbers a shopper has to interpret. It is
            the one thing the old block had no room for.
          */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
            <span>Product</span>
            <span>Subtotal</span>
          </div>
          <div className="max-h-96 divide-y divide-gray-100 overflow-y-auto" data-lenis-prevent>
            {displayLines.map((line) => (
              <div key={line.id} className="flex gap-3 py-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                  {line.image && (
                    <Image src={line.image} alt={line.name} fill className="object-cover" />
                  )}
                  {/*
                    The badge stays for a DIRECT order, which has no cart line to
                    step and so keeps the read-only quantity it always had.
                  */}
                  {directOrder && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-[10px] font-bold text-white">
                      {line.quantity}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {/*
                    TWO LINES, not one. At the old width a product name was cut
                    off mid-word, so "Hoco DB160 60000mAh 100W PD Fast Charging
                    Power Bank" and the 20000mAh model beside it were the same
                    truncated string — a shopper could not tell which one they
                    were buying. The wider column plus a second line fits a real
                    product name.
                  */}
                  <p className="line-clamp-2 text-sm font-medium text-gray-800">{line.name}</p>
                  {line.variantName && (
                    <p className="mt-0.5 text-xs text-gray-500">{line.variantName}</p>
                  )}
                  {/*
                    The same two controls the cart page uses, so a correction at
                    the moment of payment is the interaction the shopper has
                    already met rather than a new one.
                    
                    NOT offered for a direct order: its line is synthetic
                    (`id: "direct"`, and no cart line behind it), so a stepper
                    would PATCH an item id that does not exist.
                    
                    A change here moves `orderFingerprint`, which regenerates
                    the idempotency key — so the order submitted is the corrected
                    one and an attempt made before the change cannot be replayed
                    as if it were. That was already wired; see the fingerprint
                    above.
                  */}
                  {!directOrder && (
                    <div className="mt-2 flex items-center gap-3">
                      <CartQuantityControl line={line} />
                      <CartRemoveButton line={line} />
                    </div>
                  )}
                </div>
                <span className="shrink-0 text-sm font-semibold text-gray-900">
                  {formatPrice(line.lineTotal)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Subtotal</span>
              <span className="font-semibold text-gray-900">
                {formatPrice(quote?.subtotal ?? displaySubtotal)}
              </span>
            </div>
            {(quote?.discountAmount ?? displayDiscount) > 0 && (
              <div className="flex items-center justify-between text-green-700">
                <span className="font-medium">
                  Discount{cart.discountCode ? ` (${cart.discountCode})` : ""}
                </span>
                <span className="font-semibold">
                  -{formatPrice(quote?.discountAmount ?? displayDiscount)}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-gray-700">
              {/* Names the option the shopper chose, so the line they are about
                  to be charged is the one they picked rather than a generic
                  "Delivery" they have to map back onto a choice. */}
              <span className="font-semibold text-gray-900">
                {selectedOption?.label ?? (collecting ? "Collection" : "Delivery")}
              </span>
              <span className="font-semibold text-gray-900">
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
                  "Enter your address to view delivery fee"
                )}
              </span>
            </div>
            {quote && quote.taxAmount > 0 && (
              <div className="flex items-center justify-between text-gray-700">
                <span className="font-semibold text-gray-900">Tax</span>
                <span className="font-semibold text-gray-900">{formatPrice(quote.taxAmount)}</span>
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

          {/* The figure the shopper is actually agreeing to, sized so it is the
              largest thing in the card rather than one more row of the list. */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-xl font-bold text-sale">
              {quoting && !quote ? "…" : formatPrice(payableTotal)}
            </span>
          </div>
       
          {/* {!quote && !quoteRefusal && (
            <p className="mt-2 text-xs text-gray-400">
              {deliveryUnconfigured
                ? "This store has not set up delivery yet."
                : asksForOption
                  ? "Delivery and tax are added once you choose an option."
                  : "Delivery and tax are added once you choose your district and area."}
            </p>
          )} */}

          {/*
            THE PAYMENT STEP, DIRECTLY UNDER THE TOTAL IT IS ABOUT.

            It used to open below the chosen delivery option in the left column,
            which put "send ৳80 now" a column away from the ৳1,480 the shopper
            was reading, and left the summary card as something to check on the
            way past rather than the thing being agreed to. Here the sequence is
            one column: what is being bought, what it comes to, what to send now,
            and the button.

            Mounted ONCE, for whichever option is selected — never one copy per
            option with all but one hidden. Two mounted claim forms would put two
            sets of the same fields in the page, and a half-typed transaction id
            left behind in the hidden one is money quoted at one price attached
            to an order placed at another.

            Keyed on the option so changing area remounts it: the panel
            re-animates, saying plainly that the figures in it now belong to a
            different delivery charge.

            `animate-menu-in` because the panel MOUNTS rather than toggling a
            class — there is nothing for a transition to run between, which is
            the same reason the header's dropdowns use this keyframe. Paired with
            `motion-reduce:animate-none`, which leaves the panel and takes only
            the movement.
          */}
          {showsPaymentStep && (
            <div
              key={optionKeyInForce}
              className="animate-menu-in mt-5 border-t border-gray-200 pt-5 motion-reduce:animate-none"
            >
              <AdvancePaymentSection
                config={advanceConfig}
                splits={advanceSplits}
                claim={advanceClaim}
                errors={advanceErrors}
                onChange={patchAdvanceClaim}
                quoting={quoting}
              />
            </div>
          )}

          {/* Moved down here with the button it is about. A placement failure
              read three sections above the control that failed was a message
              the shopper had to go looking for. */}
          {error && (
            <div
              role="alert"
              className={clsx(
                "mt-5 flex items-start gap-2 rounded border px-4 py-3 text-sm",
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

          <div className="mt-5">
            {/* The merchant's notice used to be here, above the button. It is
                now under the page title — see the note there. */}
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
                  : !optionKeyInForce
                    ? asksForOption
                      ? "Choose a delivery option to continue."
                      : "Choose your district and area to continue."
                    : /*
                       * The advance reasons come before the catch-all, because
                       * "fix the problem above" points at nothing when the
                       * problem is a field that was never filled in. The waived
                       * charge is named outright: a shopper looking at "Free
                       * delivery" and a disabled button has no way to guess that
                       * the delivery-charge choice is what is blocking it.
                       */
                      payingInAdvance &&
                        selectedAdvance !== null &&
                        selectedAdvance.advanceAmount <= 0
                      ? "Delivery is free on this order, so there is nothing to pay in advance. Choose Full payment to continue."
                      : payingInAdvance && !advanceClaim.accountId
                        ? "Choose the account you sent the payment to."
                        : payingInAdvance &&
                            (!advanceClaim.senderIdentifier.trim() ||
                              !advanceClaim.transactionId.trim())
                          ? "Enter the number you paid from and your transaction id."
                          : "Please fix the problem above to continue."}
              </p>
            )}
          </div>
          </div>
        </div>
      </form>
    </div>
  );
}
