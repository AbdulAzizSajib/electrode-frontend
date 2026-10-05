"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { formatPrice } from "@/lib/format";
import { trackLandingPagePurchase } from "@/components/landing/FacebookPixel";
import DestinationField from "@/components/account/DestinationField";
import {
  refusalMessage,
  resolveDeliveryOption,
  type Destination,
} from "@/lib/delivery-destination";
import AdvancePaymentSection, {
  claimedMethod,
  defaultAdvanceClaim,
  EMPTY_ADVANCE_CLAIM,
  type AdvanceClaimDraft,
  type AdvanceClaimErrors,
} from "@/components/checkout/AdvancePaymentSection";
import type {
  LandingPage,
  LandingPageQuoteResult,
} from "@/types/landing-page";
import { cloudinaryUrl } from "@/lib/cloudinary-url";

/**
 * The whole checkout for a campaign page: a quantity, a delivery area, three
 * fields, one button.
 *
 * No cart, no checkout page, no account. The product is already chosen — the
 * shopper's only decisions are how many and where to.
 *
 * TOTALS ARE NEVER COMPUTED HERE. Every figure shown comes from the server's
 * own quote endpoint, which prices the order through the same code that will
 * charge it. Multiplying the price in the browser would be a second answer to
 * "what does this cost", and tax comes from the product's own rule, which this
 * component has no way to know.
 */

/** Long enough to not quote on every keystroke of the stepper, short enough to feel live. */
const QUOTE_DEBOUNCE_MS = 250;

type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "failed"; message: string }
  | { status: "placed"; orderNumber: string; total: number };

