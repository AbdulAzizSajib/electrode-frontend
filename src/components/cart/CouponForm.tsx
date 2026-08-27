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

export default function CouponForm({
  appliedCode,
  discountAmount,
}: {
  appliedCode?: string;
  discountAmount: number;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [applyCoupon, { isLoading: isApplying }] = useApplyCouponMutation();
  const [removeCoupon, { isLoading: isRemoving }] = useRemoveCouponMutation();

  async function handleApply(event: React.FormEvent) {
    event.preventDefault();
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

  return (
    <form onSubmit={handleApply} className="mt-4">
      <label htmlFor="coupon" className="mb-1.5 block text-xs font-semibold text-gray-600">
        Discount code
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
        />
        <button
          type="submit"
          disabled={isApplying || !code.trim()}
          className="flex items-center gap-1.5 rounded border border-brand px-4 py-2 text-sm font-semibold text-brand hover:bg-white disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
        >
          {isApplying && <Loader2 size={14} className="animate-spin" />}
          Apply
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </form>
  );
}
