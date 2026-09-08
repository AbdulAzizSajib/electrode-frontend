import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WishlistView from "@/app/(shop)/wishlist/WishlistView";
import { getStoreSettings } from "@/services/store-settings";

export const metadata: Metadata = {
  title: "My Wishlist – Electrode",
};

/**
 * The saved list is per-customer and cookie-authenticated, so it is fetched
 * client-side through the `/api/wishlist` proxy rather than server-rendered —
 * the same treatment the cart gets. `/wishlist` is already gated in
 * `src/proxy.ts`, so an unauthenticated visitor is redirected before arriving.
 */
export default async function WishlistPage() {
  /*
   * A shop that does not offer a wishlist has no wishlist page — an old link, a
   * bookmark or a search result must not land on an empty version of a feature
   * that no longer exists. Read from the settings service rather than the
   * module-scope flags: this is a server component, and the settings fetch is
   * the same tagged, cached one the root layout already made.
   *
   * Note `src/proxy.ts` gates this route on being signed in, so a signed-out
   * visitor reaches sign-in before this runs and sees the 404 afterwards. Odd
   * ordering, but not wrong — and the alternative is duplicating this read into
   * the proxy.
   */
  const settings = await getStoreSettings();
  if (!settings.catalogConfig.showWishlist) notFound();

  return (
    <div className="container-px mx-auto max-w-4xl">
      <WishlistView />
    </div>
  );
}
