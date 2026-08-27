"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Field, FormAlert, SubmitButton } from "@/components/account/form-controls";
import { resendVerificationOtpAction, verifyEmailAction } from "@/services/auth";

/** The backend validates an exact length (see auth.validation.ts). */
const OTP_LENGTH = 4;

export default function VerifyEmailForm({
  email,
  redirectTo,
  heading = "Verify your email",
  description,
}: {
  email: string;
  redirectTo: string;
  heading?: string;
  description?: string;
}) {
  const router = useRouter();
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

    startTransition(async () => {
      const result = await verifyEmailAction({ email, otp: code });

      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      // Verifying also signs the user in, so go straight to the destination.
      router.replace(redirectTo);
      router.refresh();
    });
  }

  function handleResend() {
    setFormError("");
    setNotice("");

    startResend(async () => {
      const result = await resendVerificationOtpAction(email);
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

        <SubmitButton pending={pending} pendingText="Verifying...">
          Verify &amp; Continue
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
