import { cookies } from "next/headers";
import { getTokenSecondsRemaining } from "@/lib/jwt";

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const SESSION_TOKEN_COOKIE = "better-auth.session_token";

const ONE_DAY = 60 * 60 * 24;
const SEVEN_DAYS = ONE_DAY * 7;

/**
 * `secure` + `SameSite=None` is required when the storefront and the API sit on
 * different sites in production, but a `Secure` cookie is silently dropped over
 * plain http — which would make login appear to succeed and then instantly log
 * you out on localhost. So we only harden in production.
 */
const isProduction = process.env.NODE_ENV === "production";

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? ("none" as const) : ("lax" as const),
  path: "/",
};

/**
 * Persists an auth cookie, preferring the token's own lifetime so our cookie
 * never outlives the credential it carries. `better-auth.session_token` is an
 * opaque string (not a JWT), so it always falls back to `fallbackMaxAge`.
 */
async function setAuthCookie(
  name: string,
  value: string,
  fallbackMaxAge: number,
) {
  const cookieStore = await cookies();
  const maxAge = getTokenSecondsRemaining(value) || fallbackMaxAge;

  cookieStore.set(name, value, { ...baseCookieOptions, maxAge });
}

/** Writes the full token trio returned by login / verify-email / refresh. */
export async function setAuthCookies(tokens: {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
}) {
  if (tokens.accessToken) {
    await setAuthCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken, ONE_DAY);
  }
  if (tokens.refreshToken) {
    await setAuthCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken, SEVEN_DAYS);
  }
  if (tokens.token) {
    await setAuthCookie(SESSION_TOKEN_COOKIE, tokens.token, ONE_DAY);
  }
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_COOKIE);
  cookieStore.delete(REFRESH_TOKEN_COOKIE);
  cookieStore.delete(SESSION_TOKEN_COOKIE);
}

export async function getAccessToken() {
  return (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
}

export async function getRefreshToken() {
  return (await cookies()).get(REFRESH_TOKEN_COOKIE)?.value;
}

/**
 * The backend authenticates via cookies, not an Authorization header (see
 * `checkAuth` middleware), so proxied calls must forward them explicitly —
 * a server-side `fetch` sends no cookies of its own.
 */
export async function buildAuthCookieHeader(): Promise<string | null> {
  const cookieStore = await cookies();
  const parts = [
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
    SESSION_TOKEN_COOKIE,
  ]
    .map((name) => {
      const value = cookieStore.get(name)?.value;
      return value ? `${name}=${value}` : null;
    })
    .filter((part): part is string => part !== null);

  return parts.length > 0 ? parts.join("; ") : null;
}
