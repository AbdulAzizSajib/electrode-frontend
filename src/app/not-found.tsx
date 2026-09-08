import Link from "next/link";
import type { Metadata } from "next";

/**
 * Static, and NOT routed through the shared resolver — the one page here that
 * should not be.
 *
 * A 404 must never be indexed no matter what a merchant has configured, so its
 * robots directive is not theirs to set. Reading settings would also mean an
 * API call on a page that exists to be cheap and to work when things are
 * broken.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

/**
 * The 404 shown whenever a route calls `notFound()` — an unknown product
 * handle, an unpublished content page, or a URL that matches nothing.
 *
 * Renders inside the root layout, so the header, footer and bottom nav are
 * still there: a shopper who mistypes a URL should land somewhere they can
 * carry on browsing from, not on a dead end.
 */
export default function NotFound() {
  return (
    <div className="container-px mx-auto flex max-w-2xl flex-col items-center gap-4 py-20 text-center md:py-28">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="text-2xl font-semibold text-gray-900">
        We couldn&apos;t find that page
      </h1>
      <p className="text-gray-600">
        The link may be out of date, or the page may have been moved or removed.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90"
        >
          Back to home
        </Link>
        <Link
          href="/products"
          className="rounded border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Browse products
        </Link>
      </div>
    </div>
  );
}
