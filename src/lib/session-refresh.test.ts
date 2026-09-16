import { describe, expect, it } from "vitest";
import {
  REFRESH_MARGIN_SECONDS,
  needsSessionRefresh,
  requestSessionRefresh,
} from "@/lib/session-refresh";
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SESSION_TOKEN_COOKIE,
  authCookieMaxAge,
} from "@/lib/auth-cookies";

/** An unsigned JWT expiring `secondsFromNow` from now — only `exp` is ever read. */
const jwt = (secondsFromNow: number) => {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + secondsFromNow;
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode({ userId: "u1", exp })}.sig`;
};

const DAY = 60 * 60 * 24;

describe("needsSessionRefresh", () => {
  const renewable = { refreshToken: jwt(6 * DAY), sessionToken: "session" };

  it("renews when the access cookie is gone — what the browser does at its expiry", () => {
    expect(needsSessionRefresh({ ...renewable })).toBe(true);
  });

  it("renews when the access token has expired", () => {
    expect(needsSessionRefresh({ ...renewable, accessToken: jwt(-10) })).toBe(true);
  });

  it("renews inside the margin, before the token can expire mid-request", () => {
    expect(needsSessionRefresh({ ...renewable, accessToken: jwt(REFRESH_MARGIN_SECONDS - 5) })).toBe(true);
  });

  it("leaves a healthy access token alone", () => {
    expect(needsSessionRefresh({ ...renewable, accessToken: jwt(DAY) })).toBe(false);
  });

  it("does not ask without a session token, which the backend requires", () => {
    expect(needsSessionRefresh({ refreshToken: jwt(6 * DAY) })).toBe(false);
  });

  it("does not ask with an expired refresh token", () => {
    expect(needsSessionRefresh({ refreshToken: jwt(-10), sessionToken: "session" })).toBe(false);
  });

  it("does nothing for a guest", () => {
    expect(needsSessionRefresh({})).toBe(false);
  });
});

describe("requestSessionRefresh", () => {
  const respond = (status: number, body?: unknown) =>
    (async () =>
      new Response(body === undefined ? null : JSON.stringify(body), { status })) as typeof fetch;

  it("returns the new token trio on success", async () => {
    const outcome = await requestSessionRefresh(
      "r",
      "s",
      respond(200, { data: { accessToken: "a2", refreshToken: "r2", sessionToken: "s2" } }),
    );
    expect(outcome).toEqual({
      kind: "refreshed",
      tokens: { accessToken: "a2", refreshToken: "r2", sessionToken: "s2" },
    });
  });

  it("sends both renewal credentials as cookies", async () => {
    let sentCookie: string | null = null;
    const capture = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      sentCookie = new Headers(init?.headers).get("cookie");
      return new Response(null, { status: 401 });
    }) as typeof fetch;

    await requestSessionRefresh("REFRESH", "SESSION", capture);
    expect(sentCookie).toBe("refreshToken=REFRESH; better-auth.session_token=SESSION");
  });

  it("treats 401 and 403 as the session being over", async () => {
    expect(await requestSessionRefresh("r", "s", respond(401))).toEqual({ kind: "rejected" });
    expect(await requestSessionRefresh("r", "s", respond(403))).toEqual({ kind: "rejected" });
  });

  it("never signs anyone out over an outage or a malformed answer", async () => {
    expect(await requestSessionRefresh("r", "s", respond(500))).toEqual({ kind: "unavailable" });
    expect(await requestSessionRefresh("r", "s", respond(200, { data: {} }))).toEqual({ kind: "unavailable" });
    const offline = (async () => {
      throw new TypeError("fetch failed");
    }) as typeof fetch;
    expect(await requestSessionRefresh("r", "s", offline)).toEqual({ kind: "unavailable" });
  });
});

describe("authCookieMaxAge", () => {
  it("keeps the session token for seven days, as long as the refresh token", () => {
    expect(authCookieMaxAge(SESSION_TOKEN_COOKIE, "opaque")).toBe(7 * DAY);
  });

  it("lets a JWT cookie live exactly as long as its token", () => {
    const age = authCookieMaxAge(ACCESS_TOKEN_COOKIE, jwt(3600));
    expect(age).toBeGreaterThan(3590);
    expect(age).toBeLessThanOrEqual(3600);
  });

  it("falls back by kind for a token whose expiry cannot be read", () => {
    expect(authCookieMaxAge(ACCESS_TOKEN_COOKIE, "not-a-jwt")).toBe(DAY);
    expect(authCookieMaxAge(REFRESH_TOKEN_COOKIE, "not-a-jwt")).toBe(7 * DAY);
  });
});
