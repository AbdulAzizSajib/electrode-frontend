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
 * The backend finishes OAuth on *its own host* and redirects here. This
 * storefront keeps its session in cookies on *its* host, written from the token
 * trio the backend returns in a response *body* (see `services/auth.ts`). A
 * customer returned straight to a storefront page would hold a valid backend
 * session and still be rendered signed out. This route is the bridge.
 *
 * ## How it bridges: a one-time code, redeemed server to server
 *
 * The backend's redirect carries `?code=`. This route posts it to
 * `POST /auth/google/exchange`, reads `{ accessToken, refreshToken,
 * sessionToken }` from the body, and writes them as this app's cookies.
 *
 * It used to forward the browser's cookies to `refresh-token` instead, on the
 * belief that the backend's session cookies would be among them. They never are
 * on a real deployment: the backend sets them host-only on its own host, and a
 * browser does not send one host's cookies to another. That bridge worked only
 * on localhost, where cookies ignore ports — so Google sign-in passed every
 * local test and failed every production deploy. The code exists so nothing
 * here depends on the browser carrying a cookie across hosts.
 *
 * Why not tokens in the URL: history, proxy logs and `Referer`. The code is
 * useless on its own — single use, 60 seconds, and redeemable only by a server
 * call. This route renders nothing and loads no third-party resource, so the
 * code in its URL has no `Referer` to leak through.
 *
 * See server/openspec/changes/fix-google-oauth-cross-domain.
 *
 * ## A replayed callback URL is expected to fail
 *
 * The code is deleted as it is redeemed, so this URL works exactly once. That
 * is intended: a replayable sign-in URL sitting in browser history is worth
 * avoiding, and a customer who reaches it twice is simply asked to sign in.
 */

/** Tokens `POST /auth/google/exchange` returns. Note `sessionToken`, not `token`. */
interface ExchangedTokens {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
}

/**
 * A redirect to a path on THIS storefront, sent as a RELATIVE `Location`.
 *
 * Never built from `request.url`. Behind cPanel the Next server listens on
 * `0.0.0.0:3000`, and that internal address is what `request.url` carries — so
 * an absolute redirect built from it sent customers to `http://0.0.0.0:3000/…`
 * after a successful Google sign-in (the cookies had been written; only the
 * destination was wrong). A relative `Location` is resolved by the browser
 * against the address it actually requested, so no host is guessed at all.
 *
 * `NextResponse.redirect` rejects relative URLs, hence the plain response.
 * `path` is always one of ours: a literal, or `next` after `safeRedirect`.
 */
function redirectTo(path: string) {
  return new NextResponse(null, { status: 307, headers: { Location: path } });
}

function failed(reason: string) {
  return redirectTo(`/account/login?${new URLSearchParams({ error: reason })}`);
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

  const code = request.nextUrl.searchParams.get("code");

  // No code means the handshake never completed on the backend, or the
  // customer arrived here directly.
  if (!code) return failed("no_session_found");

  let tokens: ExchangedTokens;

  try {
    const { data } = await apiFetch<ExchangedTokens>("/auth/google/exchange", {
      method: "POST",
      body: { code },
    });

    if (!data?.accessToken || !data.refreshToken || !data.sessionToken) {
      return failed("no_session_found");
    }

    tokens = data;
  } catch (error) {
    // 401 is every refusal of the code — expired, replayed, unknown, or a
    // session signed out in between; the backend deliberately does not say
    // which. Anything else (including a status-0 unreachable) means the
    // sign-in did not complete. Either way no cookie is written, so no
    // half-session is left behind.
    return failed(
      error instanceof ApiError && error.status === 401
        ? "no_session_found"
        : "oauth_failed",
    );
  }

  // Written onto the redirect response rather than through `next/headers`
  // `cookies().set()`. This handler's only output IS a redirect, and a redirect
  // response carries its own headers — cookies set on
  // the ambient store are not guaranteed to reach it. `proxy.ts` writes renewed
  // cookies the same way, for the same reason, using the same attributes from
  // `auth-cookies.ts` so the two writers can never disagree about a cookie.
  const response = redirectTo(next);

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
