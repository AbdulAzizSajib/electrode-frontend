"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import OtpForm from "@/components/account/OtpForm";
import {
  Field,
  FormAlert,
  SubmitButton,
} from "@/components/account/form-controls";
import {
  PASSWORD_RULE_HINT,
  validatePasswordLength,
} from "@/lib/auth-limits";
import { isEmail } from "@/lib/validation";
import {
  forgetPasswordAction,
  resendPasswordResetOtpAction,
  resetPasswordAction,
} from "@/services/auth";

/**
 * Password reset, in two steps: ask for the address, then enter the emailed
 * code together with a new password.
 *
 * The address is held in state between the steps rather than put in the URL —
 * step two is not a page a customer should be able to arrive at cold, and an
 * address in a query string ends up in history and in any `Referer` the page
 * emits.
 *
 * Completing the reset does NOT sign the customer in, and that is deliberate:
 * the backend deletes every session for the account on success (see
 * auth.service.ts `resetPassword`), so there is no session to hand over even in
 * principle. They are sent to sign in with the new password, and the
 * confirmation says so — otherwise being asked to sign in immediately after a
 * successful reset reads as the reset having failed.
 */
export default function ForgotPasswordForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [formError, setFormError] = useState("");

  /** Set once the code has been sent — this is what advances to step two. */
  const [sentTo, setSentTo] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function handleRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    const address = email.trim();
    if (!address) {
      setFieldError("Email is required.");
      return;
    }
    if (!isEmail(address)) {
      setFieldError("Enter a valid email address.");
      return;
    }

    startTransition(async () => {
      const result = await forgetPasswordAction(address);

      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      setSentTo(address.toLowerCase());
    });
  }

  if (sentTo) {
    return (
      <OtpForm
        email={sentTo}
        heading="Enter your reset code"
        description={`Enter the code we sent to ${sentTo} and choose a new password.`}
        submitLabel="Reset password"
        pendingLabel="Resetting..."
        onResend={() => resendPasswordResetOtpAction(sentTo)}
        onValidate={() => {
          const message = validatePasswordLength(newPassword);
          setPasswordError(message ?? "");
          return message;
        }}
        onSubmit={async (otp) => {
          const result = await resetPasswordAction({
            email: sentTo,
            otp,
            newPassword,
          });

          if (!result.ok) return result;

          router.replace("/account/login?reset=1");

          return result;
        }}
      >
        <Field
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={newPassword}
          error={passwordError}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setPasswordError("");
          }}
        />
        <p className="-mt-2 text-xs text-gray-500">{PASSWORD_RULE_HINT}</p>
      </OtpForm>
    );
  }

  return (
    <form onSubmit={handleRequest} noValidate className="space-y-4">
      {formError && <FormAlert tone="error">{formError}</FormAlert>}

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        error={fieldError}
        onChange={(e) => {
          setEmail(e.target.value);
          setFieldError("");
        }}
      />

      <SubmitButton pending={pending} pendingText="Sending code...">
        Send reset code
      </SubmitButton>

      <p className="text-center text-sm text-gray-600">
        Remembered it?{" "}
        <Link
          href="/account/login"
          className="font-semibold text-brand hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
