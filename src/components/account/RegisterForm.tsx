"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Field, FormAlert, SubmitButton } from "@/components/account/form-controls";
import VerifyEmailForm from "@/components/account/VerifyEmailForm";
import { registerAction } from "@/services/auth";
import { isBdPhone, isEmail } from "@/lib/validation";

/** Mirrors the backend's minimum (registerUserZodSchema). */
const MIN_PASSWORD_LENGTH = 8;

export default function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const [pending, startTransition] = useTransition();

  const [values, setValues] = useState({
    name: "",
    email: "",
    contactNumber: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");

  // Registration doesn't issue tokens — the OTP step does. Once the account
  // exists we swap this form out for the verification step.
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  const update = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  function validate() {
    const errors: Record<string, string> = {};

    if (!values.name.trim()) errors.name = "Name is required.";

    if (!values.email.trim()) errors.email = "Email is required.";
    else if (!isEmail(values.email)) errors.email = "Enter a valid email address.";

    if (!values.contactNumber.trim()) {
      errors.contactNumber = "Contact number is required.";
    } else if (!isBdPhone(values.contactNumber)) {
      errors.contactNumber = "Enter a valid number, e.g. 01711000000.";
    }

    if (!values.password) errors.password = "Password is required.";
    else if (values.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    startTransition(async () => {
      const result = await registerAction(values);

      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      setRegisteredEmail(result.email);
    });
  }

  if (registeredEmail) {
    return (
      <VerifyEmailForm
        email={registeredEmail}
        redirectTo={redirectTo}
        heading="Check your email"
        description={`Your account is created. Enter the code we sent to ${registeredEmail} to activate it.`}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <FormAlert tone="error">{formError}</FormAlert>}

      <Field
        label="Full name"
        name="name"
        autoComplete="name"
        placeholder="Karim Rahman"
        value={values.name}
        error={fieldErrors.name}
        onChange={(e) => update("name", e.target.value)}
      />

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
        label="Contact number"
        name="contactNumber"
        type="tel"
        autoComplete="tel"
        placeholder="01711000000"
        value={values.contactNumber}
        error={fieldErrors.contactNumber}
        onChange={(e) => update("contactNumber", e.target.value)}
      />

      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        value={values.password}
        error={fieldErrors.password}
        onChange={(e) => update("password", e.target.value)}
      />

      <SubmitButton pending={pending} pendingText="Creating account...">
        Create Account
      </SubmitButton>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
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
