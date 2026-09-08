"use client";

import { setCatalogFeatures } from "@/lib/catalog-features";
import type { CatalogConfig } from "@/types/store-settings";

/**
 * Applies the merchant's catalog feature flags inside the browser bundle.
 *
 * Exactly `CurrencyFormatProvider`'s job, for exactly its reason: the root layout sets these for the
 * SERVER render pass, but that runs in a different module registry from the client one — so without
 * this, every client component that gates on them (`ProductCard`, `Header`, `MobileBottomNav`,
 * `CompareBar`) would hydrate against `catalog-features.ts`'s all-enabled fallback. A shop with the
 * wishlist turned off would server-render no hearts and then grow them on hydration.
 *
 * Applied during MODULE EVALUATION of this component, not in an effect. An effect runs after its
 * children have already rendered, which is exactly when the withdrawn controls would flash into
 * view. The call is idempotent and derived purely from props, so a double render in StrictMode is
 * harmless.
 *
 * Renders its children rather than nothing, so it wraps the tree and is guaranteed to have run
 * before any of it.
 */
export default function CatalogFeaturesProvider({
  features,
  children,
}: {
  features: CatalogConfig;
  children: React.ReactNode;
}) {
  setCatalogFeatures(features);

  return <>{children}</>;
}
