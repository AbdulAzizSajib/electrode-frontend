"use client";

import { setCurrencyFormat } from "@/lib/format";
import type { CurrencyFormat } from "@/types/store-settings";

/**
 * Applies the merchant's currency format inside the browser bundle.
 *
 * The root layout sets it for the SERVER render pass, but that runs in a different module registry
 * from the client one — so without this, every client component (`ProductCard`, `CartDrawer`,
 * `CouponForm`, the compare table) would hydrate against `format.ts`'s fallback and a store using
 * anything other than `৳`/before/2 would show two different formats on one page.
 *
 * Applied during MODULE EVALUATION of this component, not in an effect. An effect runs after its
 * children have already rendered, which is exactly when the wrong prices would be painted; calling
 * it in the component body means the format is in place before React renders anything beneath the
 * layout. The call is idempotent and derived purely from props, so a double render in StrictMode is
 * harmless.
 *
 * Renders its children rather than nothing, so it wraps the tree and is guaranteed to have run
 * before any of it.
 */
export default function CurrencyFormatProvider({
  format,
  children,
}: {
  format: CurrencyFormat;
  children: React.ReactNode;
}) {
  setCurrencyFormat(format);

  return <>{children}</>;
}
