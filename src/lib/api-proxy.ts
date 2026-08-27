import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api-client";

/**
 * Shared plumbing for every `/api/*` route handler that proxies the backend.
 *
 * The backend authenticates and identifies carts through httpOnly cookies set
 * on *its* own domain — `accessToken` and the session token for auth,
 * `guestToken` and `appliedCoupon` for the cart. A browser fetch cannot carry
 * those cross-site, and JS cannot read them. So the browser talks to these local
 * routes instead, and they forward the request cookies onward and re-issue
 * whatever the backend sets on this app's own domain.
 *
 * Deliberately dumb: forward the method, body and cookies; relay the status,
 * payload and Set-Cookie back. No business logic lives here — which is what lets
 * a 409 stock conflict or a 404 coupon message reach the client verbatim.
 */

/**
 * Default for cheap reads. Order placement overrides it — see the
 * `timeoutMs` option on `proxyRequest`.
 */
const TIMEOUT_MS = 10_000;

/** Request headers forwarded to the backend beyond cookies and content type. */
const FORWARDED_HEADERS = ["idempotency-key"];

/** Cookies the storefront forwards to the backend. */
const FORWARDED_COOKIES = [
  "guestToken",
  "appliedCoupon",
  "accessToken",
  "refreshToken",
  "better-auth.session_token",
];

function buildCookieHeader(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;

  // Forward only what the backend needs, rather than every cookie the
  // storefront happens to hold.
  const forwarded = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter((part) => FORWARDED_COOKIES.includes(part.split("=")[0]));

  return forwarded.length > 0 ? forwarded.join("; ") : null;
}

/**
 * `Set-Cookie` values from the backend name its own domain and (in production)
 * carry `Secure`/`SameSite=None`. Strip the domain so the cookie binds to the
 * storefront's host, and drop `Secure` in development where the storefront is
 * plain http and the browser would otherwise discard it.
 */
function rewriteSetCookie(value: string): string {
  const isProduction = process.env.NODE_ENV === "production";

  return value
    .split(";")
    .map((part) => part.trim())
    .filter((part) => {
      const lower = part.toLowerCase();
      if (lower.startsWith("domain=")) return false;
      if (!isProduction && lower === "secure") return false;
      return true;
    })
    .join("; ");
}

export async function proxyRequest(
  request: Request,
  path: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  options: { timeoutMs?: number } = {},
): Promise<NextResponse> {
  const { timeoutMs = TIMEOUT_MS } = options;
  const headers: Record<string, string> = { Accept: "application/json" };

  const cookie = buildCookieHeader(request);
  if (cookie) headers.Cookie = cookie;

  // The header set is built from scratch, so anything the backend needs has to
  // be copied across explicitly or it is silently dropped.
  for (const name of FORWARDED_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers[name] = value;
  }

  let body: string | undefined;
  if (method !== "GET" && method !== "DELETE") {
    const text = await request.text();
    if (text) {
      body = text;
      headers["Content-Type"] = "application/json";
    }
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${API_BASE_URL.replace(/\/$/, "")}${path}`, {
      method,
      headers,
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    // A timeout and an unreachable server are NOT the same failure, and
    // conflating them is what made a committed order look like a failed one.
    //
    // Aborting this fetch does not abort the backend handler — it has already
    // received the request and runs to completion. So on a timeout the write
    // may well have succeeded and we simply don't know. Saying "couldn't reach
    // the server, try again" invites a retry of something already done.
    if (error instanceof Error && error.name === "TimeoutError") {
      return NextResponse.json(
        {
          success: false,
          timedOut: true,
          message:
            "The server is taking longer than expected, so we couldn't confirm the outcome. Your request may have gone through — please check before trying again.",
        },
        { status: 504 },
      );
    }

    // Nothing was delivered, so retrying really is safe here.
    return NextResponse.json(
      { success: false, message: "Unable to reach the server. Please try again." },
      { status: 503 },
    );
  }

  const payload = await upstream.json().catch(() => null);

  // Relay the backend's status and message unchanged so the client can surface
  // e.g. "Coupon not found" or an out-of-stock conflict verbatim.
  const response = NextResponse.json(payload ?? { success: upstream.ok }, {
    status: upstream.status,
  });

  for (const raw of upstream.headers.getSetCookie?.() ?? []) {
    response.headers.append("set-cookie", rewriteSetCookie(raw));
  }

  return response;
}
