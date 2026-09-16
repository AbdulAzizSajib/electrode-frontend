import { cookies } from "next/headers";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE,
  authCookieMaxAge,
  authCookieOptions,
} from "@/lib/auth-cookies";

export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SESSION_TOKEN_COOKIE };

/**
 * Persists an auth cookie with the lifetime and attributes `auth-cookies.ts`
 * defines — the same ones `proxy.ts` uses when it refreshes a session, so the
 * two writers can never disagree about a cookie.
 */
async function setAuthCookie(name: string, value: string) {
  const cookieStore = await cookies();

  cookieStore.set(name, value, {
    ...authCookieOptions,
    maxAge: authCookieMaxAge(name, value),
  });
}

/** Writes the full token trio returned by login / verify-email. */
export async function setAuthCookies(tokens: {
  accessToken?: string;
  refreshToken?: string;
  token?: string;
}) {
  if (tokens.accessToken) {
    await setAuthCookie(ACCESS_TOKEN_COOKIE, tokens.accessToken);
  }
  if (tokens.refreshToken) {
    await setAuthCookie(REFRESH_TOKEN_COOKIE, tokens.refreshToken);
  }
  if (tokens.token) {
    await setAuthCookie(SESSION_TOKEN_COOKIE, tokens.token);
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
