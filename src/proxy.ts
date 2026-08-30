import { NextResponse, type NextRequest } from "next/server";
import { decodeAccessToken } from "@/lib/jwt";

/**
 * Route protection for the storefront.
 *
 * This is a customer-only site (the admin panel is a separate app), so there's
 * no role-based routing here — the only question is "signed in or not".
 *
 * Per the Next.js docs, Proxy is an *optimistic* check, not the authorization
 * boundary: it only reads the token to decide where to send the browser. Every
 * real check still happens on the backend, which re-validates the token's
 * signature on each request. That's why decoding (not verifying) is enough
 * here — and it keeps this Edge-runtime-safe with no crypto dependency.
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

const isMatch = (pathname: string, routes: string[]) =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const claims = accessToken ? decodeAccessToken(accessToken) : null;

  // A token past its `exp` is treated as signed-out here. The session may still
  // be recoverable via the refresh token, so we don't clear cookies — the
  // server-side `getCurrentUser()` refreshes it on the next real request.
  const isSignedIn =
    claims !== null && claims.exp * 1000 > Date.now() && !claims.isDeleted;

  if (isMatch(pathname, AUTH_ROUTES)) {
    if (isSignedIn) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
    return NextResponse.next();
  }

  if (isMatch(pathname, PROTECTED_ROUTES) && !isSignedIn) {
    const loginUrl = new URL("/account/login", request.url);
    // Send the user back where they were headed once they sign in.
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip API routes, Next internals, and anything with a file extension.
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
