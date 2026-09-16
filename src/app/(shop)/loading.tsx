import { ProductCardSkeleton, SkeletonBlock, SkeletonPage } from "@/components/ui/Skeleton";

/**
 * The fallback for every shop route without a more specific one — home, cart,
 * checkout, account pages and the rest.
 *
 * Deliberately generic: a heading and a band of cards is close enough to most
 * of those pages that the swap reads as content arriving, not as the layout
 * jumping. The product listing and detail pages, the ones shoppers move between
 * most, have their own shaped skeletons beside them.
 */
export default function ShopLoading() {
  return (
    <SkeletonPage>
      <SkeletonBlock className="mb-6 h-5 w-48" />
      <SkeletonBlock className="mb-8 h-8 w-72 max-w-full" />
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </SkeletonPage>
  );
}
