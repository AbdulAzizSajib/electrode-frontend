"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { formatPrice } from "@/lib/format";
import { trackLandingPagePurchase } from "@/components/landing/FacebookPixel";
import type {
  LandingPage,
  LandingPageQuoteResult,
} from "@/types/landing-page";

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
}: {
  page: LandingPage;
  currency: string;
}) {
  const { orderForm, deliveryZones, productSnapshot } = page;

  const [quantity, setQuantity] = useState(1);
  const [zoneKey, setZoneKey] = useState(deliveryZones[0]?.key ?? "");
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
    if (!zoneKey || placed || !orderable) return;

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
            body: JSON.stringify({ quantity, zoneKey }),
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
  }, [page.slug, quantity, zoneKey, placed, orderable]);

  // No `useCallback`: this project compiles with the React Compiler, which
  // memoizes automatically and refuses to compile a component whose manual
  // memoization it cannot preserve. Hand-written dependency arrays here would
  // be both redundant and a source of stale closures.
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (submit.status === "submitting") return;

    if (!zoneKey) {
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
            zoneKey,
            fullName: fullName.trim() || undefined,
            phone: phone.trim(),
            address: address.trim(),
            notes: notes.trim() || undefined,
            // The last total the shopper actually saw. The server refuses the
            // order if its own figure disagrees, so a price that changed
            // between page load and submit is reported rather than charged.
            expectedTotal: quote?.totalAmount,
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
         */
        setSubmit({
          status: "failed",
          message:
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

      trackLandingPagePurchase(page.facebookPixelId, total, currency);
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
        className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center"
      >
        <p className="font-semibold text-gray-900">এই মুহূর্তে পণ্যটি পাওয়া যাচ্ছে না</p>
        <p className="mt-1 text-sm text-gray-600">
          স্টকে এলে আবার অর্ডার করা যাবে। খোঁজ নিতে আমাদের সাথে যোগাযোগ করুন।
        </p>
      </div>
    );
  }

  const selectedZone = deliveryZones.find((zone) => zone.key === zoneKey);

  return (
    <form
      id="order-form"
      onSubmit={handleSubmit}
      className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6"
      // Bangla-first content, and the browser is told so — it drives hyphenation
      // and the spellchecker. The attribute follows the merchant's content, not
      // a locale setting, because there is no locale setting.
      lang="bn"
    >
      {orderForm.heading && (
        <h2 className="text-lg font-semibold text-gray-900">{orderForm.heading}</h2>
      )}
      {orderForm.subheading && (
        <p className="mt-1 text-sm text-gray-600">{orderForm.subheading}</p>
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

        <QuantityStepper value={quantity} onChange={setQuantity} max={productSnapshot.available} />

        <DeliveryZones
          zones={deliveryZones}
          value={zoneKey}
          onChange={setZoneKey}
        />

        <Field id="lp-notes" label="অতিরিক্ত তথ্য (ঐচ্ছিক)">
          <textarea
            id="lp-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={2}
            className={clsx(inputClass, "resize-y")}
          />
        </Field>
      </div>

      <OrderSummary
        quote={quote}
        quoting={quoting}
        zoneLabel={selectedZone?.label}
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
        disabled={submit.status === "submitting" || !zoneKey}
        className="mt-5 w-full rounded-xl bg-brand px-4 py-3.5 text-base font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submit.status === "submitting" ? "পাঠানো হচ্ছে…" : orderForm.submitLabel}
      </button>

      {orderForm.notice && (
        <p className="mt-3 text-center text-xs text-gray-500">{orderForm.notice}</p>
      )}
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-900 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

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
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-900">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-sale">
            *
          </span>
        )}
      </label>
      {children}
      {helper && <p className="mt-1 text-xs text-gray-500">{helper}</p>}
    </div>
  );
}

