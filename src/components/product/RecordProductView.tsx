"use client";

import { useEffect, useRef } from "react";

/**
 * Records that a shopper opened this product's page.
 *
 * Fires from the client, not the server render, because the detail page is a
 * cached server component: a write inside it would under-count on every cache
 * hit and fire again for `generateMetadata`, which calls the same loader a
 * second time per page load. A view means "a person opened this page", so it is
 * counted where that actually happens.
 *
 * Fire-and-forget by construction: nothing is awaited before paint, every
 * failure is swallowed, and the response is ignored. The count is a
 * merchandising signal — losing one to a dropped request costs nothing, while
 * letting it interfere with the page would cost a sale.
 *
 * Deliberately not an RTK Query mutation: those live in a cache that can re-run
 * on window refocus, which would count one visit repeatedly.
 *
 * Renders nothing.
 */
export default function RecordProductView({ productId }: { productId: string }) {
  // React runs effects twice in development StrictMode. The backend dedupes
  // this anyway, but there is no reason to send the second request.
  const sent = useRef<string | null>(null);

  useEffect(() => {
    if (sent.current === productId) return;
    sent.current = productId;

    void fetch(`/api/products/${productId}/views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // The marker the backend requires: it distinguishes a shopper opening
      // this page from a listing, a preview, or a prefetch.
      body: JSON.stringify({ source: "product_detail" }),
      keepalive: true,
    }).catch(() => {
      // A view that was not recorded is not worth telling anyone about.
    });
  }, [productId]);

  return null;
}
