"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Field, FormAlert, SubmitButton } from "@/components/account/form-controls";
import VerifyEmailForm from "@/components/account/VerifyEmailForm";
import { loginAction } from "@/services/auth";
import { isEmail } from "@/lib/validation";

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [values, setValues] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  // Set when the backend rejects the login because the email was never
  // verified — we swap in the OTP step rather than dead-ending the user.
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const update = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  function validate() {
    const errors: Record<string, string> = {};
    if (!values.email.trim()) errors.email = "Email is required.";
    else if (!isEmail(values.email)) errors.email = "Enter a valid email address.";
    if (!values.password) errors.password = "Password is required.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    startTransition(async () => {
      const result = await loginAction({
        email: values.email,
        password: values.password,
      });

      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      if (result.needsVerification && result.email) {
        setUnverifiedEmail(result.email);
        return;
      }

      router.replace(redirectTo);
      // The header's signed-in state is server-rendered, so refresh to re-run it.
      router.refresh();
    });
  }

  if (unverifiedEmail) {
    return (
      <VerifyEmailForm
        email={unverifiedEmail}
        redirectTo={redirectTo}
        heading="Verify your email"
        description="Your email isn't verified yet. Enter the code we sent you to finish signing in."
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <FormAlert tone="error">{formError}</FormAlert>}

      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={values.email}
        error={fieldErrors.email}
        onChange={(e) => update("email", e.target.value)}
      />

      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={values.password}
        error={fieldErrors.password}
        onChange={(e) => update("password", e.target.value)}
      />

      <div className="flex justify-end">
        <Link
          href="/account/forgot-password"
          className="text-xs font-medium text-brand hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <SubmitButton pending={pending} pendingText="Signing in...">
        Sign In
      </SubmitButton>

      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/account/register"
          className="font-semibold text-brand hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  );
}
