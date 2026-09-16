import { cache } from "react";
import { getCurrentUser as readCurrentUser } from "@/services/auth";

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
