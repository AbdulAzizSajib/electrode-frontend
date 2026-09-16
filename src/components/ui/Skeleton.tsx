import clsx from "clsx";

/**
 * Placeholder shapes for the route `loading.tsx` files.
 *
 * Those files exist so a click shows something immediately: every storefront
 * page renders on the server, and without a Suspense fallback the previous page
 * simply sat there until the new one had finished. The fallback is prefetched
 * with the link, so it appears the moment the shopper taps.
 *
 * Neutral grey rather than the merchant's brand colour — a skeleton is standing
 * in for content, not for chrome. The pulse stops for reduced motion.
 */
export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={clsx("animate-pulse rounded bg-gray-100 motion-reduce:animate-none", className)}
    />
  );
}

/**
 * The frame every skeleton sits in: the page container the real pages use, and
 * one polite announcement so a screen reader hears that the page is loading
 * rather than silence.
 */
export function SkeletonPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-px site-container py-8" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  );
}

/** A product card's footprint: the 7:6 image, two lines of name, the price and the button. */
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4">
      <SkeletonBlock className="aspect-7/6 w-full rounded-md" />
      <SkeletonBlock className="mt-3 h-4 w-11/12" />
      <SkeletonBlock className="mt-2 h-4 w-2/3" />
      <SkeletonBlock className="mt-4 h-5 w-1/3" />
      <SkeletonBlock className="mt-3 h-11 w-full" />
    </div>
  );
}
