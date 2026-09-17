import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_COOKIE_NAMES,
  REFRESH_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE,
  authCookieMaxAge,
  authCookieOptions,
} from "@/lib/auth-cookies";
import { decodeAccessToken } from "@/lib/jwt";
import { needsSessionRefresh, requestSessionRefresh } from "@/lib/session-refresh";

/**
 * Session renewal and route protection for the storefront.
 *
 * This is a customer-only site (the admin panel is a separate app), so there's
 * no role-based routing here — the only question is "signed in or not".
 *
 * Per the Next.js docs, Proxy is an *optimistic* check, not the authorization
 * boundary: it only reads the token to decide where to send the browser. Every
 * real check still happens on the backend, which re-validates the token's
 * signature on each request. That's why decoding (not verifying) is enough
 * here — and it needs no crypto dependency.
 *
 * It is ALSO where an expired sign-in is renewed, because it is the one place
 * that runs before a request is handled and can write cookies. See
 * `lib/session-refresh.ts` for why that cannot happen during render.
 */

/**
 * Requires a signed-in customer.
 *
 * `/checkout` and `/track-order` are deliberately absent: the API accepts an
 * order from a guest carrying their own contact and delivery details, and lets
 * one retrieve that order with its number plus the phone it was placed with.
 * Both pages serve guests and signed-in shoppers on the same path, so gating
 * them here would bounce a guest to login before the page could ever render —
 * the registration wall this whole change exists to remove.
 */
const PROTECTED_ROUTES = [
  "/account",
  "/wishlist",
];

/** Pointless once signed in — bounce these to the account area. */
const AUTH_ROUTES = [
  "/account/login",
  "/account/register",
  "/account/forgot-password",
];

/**
 * Reached mid-handshake, when the customer is signed in *at the backend* but
 * not yet here — establishing that is precisely what these routes do. They sit
 * under `/account`, so without this exemption the protected-prefix match below
 * would bounce the customer to the sign-in screen at the exact moment the
 * sign-in was about to succeed, which reads as Google having rejected them.
 *
 * They must equally not join AUTH_ROUTES: someone who already holds a
 * storefront session but is re-authenticating with Google would be sent to
 * /account before the callback could write the new cookies.
 */
const SESSION_HANDOFF_ROUTES = ["/account/oauth"];

const isMatch = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

/**
 * Renews this request's session when its access token has run out, and returns
 * what the rest of the proxy needs: the access token to judge the request by,
 * and how to write the outcome onto whichever response is sent.
 *
 * The renewed cookies are written to the REQUEST as well as the response. The
 * response carries them to the browser for next time; the request carries them
 * to this render — Server Components read `cookies()` and the `/api/*` handlers
 * forward the raw Cookie header to the backend, and both would otherwise still
 * see the expired token and treat this very request as signed out.
 */
async function renewSession(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
  const sessionToken = request.cookies.get(SESSION_TOKEN_COOKIE)?.value;

  const unchanged = { accessToken, changed: false, apply: (response: NextResponse) => response };

  if (!needsSessionRefresh({ accessToken, refreshToken, sessionToken })) {
    return unchanged;
  }

  const outcome = await requestSessionRefresh(refreshToken!, sessionToken!);

  if (outcome.kind === "refreshed") {
    const renewed = [
      [ACCESS_TOKEN_COOKIE, outcome.tokens.accessToken],
      [REFRESH_TOKEN_COOKIE, outcome.tokens.refreshToken],
      [SESSION_TOKEN_COOKIE, outcome.tokens.sessionToken],
    ] as const;

    for (const [name, value] of renewed) request.cookies.set(name, value);

    return {
      accessToken: outcome.tokens.accessToken,
      changed: true,
      apply: (response: NextResponse) => {
        for (const [name, value] of renewed) {
          response.cookies.set(name, value, {
            ...authCookieOptions,
            maxAge: authCookieMaxAge(name, value),
          });
        }
        return response;
      },
    };
  }

  if (outcome.kind === "rejected") {
    // The backend has ended this session. Clearing the cookies stops every
    // later request asking again, only to be refused again.
    for (const name of AUTH_COOKIE_NAMES) request.cookies.delete(name);

    return {
      accessToken: undefined,
      changed: true,
      apply: (response: NextResponse) => {
        for (const name of AUTH_COOKIE_NAMES) {
          response.cookies.delete({ name, path: authCookieOptions.path });
        }
        return response;
      },
    };
  }

  // Unavailable: cookies left untouched. This request renders signed out, and
  // the next one tries again.
  return unchanged;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const session = await renewSession(request);

  const claims = session.accessToken ? decodeAccessToken(session.accessToken) : null;
  const isSignedIn =
    claims !== null && claims.exp * 1000 > Date.now() && !claims.isDeleted;

  /** Continues to the route, handing it the renewed cookies when there are any. */
  const next = () =>
    session.apply(
      session.changed
        ? NextResponse.next({ request: { headers: request.headers } })
        : NextResponse.next(),
    );

  // Checked before both lists — it belongs to neither.
  if (isMatch(pathname, SESSION_HANDOFF_ROUTES)) {
    return next();
  }

  if (isMatch(pathname, AUTH_ROUTES)) {
    if (isSignedIn) {
      return session.apply(NextResponse.redirect(new URL("/account", request.url)));
    }
    return next();
  }

  if (isMatch(pathname, PROTECTED_ROUTES) && !isSignedIn) {
    const loginUrl = new URL("/account/login", request.url);
    // Send the user back where they were headed once they sign in.
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return session.apply(NextResponse.redirect(loginUrl));
  }

  return next();
}

export const config = {
  matcher: [
    // Pages: skip API routes, Next internals, and anything with a file extension.
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
    /*
     * API routes too, so the cart, wishlist, reviews and checkout calls a page
     * makes from the browser are renewed the same way. `revalidate` is called
     * by the backend and `placeholder` serves images; neither carries a
     * customer's session.
     */
    "/api/((?!revalidate|placeholder).*)",
  ],
};
