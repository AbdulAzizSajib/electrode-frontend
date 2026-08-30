import type { Metadata } from "next";
import WishlistView from "@/app/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "My Wishlist – Electrode",
};

/**
 * The saved list is per-customer and cookie-authenticated, so it is fetched
 * client-side through the `/api/wishlist` proxy rather than server-rendered —
 * the same treatment the cart gets. `/wishlist` is already gated in
 * `src/proxy.ts`, so an unauthenticated visitor is redirected before arriving.
 */
export default function WishlistPage() {
  return (
    <div className="container-px mx-auto max-w-4xl">
      <WishlistView />
    </div>
  );
}
