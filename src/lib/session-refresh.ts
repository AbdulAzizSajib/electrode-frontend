import { API_BASE_URL } from "@/lib/api-client";
import { getTokenSecondsRemaining } from "@/lib/jwt";

/**
 * Renewing an expired sign-in, for `proxy.ts`.
 *
 * WHY THE PROXY. A session can only be renewed somewhere that can write the new
 * cookies back, and a Server Component cannot: `cookies().set()` throws during
 * render. This used to be attempted from `getCurrentUser()` anyway. The backend
 * issued new tokens, the write threw, the error was swallowed, and the page
 * rendered signed out — on every request, forever. The proxy runs before the
 * render, can set cookies on the response, and can hand the fresh ones to the
 * very render it precedes, so the renewal takes effect on the same request.
 *
 * Kept free of `next/headers` and `next/server` so the decision below is a
 * plain function that can be tested on its own.
 */

/**
 * Renew when the access token has less than this left, not only once it has
 * expired — a request that starts with seconds to spare would otherwise reach
 * the backend with a token that has expired in transit.
 */
export const REFRESH_MARGIN_SECONDS = 60;

/** How long to wait on the backend before rendering signed out rather than hanging the page. */
const REFRESH_TIMEOUT_MS = 5_000;

export interface SessionCookies {
  accessToken?: string;
  refreshToken?: string;
  sessionToken?: string;
}

/**
 * Whether this request's session should be renewed before anything reads it.
 *
 * Both renewal credentials must be present and the refresh token unexpired:
 * the backend refuses a refresh without the session token, and asking with a
 * dead refresh token would only cost a round trip to be told no. A missing
 * access token counts as expired — the browser drops the cookie at the token's
 * own expiry, so after a day it is simply gone rather than stale.
 */
export function needsSessionRefresh(cookies: SessionCookies): boolean {
  if (!cookies.refreshToken || !cookies.sessionToken) return false;
  if (getTokenSecondsRemaining(cookies.refreshToken) === 0) return false;
  if (!cookies.accessToken) return true;

  return getTokenSecondsRemaining(cookies.accessToken) <= REFRESH_MARGIN_SECONDS;
}

export type SessionRefreshOutcome =
  | {
      kind: "refreshed";
      tokens: { accessToken: string; refreshToken: string; sessionToken: string };
    }
  /** The backend said no: the session is over, and its cookies should go. */
  | { kind: "rejected" }
  /**
   * The backend could not be asked, or answered with something other than a
   * verdict. The cookies are left alone — a network blip must not sign a
   * customer out — and this request simply renders signed out.
   */
  | { kind: "unavailable" };

/**
 * Exchanges the refresh and session tokens for a new token trio.
 *
 * The backend's refresh is stateless — it re-signs from the refresh token and
 * extends the session — so several requests renewing the same expired session
 * at once (a page, its prefetches and a cart call) each get valid tokens; none
 * invalidates another.
 */
export async function requestSessionRefresh(
  refreshToken: string,
  sessionToken: string,
  fetchImpl: typeof fetch = fetch,
): Promise<SessionRefreshOutcome> {
  let response: Response;
  try {
    response = await fetchImpl(`${API_BASE_URL.replace(/\/$/, "")}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
    });
  } catch {
    return { kind: "unavailable" };
  }

  if (response.status === 401 || response.status === 403) {
    return { kind: "rejected" };
  }
  if (!response.ok) {
    return { kind: "unavailable" };
  }

  const body = (await response.json().catch(() => null)) as {
    data?: { accessToken?: unknown; refreshToken?: unknown; sessionToken?: unknown };
  } | null;
  const data = body?.data;

  if (
    typeof data?.accessToken === "string" &&
    typeof data.refreshToken === "string" &&
    typeof data.sessionToken === "string"
  ) {
    return {
      kind: "refreshed",
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        sessionToken: data.sessionToken,
      },
    };
  }

  return { kind: "unavailable" };
}
