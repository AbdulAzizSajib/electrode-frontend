import { ProductCardSkeleton, SkeletonBlock, SkeletonPage } from "@/components/ui/Skeleton";

/**
 * Mirrors `ProductListing`: the breadcrumb bar, the filter sidebar (full width
 * on mobile, `lg:w-64` beside the grid on desktop), the count-and-sort row, and
 * the same responsive card grid — so the real listing lands where this stood.
 */
export default function ProductsLoading() {
  return (
    <SkeletonPage>
      <div className="mb-6 border-b border-gray-100 pb-4">
        <SkeletonBlock className="h-5 w-40" />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full shrink-0 lg:w-64">
          <SkeletonBlock className="mb-6 h-4 w-24" />
          {Array.from({ length: 6 }, (_, index) => (
            <SkeletonBlock key={index} className="mb-3 h-5 w-full" />
          ))}
        </div>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between gap-3">
            <SkeletonBlock className="h-5 w-24" />
            <SkeletonBlock className="h-9 w-44" />
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }, (_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </SkeletonPage>
  );
}