/**
 * Floors at 1 — an order for nothing is not an order — and caps at what is
 * actually in stock, so the shopper is stopped here rather than by a rejection
 * after they have filled in their address.
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
    <div>
      <span className="mb-1.5 block text-sm font-medium text-gray-900">পরিমাণ</span>
      <div className="inline-flex items-center rounded-lg border border-gray-300">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          aria-label="পরিমাণ কমান"
          className="grid size-11 place-items-center text-lg text-gray-700 disabled:opacity-40"
        >
          −
        </button>
        <span aria-live="polite" className="w-12 text-center text-base font-semibold">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(ceiling, value + 1))}
          disabled={value >= ceiling}
          aria-label="পরিমাণ বাড়ান"
          className="grid size-11 place-items-center text-lg text-gray-700 disabled:opacity-40"
        >
          +
        </button>
      </div>
      {value >= ceiling && (
        <p className="mt-1 text-xs text-gray-500">স্টকে আছে {ceiling}টি</p>
      )}
    </div>
  );
}

/**
 * The inside/outside Dhaka radio pair every Bangladeshi single-product page
 * carries — except the labels and the prices are the merchant's, not ours.
 */
function DeliveryZones({
  zones,
  value,
  onChange,
}: {
  zones: LandingPage["deliveryZones"];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-1.5 block text-sm font-medium text-gray-900">
        ডেলিভারি এলাকা
        <span aria-hidden className="ml-0.5 text-sale">
          *
        </span>
      </legend>
      <div className="space-y-2">
        {zones.map((zone) => (
          <label
            key={zone.key}
            className={clsx(
              "flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2.5 transition",
              value === zone.key
                ? "border-brand bg-brand/5"
                : "border-gray-300 hover:border-gray-400",
            )}
          >
            <span className="flex items-center gap-2.5">
              <input
                type="radio"
                name="deliveryZone"
                value={zone.key}
                checked={value === zone.key}
                onChange={() => onChange(zone.key)}
                className="size-4 accent-[var(--color-brand)]"
              />
              <span className="text-sm text-gray-900">{zone.label}</span>
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {zone.price === 0 ? "ফ্রি" : formatPrice(zone.price)}
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
function OrderSummary({
  quote,
  quoting,
  zoneLabel,
}: {
  quote: LandingPageQuoteResult | null;
  quoting: boolean;
  zoneLabel?: string;
}) {
  return (
    <dl
      aria-busy={quoting}
      className={clsx(
        "mt-5 space-y-2 rounded-xl bg-gray-50 p-4 text-sm transition-opacity",
        quoting && "opacity-60",
      )}
    >
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
      <div className="flex items-baseline justify-between border-t border-gray-200 pt-2">
        <dt className="text-base font-semibold text-gray-900">সর্বমোট</dt>
        <dd className="text-lg font-bold text-gray-900">
          {quote ? formatPrice(quote.totalAmount) : "—"}
        </dd>
      </div>
    </dl>
  );
}

function Row({ label, value }: { label: string; value: string | null | false }) {
  return (
    <div className="flex items-baseline justify-between">
      <dt className="text-gray-600">{label}</dt>
      <dd className="font-medium text-gray-900">{value || "—"}</dd>
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
      className="rounded-2xl border border-brand/30 bg-brand/5 p-6 text-center"
    >
      <p className="text-lg font-semibold text-gray-900">
        {heading || "ধন্যবাদ! আপনার অর্ডারটি গ্রহণ করা হয়েছে।"}
      </p>
      <p className="mt-2 text-sm text-gray-700">
        {message || "আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবে।"}
      </p>

      {orderNumber && (
        <p className="mt-4 rounded-lg bg-white px-4 py-3 text-sm">
          <span className="text-gray-600">অর্ডার নম্বর</span>
          <br />
          <strong className="text-base tracking-wide text-gray-900">{orderNumber}</strong>
        </p>
      )}

      <p className="mt-4 text-xs leading-relaxed text-gray-600">
        এই অর্ডার নম্বর এবং আপনার মোবাইল নম্বর দিয়ে{" "}
        <Link href="/track-order" className="font-medium text-brand underline">
          ট্র্যাক অর্ডার
        </Link>{" "}
        পেজ থেকে যেকোনো সময় অর্ডারের অবস্থা দেখতে পারবেন।
      </p>
    </div>
  );
}
