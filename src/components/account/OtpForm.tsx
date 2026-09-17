"use client";

import { useState, useTransition, type ReactNode } from "react";
import {
  Field,
  FormAlert,
  SubmitButton,
} from "@/components/account/form-controls";
import { OTP_LENGTH } from "@/lib/auth-limits";
import type { ActionResult } from "@/types/auth";

/**
 * The emailed-code step, shared by the two flows that have one: verifying a new
 * account's email, and completing a password reset.
 *
 * It owns the code input, the length rule, resend, and the notice/error
 * surface — everything the two flows do identically. It owns nothing about what
 * success *means*, because that is where they differ: verifying an email signs
 * the customer in (the endpoint returns tokens), while completing a reset
 * deliberately does not (see services/auth.ts `resetPasswordAction`). So the
 * caller passes both actions in and decides what happens afterwards.
 *
 * `children` renders inside the form, below the code field: the reset flow puts
 * its new-password field there. A caller that adds a field is responsible for
 * validating it — `onSubmit` is only reached once the code itself is valid.
 */
export default function OtpForm({
  email,
  heading,
  description,
  submitLabel,
  pendingLabel,
  onSubmit,
  onResend,
  onValidate,
  children,
}: {
  email: string;
  heading: string;
  description?: string;
  submitLabel: string;
  pendingLabel: string;
  /** Called with the trimmed code once it passes the length rule. */
  onSubmit: (otp: string) => Promise<ActionResult>;
  onResend: () => Promise<ActionResult>;
  /**
   * Extra validation for whatever the caller rendered in `children`. Return a
   * message to block submission, or null to proceed.
   */
  onValidate?: () => string | null;
  children?: ReactNode;
}) {
  const [pending, startTransition] = useTransition();
  const [resending, startResend] = useTransition();

  const [otp, setOtp] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const code = otp.trim();
    if (!code) {
      setFieldError("Enter the code we sent you.");
      return;
    }
    if (code.length !== OTP_LENGTH) {
      setFieldError(`The code is ${OTP_LENGTH} digits.`);
      return;
    }

    const extraError = onValidate?.();
    if (extraError) {
      setFormError(extraError);
      return;
    }

    startTransition(async () => {
      const result = await onSubmit(code);

      // A rejected code leaves everything the customer typed in place — the
      // code field included — so a mistyped digit is a correction, not a retype.
      if (!result.ok) setFormError(result.message);
    });
  }

  function handleResend() {
    setFormError("");
    setNotice("");

    startResend(async () => {
      const result = await onResend();
      if (result.ok) {
        setNotice("We've sent a new code to your email.");
      } else {
        setFormError(result.message);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900">{heading}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {description ??
            `Enter the ${OTP_LENGTH}-digit code we sent to ${email}.`}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && <FormAlert tone="error">{formError}</FormAlert>}
        {notice && <FormAlert tone="success">{notice}</FormAlert>}

        <Field
          label="Verification code"
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="1234"
          maxLength={OTP_LENGTH}
          value={otp}
          error={fieldError}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH));
            setFieldError("");
          }}
        />

        {children}

        <SubmitButton pending={pending} pendingText={pendingLabel}>
          {submitLabel}
        </SubmitButton>
      </form>

      <button
        type="button"
        onClick={handleResend}
        disabled={resending}
        className="w-full text-center text-sm text-gray-600 hover:text-brand disabled:opacity-60"
      >
        {resending ? "Sending..." : "Didn't get the code? Resend"}
      </button>
    </div>
  );
}
