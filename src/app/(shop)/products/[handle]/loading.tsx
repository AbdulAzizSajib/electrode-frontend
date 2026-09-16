import { SkeletonBlock, SkeletonPage } from "@/components/ui/Skeleton";

/**
 * Mirrors `ProductDetail`'s top half: the breadcrumb, then the two-column grid
 * of gallery and buy box. The tabs and related products below the fold are left
 * out — nothing a shopper is looking at on arrival.
 *
 * Needed on its own rather than inheriting the listing's skeleton: this segment
 * is nested under `products/`, and a grid of cards standing in for a single
 * product would be the wrong page flashing before the right one.
 */
export default function ProductLoading() {
  return (
    <SkeletonPage>
      <SkeletonBlock className="mb-6 h-5 w-64 max-w-full" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div>
          <SkeletonBlock className="aspect-square w-full rounded-lg" />
          <div className="mt-4 grid grid-cols-5 gap-3">
            {Array.from({ length: 5 }, (_, index) => (
              <SkeletonBlock key={index} className="aspect-square w-full rounded-md" />
            ))}
          </div>
        </div>

        <div>
          <SkeletonBlock className="h-8 w-11/12" />
          <SkeletonBlock className="mt-3 h-8 w-2/3" />
          <SkeletonBlock className="mt-5 h-4 w-40" />
          <SkeletonBlock className="mt-6 h-9 w-48" />
          <SkeletonBlock className="mt-6 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-full" />
          <SkeletonBlock className="mt-2 h-4 w-3/4" />
          <div className="mt-8 flex gap-3">
            <SkeletonBlock className="h-12 w-32" />
            <SkeletonBlock className="h-12 flex-1" />
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
