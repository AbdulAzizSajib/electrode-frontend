import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/*
 * The callback is the one step of Google sign-in that runs on the storefront,
 * and its failures are all silent ones: a customer bounced to the sign-in page
 * with no cookie, or — worse — a cookie written from a refused exchange. The
 * backend is mocked at `apiFetch`, so these pin what this route does with each
 * answer, not the exchange itself (that is `server/scripts/verify-google-exchange.ts`).
 *
 * See server/openspec/changes/fix-google-oauth-cross-domain.
 */

const apiFetch = vi.fn();

vi.mock("@/lib/api-client", async (importActual) => ({
  ...(await importActual<typeof import("@/lib/api-client")>()),
  apiFetch: (...args: unknown[]) => apiFetch(...args),
}));

const { GET } = await import("./route");
const { ApiError } = await import("@/lib/api-client");

const ORIGIN = "https://shop.example.test";

const callback = (query: string) =>
  GET(new NextRequest(`${ORIGIN}/account/oauth/callback?${query}`));

const TRIO = {
  accessToken: "access.jwt.value",
  refreshToken: "refresh.jwt.value",
  sessionToken: "session-token",
};

const setCookieNames = (response: Response) =>
  response.headers
    .getSetCookie()
    .map((cookie) => cookie.split("=")[0]);

beforeEach(() => {
  apiFetch.mockReset();
});

describe("Google OAuth callback", () => {
  it("redeems the code, writes the session cookies and returns to `next`", async () => {
    apiFetch.mockResolvedValue({ data: TRIO });

    const response = await callback("next=%2Fcheckout&code=abc123");

    expect(apiFetch).toHaveBeenCalledWith("/auth/google/exchange", {
      method: "POST",
      body: { code: "abc123" },
    });
    expect(response.headers.get("location")).toBe(`${ORIGIN}/checkout`);
    expect(setCookieNames(response)).toEqual(
      expect.arrayContaining(["accessToken", "refreshToken", "better-auth.session_token"]),
    );
  });

  it("fails without calling the backend when no code is present", async () => {
    const response = await callback("next=%2Fcheckout");

    expect(apiFetch).not.toHaveBeenCalled();
    expect(response.headers.get("location")).toBe(
      `${ORIGIN}/account/login?error=no_session_found`,
    );
    expect(setCookieNames(response)).toEqual([]);
  });

  it("reports a refused code as no_session_found and writes nothing", async () => {
    apiFetch.mockRejectedValue(new ApiError("Invalid or expired sign-in code", 401));

    const response = await callback("code=replayed");

    expect(response.headers.get("location")).toBe(
      `${ORIGIN}/account/login?error=no_session_found`,
    );
    expect(setCookieNames(response)).toEqual([]);
  });

  it("reports an unreachable backend as oauth_failed and writes nothing", async () => {
    apiFetch.mockRejectedValue(new ApiError("Backend unreachable", 0));

    const response = await callback("code=abc123");

    expect(response.headers.get("location")).toBe(
      `${ORIGIN}/account/login?error=oauth_failed`,
    );
    expect(setCookieNames(response)).toEqual([]);
  });

  it("treats an incomplete trio as a failed exchange", async () => {
    apiFetch.mockResolvedValue({ data: { ...TRIO, sessionToken: "" } });

    const response = await callback("code=abc123");

    expect(response.headers.get("location")).toBe(
      `${ORIGIN}/account/login?error=no_session_found`,
    );
    expect(setCookieNames(response)).toEqual([]);
  });

  it("sends an off-site `next` to the account area instead", async () => {
    apiFetch.mockResolvedValue({ data: TRIO });

    const response = await callback("next=%2F%2Fevil.example&code=abc123");

    expect(response.headers.get("location")).toBe(`${ORIGIN}/account`);
  });
});
