"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  Field,
  FormAlert,
  SubmitButton,
} from "@/components/account/form-controls";
import {
  PASSWORD_RULE_HINT,
  validatePasswordLength,
} from "@/lib/auth-limits";
import { changePasswordAction } from "@/services/auth";

/**
 * Changing the password of an already signed-in customer.
 *
 * Unlike a reset, this keeps the session: the backend reissues the token trio
 * and `changePasswordAction` stores it, so the customer stays signed in and is
 * confirmed in place rather than bounced to the sign-in screen.
 *
 * A failed save never clears the fields. The most common failure here is a
 * mistyped *current* password, and wiping the new password the customer just
 * composed would punish them for the backend's answer to a different field.
 */
export default function ChangePasswordForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saved, setSaved] = useState(false);

  const update = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setSaved(false);
  };

  function validate() {
    const errors: Record<string, string> = {};

    if (!values.currentPassword) {
      errors.currentPassword = "Enter your current password.";
    }

    const lengthError = validatePasswordLength(values.newPassword);
    if (lengthError) {
      errors.newPassword = lengthError;
    } else if (values.newPassword === values.currentPassword) {
      // Caught here rather than left to the backend: it accepts a no-op change,
      // which would report success without changing anything.
      errors.newPassword = "Choose a password different from your current one.";
    }

    if (values.confirmPassword !== values.newPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setSaved(false);

    if (!validate()) return;

    startTransition(async () => {
      const result = await changePasswordAction({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      setValues({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setSaved(true);
      // The session cookies were rotated by the save; re-run the server render
      // so anything reading them this request sees the new ones.
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <FormAlert tone="error">{formError}</FormAlert>}
      {saved && (
        <FormAlert tone="success">
          Your password has been changed. You&apos;re still signed in.
        </FormAlert>
      )}

      <Field
        label="Current password"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={values.currentPassword}
        error={fieldErrors.currentPassword}
        onChange={(e) => update("currentPassword", e.target.value)}
      />

      <div>
        <Field
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.newPassword}
          error={fieldErrors.newPassword}
          onChange={(e) => update("newPassword", e.target.value)}
        />
        {!fieldErrors.newPassword && (
          <p className="mt-1.5 text-xs text-gray-500">{PASSWORD_RULE_HINT}</p>
        )}
      </div>

      <Field
        label="Confirm new password"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        value={values.confirmPassword}
        error={fieldErrors.confirmPassword}
        onChange={(e) => update("confirmPassword", e.target.value)}
      />

      <SubmitButton pending={pending} pendingText="Saving...">
        Change password
      </SubmitButton>
    </form>
  );
}
