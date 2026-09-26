"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  useApplyCouponMutation,
  useRemoveCouponMutation,
} from "@/store/cartApi";
import { formatPrice } from "@/lib/format";

/** Pulls the backend's message (e.g. "Coupon not found") out of an RTK error. */
function errorMessage(error: unknown): string {
  const data = (error as { data?: { message?: unknown } } | undefined)?.data;
  return typeof data?.message === "string"
    ? data.message
    : "That code could not be applied.";
}

/**
 * The coupon box, on the cart page and in the checkout summary.
 *
 * `asForm` is the same escape hatch `AddressForm` carries, and it exists for
 * the same reason: on checkout this renders INSIDE the page's own `<form>`, and
 * a nested `<form>` is not something HTML has. The parser drops the inner start
 * tag and its `</form>` closes the outer one instead, so Apply stopped being a
 * button that applies a coupon and became a plain submit of the checkout form
 * with nothing to stop it — a full page reload, losing everything typed.
 *
 * The cart page has no form around it and passes nothing, so it keeps the real
 * `<form>` and the Enter key that comes with it.
 */
export default function CouponForm({
  appliedCode,
  discountAmount,
  asForm = true,
}: {
  appliedCode?: string;
  discountAmount: number;
  /** False where a `<form>` already encloses this. See above. */
  asForm?: boolean;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemoving }] = useRemoveCouponMutation();

  async function handleApply(event?: React.FormEvent) {
    // Optional: with `asForm` false there is no submit to prevent, the button
    // calls this directly, and Enter is intercepted before it can reach the
    // form this is standing inside.
    event?.preventDefault();
    setError("");

    const trimmed = code.trim();
    if (!trimmed) return;

    try {
      await applyCoupon(trimmed).unwrap();
      setCode("");
    } catch (err) {
      // The cart is untouched on failure — the server rejected the code before
      // changing anything, so only the message needs surfacing.
      setError(errorMessage(err));
    }
  }

  if (appliedCode) {
    return (
      <div className="mt-4 flex items-center justify-between rounded border border-green-200 bg-green-50 px-3 py-2.5 text-sm">
        <span className="text-green-800">
          <span className="font-semibold">{appliedCode}</span> applied
          {discountAmount > 0 && ` (-${formatPrice(discountAmount)})`}
        </span>
        <button
          onClick={() => void removeCoupon()}
          disabled={isRemoving}
          className="text-green-700 hover:text-green-900 disabled:opacity-40"
          aria-label="Remove coupon"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  const Wrapper = asForm ? "form" : "div";

  return (
    <Wrapper
      {...(asForm ? { onSubmit: handleApply } : {})}
      className="mt-4"
    >
      <label htmlFor="coupon" className="mb-1.5 block text-xs font-semibold text-gray-600">
        Coupon code
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
          placeholder="Enter code"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand"
          onKeyDown={(event) => {
            if (asForm || event.key !== "Enter") return;
            /*
             * WITHOUT THIS, ENTER PLACES THE ORDER. There is no form here to
             * submit, so the keystroke reaches the checkout form this is
             * standing in — which is the one whose submit button says Place
             * Order. Stopped and turned into what the shopper meant.
             */
            event.preventDefault();
            void handleApply();
          }}
        />
        <button
          type={asForm ? "submit" : "button"}
          onClick={asForm ? undefined : () => void handleApply()}
          disabled={isApplying || !code.trim()}
          className="flex items-center gap-1.5 rounded border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
        >
          {isApplying && <Loader2 size={14} className="animate-spin" />}
          Apply
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </Wrapper>
  );
}
