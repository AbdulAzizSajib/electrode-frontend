import { proxyRequest } from "@/lib/api-proxy";

/**
 * Submitting a review is authenticated, so it goes through the proxy rather
 * than direct to the backend (public review *reads* go direct — see
 * `src/services/review.ts`).
 *
 * The backend nests creation under the product (`POST /products/:id/reviews`),
 * so the product id travels in the body and is lifted out here, keeping the
 * client's URL stable at `/api/reviews`.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body !== "object") {
    return Response.json(
      { success: false, message: "A review payload is required" },
      { status: 400 },
    );
  }

  const { productId, ...payload } = body as Record<string, unknown>;

  if (typeof productId !== "string" || productId.length === 0) {
    return Response.json(
      { success: false, message: "productId is required" },
      { status: 400 },
    );
  }

  // The body is already consumed, so hand the proxy a fresh Request carrying
  // only the remaining fields. Headers are rebuilt rather than copied: the
  // original `content-length` no longer matches the shortened payload, and the
  // proxy only forwards an allowlist of cookies plus `idempotency-key` anyway.
  const forwarded = new Request(request.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(request.headers.get("cookie")
        ? { cookie: request.headers.get("cookie") as string }
        : {}),
    },
    body: JSON.stringify(payload),
  });

  return proxyRequest(forwarded, `/products/${productId}/reviews`, "POST");
}
