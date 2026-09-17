import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE,
  authCookieMaxAge,
  authCookieOptions,
} from "@/lib/auth-cookies";
import { ApiError, apiFetch } from "@/lib/api-client";
import { safeRedirect } from "@/lib/redirect";

/**
 * Where the Google handshake comes back to.
 *
 * ## Why this route has to exist
 *
 * The backend finishes OAuth by setting its session cookies on *its own origin*
 * and issuing a 302 to `FRONTEND_URL`. But this storefront does not read the
 * backend's cookies — it keeps its own, on its own domain, written from the
 * token trio the backend returns in a response *body* (see `services/auth.ts`).
 * That is the whole reason `auth-cookies.ts` hardens to `SameSite=None` in
 * production: the two apps are not assumed to be same-site.
 *
 * So a customer returned straight to a storefront page would arrive holding a
 * perfectly valid backend session and be rendered signed out. This route is the
 * bridge: it forwards the backend cookies the handshake just set, and trades
 * them for a body it can actually read.
 *
 * ## Why `refresh-token` specifically
 *
 * `POST /auth/refresh-token` reads `refreshToken` + `better-auth.session_token`
 * from the request cookies and returns `{ accessToken, refreshToken,
 * sessionToken }` in `data`. It is the only existing endpoint that converts
 * "the browser holds backend cookies" into "the storefront can read tokens", so
 * using it means this whole feature needs no backend change.
 *
 * Alternatives that were rejected (design.md Decision 1):
 *   - Returning the customer straight to their destination. Works only when the
 *     two apps are same-site; fails silently in a split-domain deploy, which is
 *     the deploy this codebase already configures for. It would pass on
 *     localhost and break in production.
 *   - Having the backend redirect with the tokens in the query string. Puts a
 *     bearer credential into browser history, proxy logs and the `Referer`
 *     header.
 *   - A one-time exchange code. Correct, but needs a new backend endpoint and
 *     somewhere to store the codes — out of proportion when refresh-token
 *     already does the job.
 *
 * ## A replayed callback URL is expected to fail
 *
 * `refresh-token` rotates the refresh token, so this URL works exactly once.
 * That is intended, not a bug to fix: the customer holds no storefront session
 * when they first arrive here, so nothing of theirs is invalidated, and a
 * replayable sign-in URL sitting in browser history is worth avoiding.
 */

/** Tokens `POST /auth/refresh-token` returns. Note `sessionToken`, not `token`. */
interface RefreshedTokens {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
}

function failed(request: NextRequest, reason: string) {
  const url = new URL("/account/login", request.url);
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  // Untrusted on return: it has travelled through two redirects and a
  // third-party site since we set it, so it is sanitised exactly as the login
  // page sanitises its own `?redirect`. `/account` rather than `/` as the
  // fallback — someone who just signed in is heading somewhere account-shaped.
  const next = safeRedirect(
    request.nextUrl.searchParams.get("next"),
    "/account",
  );

  const cookie = request.headers.get("cookie");

  // No backend cookies means the handshake never completed — better-auth's
  // state cookie went missing, or the customer arrived here directly.
  if (!cookie) return failed(request, "no_session_found");

  let tokens: RefreshedTokens;

  try {
    const { data } = await apiFetch<RefreshedTokens>("/auth/refresh-token", {
      method: "POST",
      cookie,
    });

    if (!data?.accessToken || !data.refreshToken || !data.sessionToken) {
      return failed(request, "no_session_found");
    }

    tokens = data;
  } catch (error) {
    // 401 means the backend refused the session; anything else (including a
    // status-0 unreachable) is reported the same way, because from the
    // customer's side the sign-in simply did not complete. Either way no
    // cookie is written, so no half-session is left behind.
    return failed(
      request,
      error instanceof ApiError && error.status === 401
        ? "no_session_found"
        : "oauth_failed",
    );
  }

  // Written onto the redirect response rather than through `next/headers`
  // `cookies().set()`. This handler's only output IS a redirect, and a redirect
  // built by `NextResponse.redirect` carries its own headers — cookies set on
  // the ambient store are not guaranteed to reach it. `proxy.ts` writes renewed
  // cookies the same way, for the same reason, using the same attributes from
  // `auth-cookies.ts` so the two writers can never disagree about a cookie.
  const response = NextResponse.redirect(new URL(next, request.url));

  for (const [name, value] of [
    [ACCESS_TOKEN_COOKIE, tokens.accessToken],
    [REFRESH_TOKEN_COOKIE, tokens.refreshToken],
    [SESSION_TOKEN_COOKIE, tokens.sessionToken],
  ] as const) {
    response.cookies.set(name, value, {
      ...authCookieOptions,
      maxAge: authCookieMaxAge(name, value),
    });
  }

  return response;
}
