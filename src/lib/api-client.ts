import type { ApiResponse } from "@/types/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export class ApiError extends Error {
  readonly status: number;
  /** Stable machine-readable code, when the backend supplies one
   * (e.g. `EMAIL_NOT_VERIFIED`, `INVALID_EMAIL_OR_PASSWORD`). */
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

/** Reads better-auth's `error.body.code` off the error envelope, if present. */
function extractErrorCode(body: unknown): string | undefined {
  if (!body || typeof body !== "object") return undefined;

  const code = (body as { error?: { body?: { code?: unknown } } }).error?.body
    ?.code;

  return typeof code === "string" ? code : undefined;
}

/**
 * Pulls the human-readable message out of the backend's error envelope
 * (`{ success: false, message, errorSources? }` — see globalErrorHandler.ts).
 * Validation failures put the useful detail in `errorSources`, so prefer the
 * first of those over the generic top-level message.
 */
function extractErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;

  const payload = body as {
    message?: unknown;
    errorSources?: Array<{ message?: unknown }>;
  };

  const source = payload.errorSources?.[0]?.message;
  if (typeof source === "string" && source.length > 0) return source;

  if (typeof payload.message === "string" && payload.message.length > 0) {
    return payload.message;
  }

  return fallback;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Cookie header to forward — the backend authenticates via cookies. */
  cookie?: string | null;
  cache?: RequestCache;
  /**
   * Seconds to cache this response for. Mutually exclusive with `cache` —
   * Next.js errors if both are set, so passing this drops `cache`. Use it for
   * rarely-changing public data (e.g. the category tree) that would otherwise
   * hit the API on every render.
   */
  revalidate?: number;
  /**
   * Cache tags, so a mutation elsewhere can invalidate this entry before its
   * `revalidate` window elapses. Only meaningful alongside `revalidate` — an
   * uncached (`no-store`) request has nothing to tag.
   */
  tags?: string[];
  /** Abort the request after this many ms. Defaults to 10s. */
  timeoutMs?: number;
}

/** Default request timeout. Prevents a hung backend from stalling a render. */
const DEFAULT_TIMEOUT_MS = 10_000;

/**
 * Thin server-side wrapper over `fetch` for the Ecom API. Throws `ApiError` on
 * a non-2xx response so callers can surface `error.message` directly.
 */
export async function apiFetch<TData>(
  path: string,
  {
    method = "GET",
    body,
    cookie,
    cache = "no-store",
    revalidate,
    tags,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  }: RequestOptions = {},
): Promise<ApiResponse<TData>> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (cookie) headers.Cookie = cookie;

  const url = `${API_BASE_URL.replace(/\/$/, "")}${
    path.startsWith("/") ? path : `/${path}`
  }`;

  // `cache` and `next.revalidate` cannot both be set, so a caller asking for
  // revalidation opts out of the `no-store` default entirely.
  const cacheOptions =
    revalidate === undefined
      ? { cache }
      : { next: { revalidate, ...(tags ? { tags } : {}) } };

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
      ...cacheOptions,
    });
  } catch {
    // Network-level failure or timeout — the API is unreachable, not a 4xx/5xx.
    throw new ApiError(
      "Unable to reach the server. Please check your connection and try again.",
      0,
    );
  }

  const json: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(json, `Request failed (${response.status})`),
      response.status,
      extractErrorCode(json),
    );
  }

  return json as ApiResponse<TData>;
}

/**
 * Reads `Set-Cookie` off a backend response. Login/verify-email also return the
 * tokens in the JSON body, but the backend sets its own cookies too — and those
 * land on the *API's* domain, invisible to this app. We re-issue them from the
 * body instead (see `setAuthCookies`); this helper exists for the one thing the
 * body doesn't carry: the guest-cart token.
 */
export function readSetCookie(response: Response, name: string): string | null {
  const raw = response.headers.getSetCookie?.() ?? [];
  const match = raw.find((cookie) => cookie.startsWith(`${name}=`));
  if (!match) return null;

  const value = match.split(";")[0]?.split("=")[1];
  return value ? decodeURIComponent(value) : null;
}
