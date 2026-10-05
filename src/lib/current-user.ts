import { cache } from "react";
import { decodeAccessToken, isTokenExpired } from "@/lib/jwt";
import { getAccessToken } from "@/lib/session";
import { getCurrentUser as readCurrentUser } from "@/services/auth";
import type { SessionUser } from "@/types/auth";

/**
 * The signed-in customer for this request, read at most once.
 *
 * The shop layout reads the session for the header, and the product, checkout
 * and account pages read it again for their own decisions. Each read is an
 * uncached `/auth/me` round trip, plus a token refresh attempt when the access
 * token has expired. Next's fetch memoization cannot merge them because
 * `apiFetch` passes an `AbortSignal` (see `getStoreSettings`), so a signed-in
 * page view paid for the session twice.
 *
 * This lives outside `services/auth.ts` because that module is `"use server"`:
 * every export there must be an async function, so a `cache()`-wrapped const
 * cannot be exported from it. Server Components import the session from here.
 */
export const getCurrentUser = cache(readCurrentUser);

/**
 * Who is signed in, for page chrome — read from the access token already in
 * the request's cookies, with no network call.
 *
 * The shop layout renders on every page, and it used to await `/auth/me` for
 * this: an uncached backend round trip in front of the first byte of every
 * signed-in page view, just to print a first name. The token's claims already
 * carry the name, and `src/proxy.ts` renews an expiring token before render
 * and writes it onto the request, so the claims read here are current.
 *
 * Decoded, not verified. That is safe because nothing here authorises
 * anything: every customer action is re-checked by the backend against the
 * session and a verified token. It is the same trust `proxy.ts` already gives
 * these claims. Account pages and checkout, which show the profile itself,
 * keep using `getCurrentUser`.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const token = await getAccessToken();
  if (!token || isTokenExpired(token)) return null;

  const claims = decodeAccessToken(token);
  if (!claims || !claims.userId || !claims.isActive || claims.isDeleted) return null;

  return { id: claims.userId, name: claims.name, email: claims.email, role: claims.role };
});
