import { getTokenSecondsRemaining } from "@/lib/jwt";

/**
 * The storefront's auth cookies: their names, attributes and lifetimes.
 *
 * Kept apart from `lib/session.ts` because two different places write them.
 * Server Actions (login, verify-email, logout) write through `next/headers`,
 * and `proxy.ts` writes them when it refreshes an expired session — where
 * `next/headers` is not available. Both must agree on every attribute, or a
 * refreshed cookie would silently fail to replace the one login set.
 */

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const SESSION_TOKEN_COOKIE = "better-auth.session_token";

export const AUTH_COOKIE_NAMES = [
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE,
] as const;

const ONE_DAY = 60 * 60 * 24;
const SEVEN_DAYS = ONE_DAY * 7;

/**
 * `secure` + `SameSite=None` is required when the storefront and the API sit on
 * different sites in production, but a `Secure` cookie is silently dropped over
 * plain http — which would make login appear to succeed and then instantly log
 * you out on localhost. So we only harden in production.
 */
const isProduction = process.env.NODE_ENV === "production";

export const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/",
};

/**
 * How long a cookie should live, in seconds.
 *
 * The two JWTs live exactly as long as the token they carry, so a cookie never
 * outlives its credential.
 *
 * The session token is opaque, so it has no expiry to read, and it gets SEVEN
 * days — the lifetime of the refresh token and of the backend's session, which
 * every refresh extends by another seven. It used to get one day, the same as
 * the access token. The backend refuses a refresh without the session token,
 * so when the browser dropped both cookies together after a day there was
 * nothing left to refresh with, and every customer was signed out a day after
 * signing in, whatever the refresh token said.
 */
export function authCookieMaxAge(name: string, value: string): number {
  if (name === SESSION_TOKEN_COOKIE) return SEVEN_DAYS;

  const remaining = getTokenSecondsRemaining(value);
  if (remaining > 0) return remaining;

  return name === REFRESH_TOKEN_COOKIE ? SEVEN_DAYS : ONE_DAY;
}
