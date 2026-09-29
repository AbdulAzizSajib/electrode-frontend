"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  error?: string;
  /**
   * Draws the control in the campaign-page theme tokens instead of this app's
   * literal greys.
   *
   * OPT-IN, AND IT HAS TO BE. This primitive is the account forms' shared field
   * — login, register, password, addresses, guest order lookup and checkout —
   * and every one of those must keep the shop's own colours no matter what a
   * merchant chose for a campaign. So the default branch below is untouched and
   * only a caller that has said so follows the theme.
   *
   * The reason it is a PROP rather than a wrapper's descendant selector: a
   * `[&_input]:text-lp-text` on an ancestor and the class string below land at
   * the same specificity, so which one wins is decided by the order Tailwind
   * happens to emit them in — it rendered grey. A prop is the same decision made
   * where it cannot be lost.
   *
   * Passing `className` is not the alternative either: the `{...props}` spread
   * below puts a caller's `className` AFTER this one, replacing the control's
   * styling rather than adding to it.
   *
   * See server/openspec/changes/add-landing-page-theme-tokens.
   */
  themed?: boolean;
}

export function Field({ label, name, error, themed = false, ...props }: FieldProps) {
  const errorId = `${name}-error`;

  return (
    <div>
      <label
        htmlFor={name}
        className={`mb-1.5 block text-sm font-medium ${
          themed ? "text-lp-muted" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded border px-4 py-3 text-sm outline-none transition-colors ${
          themed
            ? "bg-lp-surface text-lp-text placeholder:text-lp-muted/70"
            : "text-gray-800 placeholder:text-gray-400"
        } ${
          error
            ? "border-red-400 focus:border-red-500"
            : themed
              ? "border-lp-border focus:border-lp-accent"
              : "border-gray-300 focus:border-brand"
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function FormAlert({
  tone,
  children,
}: {
  tone: "error" | "success";
  children: ReactNode;
}) {
  const isError = tone === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-2 rounded border px-3 py-2.5 text-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-green-200 bg-green-50 text-green-700"
      }`}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function SubmitButton({
  pending,
  children,
  pendingText,
  onClick,
  type = "submit",
}: {
  pending: boolean;
  children: ReactNode;
  pendingText: string;
  /** Submits by click rather than form submission — see `type`. */
  onClick?: () => void;
  /**
   * `"button"` when the surrounding markup is a `<div>` rather than a `<form>`,
   * which is how this form renders when nested inside another one (HTML drops a
   * nested `<form>` tag, leaving a submit button wired to the *outer* form).
   */
  type?: "submit" | "button";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded bg-brand py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending && <Loader2 size={16} className="animate-spin" />}
      {pending ? pendingText : children}
    </button>
  );
}
