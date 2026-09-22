import { ProductCardSkeleton, SkeletonBlock } from "@/components/ui/Skeleton";

/**
 * Placeholders for the homepage sections that load their own data.
 *
 * Each homepage section streams in on its own (see the homepage), and each of
 * these stands in its place until it does. Every one copies its section's
 * container, grid and aspect ratios rather than approximating them, so when the
 * real section arrives it lands on the same footprint instead of pushing the
 * page down — the ratios, not pixel heights, are what keep the two in step at
 * every content width, exactly as the sections themselves explain.
 *
 * Hidden from assistive technology: the route's loading state already
 * announces the page, and a dozen grey boxes read aloud would only be noise.
 */

/**
 * ONE SKELETON PER HERO LAYOUT, and they are not interchangeable.
 *
 * The hero's arrangement is a merchant setting now, so a single placeholder
 * would be right for one store and wrong for three: a `SLIDER_STACK` store
 * shown the default layout's boxes visibly re-flows the moment its banners
 * arrive — the exact layout shift the ratio-based sizing was introduced to
 * eliminate, and one that only appears on a slow connection.
 *
 * They are paired with their layouts in `hero/registry.ts`, in a record
 * TypeScript checks for exhaustiveness, so a layout cannot ship without one.
 */

/** Mirrors `HeroSplitThree`: the slider, then the 43% column of two square tiles over a 43:20 promo. */
export function HeroSplitThreeSkeleton() {
  return (
    <section aria-hidden className="container-px site-container py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <SkeletonBlock className="aspect-4/3 w-full rounded-sm lg:aspect-auto lg:min-w-0 lg:flex-1" />
        <div className="flex w-full flex-col gap-4 lg:w-[43%] lg:flex-none">
          <div className="grid grid-cols-2 gap-4">
            <SkeletonBlock className="aspect-square w-full rounded-sm" />
            <SkeletonBlock className="aspect-square w-full rounded-sm" />
          </div>
          <SkeletonBlock className="aspect-43/20 w-full rounded-sm" />
        </div>
      </div>
    </section>
  );
}

/** Mirrors `HeroSplitOne`: the slider, then one square tile filling the 43% column. */
export function HeroSplitOneSkeleton() {
  return (
    <section aria-hidden className="container-px site-container py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
        <SkeletonBlock className="aspect-4/3 w-full rounded-sm lg:aspect-auto lg:min-w-0 lg:flex-1" />
        <div className="w-full lg:w-[43%] lg:flex-none">
          <SkeletonBlock className="aspect-square w-full rounded-sm" />
        </div>
      </div>
    </section>
  );
}

/** Mirrors `HeroFullSlider`: one full-width 3:1 panel, 4:3 when stacked. */
export function HeroFullSliderSkeleton() {
  return (
    <section aria-hidden className="container-px site-container py-4">
      <SkeletonBlock className="aspect-4/3 w-full rounded-sm lg:aspect-3/1" />
    </section>
  );
}

/** Mirrors `HeroSliderStack`: the full-width panel over a row of three 4:3 tiles. */
export function HeroSliderStackSkeleton() {
  return (
    <section aria-hidden className="container-px site-container py-4">
      <div className="flex flex-col gap-4">
        <SkeletonBlock className="aspect-4/3 w-full rounded-sm lg:aspect-3/1" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SkeletonBlock className="aspect-4/3 w-full rounded-sm" />
          <SkeletonBlock className="aspect-4/3 w-full rounded-sm" />
          <SkeletonBlock className="aspect-4/3 w-full rounded-sm" />
        </div>
      </div>
    </section>
  );
}

/** Mirrors `BrandBar`: one row of 128×48 logo tiles. */
export function BrandBarSkeleton() {
  return (
    <section aria-hidden className="container-px site-container py-8">
      <div className="flex items-center justify-between gap-6 overflow-hidden py-6">
        {Array.from({ length: 8 }, (_, index) => (
          <SkeletonBlock key={index} className="h-12 w-32 shrink-0" />
        ))}
      </div>
    </section>
  );
}

/** Mirrors `CategoryGrid`: the heading, then 3 / 4 / 7 tiles across. */
export function CategoryGridSkeleton() {
  return (
    <section aria-hidden className="container-px site-container pb-8">
      <SkeletonBlock className="mb-8 h-7 w-56 max-w-full" />
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className="flex flex-col items-center gap-3 rounded-xl bg-gray-50 p-5">
            <SkeletonBlock className="aspect-5/4 w-full lg:h-28 lg:w-28 lg:aspect-auto" />
            <SkeletonBlock className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </section>
  );
}

/** Mirrors `MidBanners`: three 2:1 tiles, stacked on mobile. */
export function MidBannersSkeleton() {
  return (
    <section aria-hidden className="container-px site-container py-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <SkeletonBlock key={index} className="aspect-2/1 w-full rounded-xl" />
        ))}
      </div>
    </section>
  );
}

/** Mirrors `ProductSection`: the heading row, then six cards (2 / 3 / 6 across). */
export function ProductSectionSkeleton() {
  return (
    <section aria-hidden className="container-px site-container py-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <SkeletonBlock className="h-7 w-64 max-w-[60%]" />
        <SkeletonBlock className="h-5 w-32" />
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: 6 }, (_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

/** Mirrors `DealOfWeek`: the countdown panel, then five cards beside it. */
export function DealOfWeekSkeleton() {
  return (
    <section aria-hidden className="container-px site-container py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
        <SkeletonBlock className="min-h-48 rounded-xl lg:col-span-1" />
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-5 lg:col-span-5">
          {Array.from({ length: 5 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
