"use client";

import { useState } from "react";
import { Field, FormAlert, SubmitButton } from "@/components/account/form-controls";
import { isBdPhone, normalizeBdPhone } from "@/lib/validation";
import { useTrackOrderMutation } from "@/store/orderApi";
import { toOrder, type Order } from "@/types/order";

/**
 * Order number + phone lookup, shared by `/track-order` and the confirmation
 * page's fallback (when a guest's stored phone is gone — a shared link, a new
 * tab, cleared storage). One component so the two cannot drift.
 *
 * The pair is the credential: an order number alone is enumerable, so the
 * backend refuses to answer without the phone the order was placed with.
 */
export default function GuestOrderLookupForm({
  initialOrderNumber = "",
  onFound,
  submitLabel = "Track Order",
}: {
  /** Pre-filled on the confirmation fallback, where the number is already known. */
  initialOrderNumber?: string;
  onFound: (order: Order) => void;
  submitLabel?: string;
}) {
  const [trackOrder, { isLoading }] = useTrackOrderMutation();

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ orderNumber?: string; phone?: string }>({});
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");

    const next: { orderNumber?: string; phone?: string } = {};
    if (!orderNumber.trim()) next.orderNumber = "Order number is required.";
    if (!phone.trim()) next.phone = "Phone number is required.";
    else if (!isBdPhone(phone)) {
      next.phone = "Enter the mobile number the order was placed with.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    try {
      const result = await trackOrder({
        orderNumber: orderNumber.trim(),
        // Normalized so it matches however it was typed at checkout.
        phone: normalizeBdPhone(phone) ?? phone.trim(),
      }).unwrap();

      const data = result?.data;
      if (!data) {
        setFormError("We couldn't find that order. Check the details and try again.");
        return;
      }

      onFound(toOrder(data));
    } catch (error) {
      // The backend answers a wrong phone and an unknown order number with the
      // same message on purpose — relaying it verbatim keeps that property.
      const message = (error as { data?: { message?: unknown } } | undefined)?.data
        ?.message;
      setFormError(
        typeof message === "string"
          ? message
          : "We couldn't find that order. Check the details and try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        label="Order number"
        name="orderNumber"
        value={orderNumber}
        onChange={(e) => {
          setOrderNumber(e.target.value);
          setErrors((prev) => ({ ...prev, orderNumber: "" }));
        }}
        error={errors.orderNumber}
        placeholder="e.g. ORD-20260830-ABC123"
      />
      <Field
        label="Phone number"
        name="phone"
        value={phone}
        onChange={(e) => {
          setPhone(e.target.value);
          setErrors((prev) => ({ ...prev, phone: "" }));
        }}
        error={errors.phone}
        placeholder="01XXXXXXXXX"
        inputMode="tel"
        autoComplete="tel"
      />

      {formError && <FormAlert tone="error">{formError}</FormAlert>}

      <SubmitButton pending={isLoading} pendingText="Looking up...">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
