/**
 * Turns the failure codes the backend reports after an abandoned or failed
 * Google handshake into something a shopper can act on.
 *
 * The raw value is never rendered. Two reasons: `no_session_found` is backend
 * vocabulary that means nothing to a customer, and the value arrives in a query
 * string, so echoing it verbatim would put attacker-supplied text on the page.
 *
 * Codes come from `server/src/app/module/auth/auth.controller.ts` —
 * `googleLogin`, `googleLoginSuccess` and `handleOAuthError` — plus
 * `oauth_failed`, which this storefront's own callback also emits.
 */
const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  oauth_failed:
    "Google sign-in didn't complete. Please try again, or sign in with your email and password.",
  no_session_found:
    "Google sign-in didn't finish — the session expired before we could confirm it. Please try again.",
  no_user_found:
    "We couldn't find an account for that Google profile. Create an account first, then link it.",
};

const GENERIC =
  "Google sign-in failed. Please try again, or sign in with your email and password.";

/** The message for a failure code, or undefined when there was no failure. */
export function oauthErrorMessage(
  code: string | undefined | null,
): string | undefined {
  if (!code) return undefined;
  return OAUTH_ERROR_MESSAGES[code] ?? GENERIC;
}
