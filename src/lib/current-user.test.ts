import { beforeEach, describe, expect, it, vi } from "vitest";

/*
 * `getSessionUser` reads one cookie and decodes it. The cookie read is the only
 * thing that needs a request, so it is the only thing mocked; the decoding and
 * expiry checks run for real. `services/auth` is mocked only because it is a
 * "use server" module that this file imports for `getCurrentUser`.
 */
const accessToken = vi.fn<() => Promise<string | undefined>>();
vi.mock("@/lib/session", () => ({ getAccessToken: () => accessToken() }));
vi.mock("@/services/auth", () => ({ getCurrentUser: vi.fn() }));

const { getSessionUser } = await import("@/lib/current-user");

const base64url = (value: object) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");

/** An unsigned token: the function decodes claims and never verifies. */
const token = (claims: Record<string, unknown>) =>
  `${base64url({ alg: "HS256", typ: "JWT" })}.${base64url(claims)}.signature`;

const inAnHour = () => Math.floor(Date.now() / 1000) + 3600;

const claims = (overrides: Record<string, unknown> = {}) => ({
  userId: "u1",
  role: "CUSTOMER",
  name: "রহিম উদ্দিন",
  email: "rahim@example.com",
  isActive: true,
  isDeleted: false,
  emailVerified: true,
  iat: Math.floor(Date.now() / 1000),
  exp: inAnHour(),
  ...overrides,
});

describe("getSessionUser", () => {
  beforeEach(() => accessToken.mockReset());

  it("is null with no access token", async () => {
    accessToken.mockResolvedValue(undefined);
    expect(await getSessionUser()).toBeNull();
  });

  it("is null when the token has expired", async () => {
    accessToken.mockResolvedValue(token(claims({ exp: Math.floor(Date.now() / 1000) - 60 })));
    expect(await getSessionUser()).toBeNull();
  });

  it("is null for a deactivated or deleted account", async () => {
    accessToken.mockResolvedValue(token(claims({ isActive: false })));
    expect(await getSessionUser()).toBeNull();
    accessToken.mockResolvedValue(token(claims({ isDeleted: true })));
    expect(await getSessionUser()).toBeNull();
  });

  it("is null for a token that is not a JWT", async () => {
    accessToken.mockResolvedValue("not-a-token");
    expect(await getSessionUser()).toBeNull();
  });

  it("returns the claims' identity, Bangla name intact, without a network call", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    accessToken.mockResolvedValue(token(claims()));

    expect(await getSessionUser()).toEqual({
      id: "u1",
      name: "রহিম উদ্দিন",
      email: "rahim@example.com",
      role: "CUSTOMER",
    });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
