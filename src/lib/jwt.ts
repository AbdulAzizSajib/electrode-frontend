import type { AccessTokenClaims } from "@/types/auth";

/**
 * Dependency-free JWT *decoding* (no signature verification).
 *
 * The storefront never trusts these claims for authorization — the backend
 * re-validates the token on every `/auth/*` and customer-scoped call. We only
 * decode to read `exp` (is this token worth sending?) and to render the user's
 * name/email without an extra `/auth/me` round-trip. That means no
 * `jsonwebtoken`/`jose` dependency, and it works in the Edge runtime where
 * Node's `crypto` is unavailable.
 */
export function decodeAccessToken(token: string): AccessTokenClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    // base64url -> base64, then pad to a multiple of 4 for atob.
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    // atob gives us latin1 bytes; decodeURIComponent-escape round-trips them
    // back to UTF-8 so non-ASCII names (e.g. Bangla) survive.
    const json = decodeURIComponent(
      Array.from(atob(padded), (char) =>
        `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`,
      ).join(""),
    );

    return JSON.parse(json) as AccessTokenClaims;
  } catch {
    return null;
  }
}

/** Seconds until the token expires; 0 once it has expired or can't be read. */
export function getTokenSecondsRemaining(token: string): number {
  const claims = decodeAccessToken(token);
  if (!claims?.exp) return 0;

  const remaining = claims.exp - Math.floor(Date.now() / 1000);
  return remaining > 0 ? remaining : 0;
}

export function isTokenExpired(token: string): boolean {
  return getTokenSecondsRemaining(token) === 0;
}

/** True while the token is still valid but within `threshold` of expiring. */
export function isTokenExpiringSoon(token: string, threshold = 300): boolean {
  const remaining = getTokenSecondsRemaining(token);
  return remaining > 0 && remaining <= threshold;
}
