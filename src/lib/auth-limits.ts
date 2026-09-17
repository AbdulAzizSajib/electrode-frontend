/**
 * Auth input limits, mirrored from the backend.
 *
 * Source of truth: `server/src/app/module/auth/auth.validation.ts`. These are
 * duplicated here so a form can reject an unacceptable value before spending a
 * round trip, not because the storefront gets a say — the backend re-validates
 * everything. They carry the standing obligation every mirrored limit in this
 * repo carries: change one of the backend's Zod bounds and you must change it
 * here too, or the storefront starts refusing values the API would have taken
 * (or promising ones it will reject).
 *
 * Do not tighten these beyond the backend. A storefront-only password strength
 * rule would reject passwords the API accepts, and the customer would have no
 * way to tell which side refused them.
 */

/** `verifyEmailZodSchema` / `resetPasswordZodSchema`: `.length(4)`. */
export const OTP_LENGTH = 4;

/** `registerUserZodSchema` / `resetPasswordZodSchema`: `.min(6).max(50)`. */
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 50;

/** Shared copy so every password field states the same rule. */
export const PASSWORD_RULE_HINT = `Use at least ${PASSWORD_MIN_LENGTH} characters.`;

/**
 * Validates a password against the mirrored bounds, returning the message to
 * show or `null` when it passes.
 */
export function validatePasswordLength(value: string): string | null {
  if (!value) return "Password is required.";
  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }
  if (value.length > PASSWORD_MAX_LENGTH) {
    return `Password must be at most ${PASSWORD_MAX_LENGTH} characters.`;
  }
  return null;
}