export default function LandingOrderForm({
  page,
  currency,
  pixelId,
}: {
  page: LandingPage;
  currency: string;
  /**
   * The pixel this page reports to, already resolved — the page's own if it has
   * one, otherwise the shop-wide one, otherwise null.
   *
   * Passed in rather than read off `page` here, so the precedence decision lives
   * in exactly one place (`lib/facebook-pixel.ts`) and the view and the purchase
   * event cannot disagree about which pixel this page belongs to.
   */
  pixelId: string | null;
}) {
  const { orderForm, deliveryOptions, productSnapshot } = page;
  const packages = page.packages ?? [];

  /*
   * WHICH TIER is selected, when the page offers any.
   *
   * Seeded from the merchant's own preselection, else the first — the same rule
   * the server's resolver applies, so the page opens showing what the server
   * would price if the shopper submitted without touching anything.
   *
   * Empty string for a page with no packages, which then sends no `packageKey`
   * and is priced from its bound product exactly as before packages existed.
   */
  const [packageKey, setPackageKey] = useState(
    () => packages.find((pkg) => pkg.preselected)?.key ?? packages[0]?.key ?? "",
  );

  /*
   * THE SAME SECTION THE SHOP'S CHECKOUT RENDERS, imported rather than copied.
   * A shopper meets one payment form in both places, and a fix to either
   * reaches both — which is what stops the two drifting into subtly different
   * rules about money someone has already sent.
   *
   * Driven by `advancePayment`, NOT by `requiresAdvancePayment`: the server has
   * already resolved the campaign's switch against the shop's accounts, so a
   * campaign that asks but whose shop has none arrives with null here and the
   * section simply does not render.
   */
  const advanceConfig = page.advancePayment;
  const advanceOffered = advanceConfig !== null;

  const [advanceClaim, setAdvanceClaim] = useState<AdvanceClaimDraft>(() =>
    advanceConfig ? defaultAdvanceClaim(advanceConfig) : EMPTY_ADVANCE_CLAIM,
  );
  const [advanceErrors, setAdvanceErrors] = useState<AdvanceClaimErrors>({});

  const patchAdvanceClaim = (patch: Partial<AdvanceClaimDraft>) => {
    setAdvanceClaim((prev) => ({ ...prev, ...patch }));
    // Clear only the fields that were touched, so a message stays on a field
    // the shopper has not revisited — which is where they still need to see it.
    setAdvanceErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch) as (keyof AdvanceClaimDraft)[]) {
        delete next[key as keyof AdvanceClaimErrors];
      }
      return next;
    });
  };

  const [quantity, setQuantity] = useState(1);
  /*
   * WHERE THE ORDER IS GOING, and — only when that resolves to nothing the shop
   * has configured — which option the shopper picked instead.
   *
   * The same pattern the shop's checkout uses. A campaign no longer asks the
   * shopper to classify their own address into a delivery band: someone in
   * Savar was guessing whether that counted as "আশেপাশে" or "বাইরে", and the
   * difference was the merchant's money either way.
   */
  const [destination, setDestination] = useState<Destination | null>(null);
  const [chosenOptionKey, setChosenOptionKey] = useState<string | null>(null);

  /*
   * THE OPTION IN FORCE: derived when the destination decided one, otherwise the
   * one the shopper picked off the cards — and the cards are shown exactly when
   * nothing was derived. One of the two and never both, so there is a single key
   * to quote against and to submit.
   */
  const destinationResolution = resolveDeliveryOption(destination, deliveryOptions);
  const derivedOption = destinationResolution.resolved ? destinationResolution.option : null;

  const selectedOption =
    derivedOption ?? deliveryOptions.find((option) => option.key === chosenOptionKey) ?? null;
  const optionKeyInForce = selectedOption?.key ?? null;

  /*
   * THE CARDS ARE THE WAY OUT, NOT THE FIRST QUESTION. They appear only after a
   * destination has been given and failed to resolve — asking someone to pick a
   * delivery band before they have said where they are is the question this
   * change removed.
   */
  const refusal = destinationResolution.resolved ? null : destinationResolution.reason;
  const askForOption = refusal !== null && refusal !== "NO_DESTINATION";
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [quote, setQuote] = useState<LandingPageQuoteResult | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [submit, setSubmit] = useState<SubmitState>({ status: "idle" });

  /*
   * One key per order attempt, generated on FIRST SUBMIT and reused by every
   * retry of that same attempt — which is exactly what makes a retry idempotent.
   *
   * Generated in the submit handler rather than during render, and deliberately
   * so: a key created during the server render would be baked into the HTML and
   * shared by every visitor served that cached page, which would make the second
   * shopper's order look like a replay of the first's and hand them back
   * somebody else's order confirmation.
   */
  const idempotencyKey = useRef<string>("");

  const placed = submit.status === "placed";
  const orderable = productSnapshot.isOrderable;

  /*
   * Re-quotes whenever the quantity or the zone changes, debounced.
   *
   * A submit that races an in-flight quote is not prevented here — it is caught
   * by `expectedTotal` on the server, which refuses an order whose expected
   * total disagrees with the computed one. Guarding it client-side as well
   * would be a second, weaker copy of a check that already exists.
   */
  useEffect(() => {
    if (!optionKeyInForce || placed || !orderable) return;

    let cancelled = false;

    const timer = setTimeout(async () => {
      if (cancelled) return;
      setQuoting(true);

      try {
        const response = await fetch(
          `/api/landing-pages/${encodeURIComponent(page.slug)}/quote`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quantity,
              deliveryOptionKey: optionKeyInForce,
              // Omitted entirely on a page with no packages, so the server
              // resolves the bound product rather than a key it cannot match.
              ...(packageKey ? { packageKey } : {}),
            }),
          },
        );

        const payload = await response.json().catch(() => null);

        if (cancelled) return;

        // A failed quote clears the total rather than leaving a stale one on
        // screen. A number that no longer matches the selection is worse than
        // no number: the shopper would agree to it.
        setQuote(response.ok && payload?.data ? payload.data : null);
      } catch {
        if (!cancelled) setQuote(null);
      } finally {
        if (!cancelled) setQuoting(false);
      }
    }, QUOTE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    /*
     * `packageKey` is a dependency, so switching tier RE-QUOTES. Without it the
     * shopper would pick ১ কেজি and still see ৫০০ গ্রাম's total — and then
     * submit that stale figure as `expectedTotal`, which the server refuses.
     */
  }, [page.slug, quantity, optionKeyInForce, packageKey, placed, orderable]);

  // No `useCallback`: this project compiles with the React Compiler, which
  // memoizes automatically and refuses to compile a component whose manual
  // memoization it cannot preserve. Hand-written dependency arrays here would
  // be both redundant and a source of stale closures.
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (submit.status === "submitting") return;

    if (!optionKeyInForce) {
      setSubmit({ status: "failed", message: "ডেলিভারি এলাকা নির্বাচন করুন" });
      return;
    }

    // First submit mints the key; every retry of this attempt reuses it, which
    // is what makes the retry idempotent rather than a second order.
    if (!idempotencyKey.current) {
      idempotencyKey.current = crypto.randomUUID();
    }

    setSubmit({ status: "submitting" });

    try {
      const response = await fetch(
        `/api/landing-pages/${encodeURIComponent(page.slug)}/order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Forwarded by the proxy. A shopper who double-taps Submit on a
            // slow connection gets one order, not two.
            "Idempotency-Key": idempotencyKey.current,
          },
          body: JSON.stringify({
            quantity,
            deliveryOptionKey: optionKeyInForce,
            /*
             * The place itself, beside the option it resolved to. The order
             * records where it is going, not just which band it fell into —
             * same shape a shop order captures.
             */
            ...(destination ? { destination } : {}),
            ...(packageKey ? { packageKey } : {}),
            fullName: fullName.trim() || undefined,
            phone: phone.trim(),
            address: address.trim(),
            notes: notes.trim() || undefined,
            // The last total the shopper actually saw. The server refuses the
            // order if its own figure disagrees, so a price that changed
            // between page load and submit is reported rather than charged.
            expectedTotal: quote?.totalAmount,
            /*
             * The claim, only when this campaign asks for one. The method comes
             * from the account the shopper picked — the server derives it from
             * the account too and would refuse a mismatch, so sending it is an
             * agreement check rather than an instruction.
             */
            ...(advanceConfig && advanceClaim.choice && advanceClaim.accountId
              ? {
                  /*
                   * DERIVED FROM THE ACCOUNT, through the shared helper. Sent so
                   * the request is well-formed; the server re-derives it from
                   * the same account, because a shopper who could name a bKash
                   * account and declare it Nagad would send staff to the wrong
                   * statement to verify it.
                   */
                  paymentMethod: claimedMethod(advanceConfig, advanceClaim.accountId),
                  advancePayment: {
                    choice: advanceClaim.choice,
                    accountId: advanceClaim.accountId,
                    senderIdentifier: advanceClaim.senderIdentifier.trim(),
                    transactionId: advanceClaim.transactionId.trim(),
                    // The figure the shopper was shown, echoed back so a stale
                    // page is refused rather than accepted for a different sum.
                    expectedAdvanceAmount:
                      quote?.advanceOptions?.[advanceClaim.choice]?.advanceAmount,
                  },
                }
              : {}),
          }),
        },
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        /*
         * The backend's own message, verbatim — it names the product that is
         * out of stock and the quantity available, and it writes a price
         * mismatch in the merchant's own currency format. Replacing it with a
         * generic failure would throw away the only thing the shopper can act
         * on.
         *
         * `errorSources` FIRST, and that is not a preference. On a validation
         * failure the envelope's top-level `message` is the literal string
         * "Zod Validation Error" — an internal English label — and the reason
         * the shopper could act on is in `errorSources[0]`. Reading `message`
         * alone put that label above the order button of a Bangla campaign
         * page, which is how a stray key in the destination object looked to
         * everyone who hit it. `lib/api-client.ts` has taken this order since
         * it was written; this path predates using it and never did.
         */
        setSubmit({
          status: "failed",
          message:
            payload?.errorSources?.[0]?.message ||
            payload?.message ||
            "অর্ডারটি সম্পন্ন করা যায়নি। একটু পরে আবার চেষ্টা করুন।",
        });
        return;
      }

      const order = payload?.data;
      const total = Number(order?.totalAmount ?? quote?.totalAmount ?? 0);

      setSubmit({
        status: "placed",
        orderNumber: order?.orderNumber ?? "",
        total,
      });

      /*
       * The order's id is the deduplication key: the server reports this same
       * purchase to the Conversions API under it, and Meta collapses the pair
       * into one conversion. Omitting it double-counts every sale.
       */
      trackLandingPagePurchase(pixelId, total, currency, order?.id);
    } catch {
      setSubmit({
        status: "failed",
        message: "নেটওয়ার্ক সমস্যা হয়েছে। সংযোগ দেখে আবার চেষ্টা করুন।",
      });
    }
  };

  if (placed) {
    return (
      <SuccessPanel
        heading={page.successHeading}
        message={page.successMessage}
        orderNumber={submit.orderNumber}
      />
    );
  }

  if (!orderable) {
    return (
      <div
        id="order-form"
        className="rounded-2xl border border-lp-border bg-lp-surface-alt p-6 text-center"
      >
        <p className="font-semibold text-lp-text">এই মুহূর্তে পণ্যটি পাওয়া যাচ্ছে না</p>
        <p className="mt-1 text-sm text-lp-muted">
          স্টকে এলে আবার অর্ডার করা যাবে। খোঁজ নিতে আমাদের সাথে যোগাযোগ করুন।
        </p>
      </div>
    );
  }


  return (
    <form
      id="order-form"
      onSubmit={handleSubmit}
      /*
        A HEAVIER CARD than anything else on the page, with an accent top edge.
        Every call to action points here, and a form that looks like the cards
        around it gives a reader arriving from one of those buttons nothing to
        land on. The top border is the cheapest way to say "this is the thing"
        without colouring the whole panel and hurting the fields' legibility.
      */
      className="rounded-2xl border border-lp-border border-t-4 border-t-lp-accent bg-lp-surface p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] md:p-6"
      // Bangla-first content, and the browser is told so — it drives hyphenation
      // and the spellchecker. The attribute follows the merchant's content, not
      // a locale setting, because there is no locale setting.
      lang="bn"
    >
      {orderForm.heading && (
        <h2 className="text-center text-lg font-bold text-lp-text md:text-xl">
          {orderForm.heading}
        </h2>
      )}
      {orderForm.subheading && (
        <p className="mt-1.5 text-center text-sm leading-relaxed text-lp-muted">
          {orderForm.subheading}
        </p>
      )}

      <div className="mt-5 space-y-4">
        <Field
          id="lp-name"
          label={orderForm.fields.fullName.label}
          helper={orderForm.fields.fullName.helper}
          required={orderForm.fields.fullName.required}
        >
          <input
            id="lp-name"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder={orderForm.fields.fullName.placeholder}
            required={orderForm.fields.fullName.required}
            autoComplete="name"
            className={inputClass}
          />
        </Field>

        <Field
          id="lp-phone"
          label={orderForm.fields.phone.label}
          helper={orderForm.fields.phone.helper}
          required
        >
          <input
            id="lp-phone"
            // `tel`, and `inputMode` with it: this opens the numeric keypad on
            // the phones that most of this traffic arrives on.
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder={orderForm.fields.phone.placeholder}
            required
            autoComplete="tel"
            className={inputClass}
          />
        </Field>

        {/*
          WHERE IT IS GOING, asked once, and asked BEFORE the street address.

          The district decides what delivery costs, so it is the question the
          rest of the form depends on — picking it re-quotes the order and
          clears any delivery option chosen under a previous one. Asked after
          the address it inverted the order of the shopper's own thought: they
          had already written out a full address, and were then asked to name
          the district again from a list, which reads as being asked the same
          thing twice.

          Narrow-to-wide is also how the rest of the form runs — district, then
          the street within it — and it is the order the courier slip is read in.

          The same component the shop's checkout and the saved-address form use,
          so the same address means the same thing whichever form captured it.
        */}
        <DestinationField
          id="lp-destination"
          label="জেলা / এলাকা"
          themed
          value={destination}
          onChange={(next) => {
            setDestination(next);
            // A new destination re-decides everything: a card picked under the
            // old one must not survive into a place it was never chosen for.
            setChosenOptionKey(null);
          }}
        />

        {/*
          The fallback, reached only after a destination failed to resolve — an
          unserved district, or a band the merchant has not priced. The reason is
          stated rather than left as a silent reappearance of cards.

          Kept DIRECTLY BELOW the picker that causes it. It is the answer to the
          district just chosen, and several fields further down it would appear
          somewhere the shopper is no longer looking — a price they never
          knowingly agreed to.
        */}
        {askForOption && (
          <DeliveryOptionChoice
            options={deliveryOptions}
            value={chosenOptionKey}
            onChange={setChosenOptionKey}
            reason={refusalMessage(refusal)}
          />
        )}

        <Field
          id="lp-address"
          label={orderForm.fields.address.label}
          helper={orderForm.fields.address.helper}
          required
        >
          <textarea
            id="lp-address"
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder={orderForm.fields.address.placeholder}
            required
            rows={3}
            autoComplete="street-address"
            className={clsx(inputClass, "resize-y")}
          />
        </Field>

        {/*
          DIRECTLY AFTER THE ADDRESS, because it is a note ABOUT the address and
          the delivery — "leave it in the afternoon", "ring the other bell". Kept
          with the where-to-send-it block, the shopper writes it while that is
          still what they are thinking about.

          It is optional, and it used to sit at the very end for that reason. But
          the end of this form is the package, the payment and the total — money
          decisions — and an optional free-text box dropped in among those is a
          pause at the worst possible moment, right before the submit button.
        */}
        <Field id="lp-notes" label="অতিরিক্ত তথ্য (ঐচ্ছিক)">
          {/* Every other field on this form says what belongs in it; this one
              rendered as an unexplained empty box, which on an OPTIONAL field
              reads as something the shopper has failed to fill in rather than
              something they may skip. */}
          <textarea
            id="lp-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="যেমন: বিকেলে ডেলিভারি দিন, অন্য রঙ চাই"
            rows={2}
            className={clsx(inputClass, "resize-y")}
          />
        </Field>

        <PackagePicker packages={packages} value={packageKey} onChange={setPackageKey} />

        {/*
          The SAME component the shop's checkout renders. Shown only when the
          server resolved a config for this campaign, so a page whose shop has
          no accounts shows nothing rather than a form that cannot be submitted.

          `themed` is what makes it belong to THIS page. The panel draws in `lp-*`
          tokens throughout, and this page's wrapper has redefined those to the
          merchant's colours — but its two claim fields come from the account
          forms' shared `Field`, whose greys are NOT what those tokens resolve to.
          Without the flag the step renders a grey slab in the middle of a themed
          page; with it, only this caller moves and the shop checkout is untouched.
        */}
        {advanceConfig && (
          <AdvancePaymentSection
            config={advanceConfig}
            splits={quote?.advanceOptions ?? null}
            claim={advanceClaim}
            errors={advanceErrors}
            onChange={patchAdvanceClaim}
            quoting={quoting}
            themed
          />
        )}
      </div>

      <OrderSummary
        quote={quote}
        quoting={quoting}
        zoneLabel={selectedOption?.label}
        productName={productSnapshot.name}
        quantity={quantity}
        onQuantityChange={setQuantity}
        maxQuantity={productSnapshot.available}
        packageLabel={packages.find((pkg) => pkg.key === packageKey)?.label}
        imageUrl={productSnapshot.images[0]?.url}
      />

      {submit.status === "failed" && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-sale/30 bg-sale/5 px-3 py-2 text-sm text-sale"
        >
          {submit.message}
        </p>
      )}

      <button
        type="submit"
        disabled={submit.status === "submitting" || !optionKeyInForce}
        className="mt-5 w-full rounded-xl bg-lp-accent px-4 py-3.5 text-base font-semibold text-lp-accent-contrast transition hover:bg-lp-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submit.status === "submitting" ? "পাঠানো হচ্ছে…" : orderForm.submitLabel}
      </button>

      {orderForm.notice && (
        <p className="mt-3 text-center text-xs text-lp-muted">{orderForm.notice}</p>
      )}
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-lp-border px-3 py-2.5 text-base text-lp-text outline-none transition focus:border-lp-accent focus:ring-2 focus:ring-lp-accent/20";

function Field({
  id,
  label,
  helper,
  required,
  children,
}: {
  id: string;
  label: string;
  helper?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-lp-text">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-sale">
            *
          </span>
        )}
      </label>
      {children}
      {helper && <p className="mt-1 text-xs text-lp-muted">{helper}</p>}
    </div>
  );
}

/**
 * Floors at 1 — an order for nothing is not an order — and caps at what is
 * actually in stock, so the shopper is stopped here rather than by a rejection
 * after they have filled in their address.
 *
 * IT SITS IN THE SUMMARY, on the line that names the product, rather than as a
 * field of its own further up. As a separate field its effect reached the
 * figures only as a larger "পণ্যের মূল্য": a shopper who raised the count to two
 * read a subtotal against a line naming one product and could not tell a
 * doubled price from a wrong one. On the line it multiplies, the count and what
 * it costs are one glance apart — the way a cart line reads.
 *
 * The visible "পরিমাণ" label goes with the move. On its own line a control needs
 * a heading; beside the product and its price the stepper is self-evident, and a
 * label there would be a third piece of text competing with the two that carry
 * the decision. The name survives for assistive tech on the group and on each
 * button.
 */
function QuantityStepper({
  value,
  onChange,
  max,
}: {
  value: number;
  onChange: (next: number) => void;
  max: number;
}) {
  const ceiling = Math.max(1, Math.min(max, 100));

  return (
    <div className="ml-auto shrink-0 text-right">
      <div
        role="group"
        aria-label="পরিমাণ"
        className="inline-flex items-center rounded-lg border border-lp-border bg-lp-surface"
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          aria-label="পরিমাণ কমান"
          className="grid size-11 place-items-center text-lg text-lp-muted disabled:opacity-40"
        >
          −
        </button>
        <span aria-live="polite" className="w-8 text-center text-base font-semibold">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(ceiling, value + 1))}
          disabled={value >= ceiling}
          aria-label="পরিমাণ বাড়ান"
          className="grid size-11 place-items-center text-lg text-lp-muted disabled:opacity-40"
        >
          +
        </button>
      </div>
      {value >= ceiling && (
        <p className="mt-1 text-xs text-lp-muted">স্টকে আছে {ceiling}টি</p>
      )}
    </div>
  );
}

/**
 * The tier picker — ৫০০ গ্রাম beside ১ কেজি, each with its own price.
 *
 * CARDS RATHER THAN A DROPDOWN, because the comparison IS the decision: a
 * shopper weighing two sizes needs both prices, both struck-through figures and
 * both free gifts visible at once. A select hides every option but one and
 * turns a comparison into a memory test.
 *
 * Renders nothing when the page offers no packages — that page sells its bound
 * product at one price, and a picker with a single option is a control that
 * cannot be used.
 */
function PackagePicker({
  packages,
  value,
  onChange,
}: {
  packages: NonNullable<LandingPage["packages"]>;
  value: string;
  onChange: (next: string) => void;
}) {
  if (!packages.length) return null;

  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-lp-text">
        প্যাকেজ বেছে নিন
        <span aria-hidden className="ml-0.5 text-sale">
          *
        </span>
      </legend>
      <div className="grid gap-2.5 sm:grid-cols-2">
        {packages.map((pkg) => {
          const selected = value === pkg.key;

          return (
            <label
              key={pkg.key}
              className={clsx(
                "relative flex cursor-pointer flex-col gap-1 rounded-lg border p-3 transition",
                selected
                  ? "border-lp-accent bg-lp-accent-soft ring-1 ring-lp-accent"
                  : "border-lp-border hover:border-lp-border",
              )}
            >
              {/*
                The merchant's own ribbon — "হট অফার". Positioned over the card's
                edge rather than inline, so a package with one and a package
                without still line up.
              */}
              {pkg.badge && (
                <span className="absolute -top-2 right-2 rounded-full bg-sale px-2 py-0.5 text-[10px] font-semibold text-white">
                  {pkg.badge}
                </span>
              )}

              <span className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="landingPackage"
                  value={pkg.key}
                  checked={selected}
                  onChange={() => onChange(pkg.key)}
                  className="size-4 shrink-0 accent-[var(--color-brand)]"
                />
                <span className="text-sm font-medium text-lp-text">{pkg.label}</span>
              </span>

              <span className="flex items-baseline gap-2 pl-6.5">
                <span className="text-base font-bold text-lp-text">
                  {formatPrice(pkg.price)}
                </span>
                {/*
                  The struck-through figure is the PACKAGE's own, never the
                  product's — a ৫০০ গ্রাম "was" price shown against a ১ কেজি
                  package would advertise a far bigger discount than the
                  merchant offered.
                */}
                {typeof pkg.compareAtPrice === "number" && (
                  <span className="text-xs text-lp-muted line-through">
                    {formatPrice(pkg.compareAtPrice)}
                  </span>
                )}
              </span>

              {pkg.freeGiftText && (
                <span className="pl-6.5 text-xs font-medium text-lp-success">
                  {pkg.freeGiftText}
                </span>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * The shop's delivery options, shown when a destination resolved to none of
 * them.
 *
 * NOT the opening question. A campaign asks where the order is going and works
 * the charge out; this is what happens when it cannot — an unserved district,
 * or a band the merchant has configured no option for. The reason is shown
 * with it, because cards appearing with no explanation read as the form having
 * changed its mind.
 */
function DeliveryOptionChoice({
  options,
  value,
  onChange,
  reason,
}: {
  options: LandingPage["deliveryOptions"];
  value: string | null;
  onChange: (next: string) => void;
  reason: string | null;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-lp-text">
        ডেলিভারি এলাকা
        <span aria-hidden className="ml-0.5 text-sale">
          *
        </span>
      </legend>

      {reason && <p className="mb-2 text-xs text-lp-muted">{reason}</p>}

      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.key}
            className={clsx(
              "flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2.5 transition",
              value === option.key
                ? "border-lp-accent bg-lp-accent-soft"
                : "border-lp-border hover:border-lp-border",
            )}
          >
            <span className="flex items-center gap-2.5">
              <input
                type="radio"
                name="landingDeliveryOption"
                value={option.key}
                checked={value === option.key}
                onChange={() => onChange(option.key)}
                className="size-4 accent-[var(--color-brand)]"
              />
              <span className="text-sm text-lp-text">{option.label}</span>
            </span>
            <span className="text-sm font-semibold text-lp-text">
              {option.price === 0 ? "ফ্রি" : formatPrice(option.price)}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * The server's figures, never arithmetic of our own.
 *
 * Tax is shown only when there is any: a "৳0 tax" row on a page selling an
 * untaxed product is noise the shopper has to read past.
 */
/**
 * What is being bought, and what it comes to.
 *
 * IT NAMES THE THING FIRST. This used to open at "পণ্যের মূল্য" — a price with
 * no subject — so a shopper who had scrolled past the package cards and was
 * looking at the figure they were about to pay had nothing on screen saying
 * WHICH tier it was for. On a page whose whole job is to sell one product in
 * one scroll, the last block before the button is exactly where that has to be
 * unambiguous: the tiers differ in price AND in what ships, and the only thing
 * distinguishing ৯৯০ from ১৩৯০ was a card further up.
 *
 * The thumbnail is the product's first image, the same one the gallery opens
 * on, so the summary shows the thing the page has been showing throughout.
 * Omitted entirely when the product has no image rather than reserving an empty
 * square — a missing thumbnail costs the picture, not the alignment.
 */
function OrderSummary({
  quote,
  quoting,
  zoneLabel,
  productName,
  quantity,
  onQuantityChange,
  maxQuantity,
  packageLabel,
  imageUrl,
}: {
  quote: LandingPageQuoteResult | null;
  quoting: boolean;
  zoneLabel?: string;
  productName: string;
  /** What the stepper is on, so the summary can say what the subtotal counts. */
  quantity: number;
  onQuantityChange: (next: number) => void;
  /** Stock ceiling, passed through to the stepper. */
  maxQuantity: number;
  /** The chosen tier, e.g. "২ পিস কম্বো". Absent on a page with no packages. */
  packageLabel?: string;
  imageUrl?: string;
}) {
  return (
    <dl
      aria-busy={quoting}
      className="mt-5 space-y-2 rounded-xl bg-lp-surface-alt p-4 text-sm"
    >
      {/*
        NOT a <dt>/<dd> pair: this is the subject the list below describes, not
        another term-and-value row in it. It sits above the border-less rows as a
        heading would.
      */}
      <div className="flex items-center gap-3 border-b border-lp-border pb-3">
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- merchant-supplied host, not in next.config's allow-list
          <img
            src={cloudinaryUrl(imageUrl, { width: 96, height: 96 })}
            alt=""
            className="size-12 shrink-0 rounded-lg border border-lp-border bg-lp-surface object-cover"
            loading="lazy"
          />
        )}
        <div className="min-w-0">
          <p className="font-semibold text-lp-text">{productName}</p>
          {/*
            Only when it SAYS something the name does not. A package tier often
            resolves a product named after the tier itself — this campaign's
            "২ পিস কম্বো" tier ships a product called "২ পিস কম্বো" — and printing
            both puts the same words on two lines, which reads as a rendering
            fault rather than as two facts.
          */}
          {packageLabel && packageLabel.trim() !== productName.trim() && (
            <p className="mt-0.5 text-xs text-lp-muted">{packageLabel}</p>
          )}
        </div>
        <QuantityStepper value={quantity} onChange={onQuantityChange} max={maxQuantity} />
      </div>

      {/*
        THE FIGURES DIM WHILE RE-QUOTING, the stepper above them does not.
        The whole card used to carry the opacity, which was fine while every
        control lived elsewhere — now the stepper sits inside it, and a shopper
        tapping + watched the very button under their finger fade as the request
        it fired went out. Only the numbers are stale during a quote; the control
        that changes them is not.
      */}
      <div className={clsx("space-y-2 transition-opacity", quoting && "opacity-60")}>
        <Row label="পণ্যের মূল্য" value={quote && formatPrice(quote.subtotal)} />
        {quote && quote.taxAmount > 0 && (
          <Row label="ট্যাক্স" value={formatPrice(quote.taxAmount)} />
        )}
        <Row
          label={zoneLabel ? `ডেলিভারি (${zoneLabel})` : "ডেলিভারি"}
          value={
            quote && (quote.shippingAmount === 0 ? "ফ্রি" : formatPrice(quote.shippingAmount))
          }
        />
        <div className="flex items-baseline justify-between border-t border-lp-border pt-2">
          <dt className="text-base font-semibold text-lp-text">সর্বমোট</dt>
          <dd className="text-lg font-bold text-lp-text">
            {quote ? formatPrice(quote.totalAmount) : "—"}
          </dd>
        </div>
      </div>
    </dl>
  );
}

function Row({ label, value }: { label: string; value: string | null | false }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-lp-muted">{label}</dt>
      <dd className="font-medium text-lp-text">{value || "—"}</dd>
    </div>
  );
}

/**
 * The confirmation, shown in place.
 *
 * Deliberately does not navigate away: the shopper arrived from an ad on one
 * page, and sending them to a checkout-success route on a site they have never
 * seen is a worse ending than finishing where they started.
 *
 * The tracking instructions matter more here than on the normal checkout — this
 * shopper has no account and no order history, so the order number and the
 * phone they used are the only way back to their order.
 */
function SuccessPanel({
  heading,
  message,
  orderNumber,
}: {
  heading: string | null;
  message: string | null;
  orderNumber: string;
}) {
  return (
    <div
      id="order-form"
      role="status"
      className="rounded-2xl border border-lp-accent/30 bg-lp-accent-soft p-6 text-center"
    >
      <p className="text-lg font-semibold text-lp-text">
        {heading || "ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে।"}
      </p>
      <p className="mt-2 text-sm text-lp-muted">
        {message || "আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবে।"}
      </p>

      {orderNumber && (
        <p className="mt-4 rounded-lg bg-lp-surface px-4 py-3 text-sm">
          <span className="text-lp-muted">অর্ডার নম্বর</span>
          <br />
          <strong className="text-base tracking-wide text-lp-text">{orderNumber}</strong>
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-lp-muted">
        এই অর্ডার নম্বর এবং আপনার মোবাইল নম্বর দিয়ে{" "}
        <Link href="/track-order" className="font-medium text-lp-accent underline">
          ট্র্যাক অর্ডার
        </Link>{" "}
        পেজ থেকে যেকোনো সময় অর্ডারের অবস্থা দেখতে পারবেন।
      </p>
    </div>
  );
}
