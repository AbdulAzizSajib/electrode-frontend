import type { Metadata } from "next";
import CartView from "@/app/(shop)/cart/CartView";
import { getStoreSettings } from "@/services/store-settings";
import { resolveMetadata } from "@/lib/seo/resolve-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();

  return resolveMetadata({
    settings,
    routeGroup: "cart",
    path: "/cart",
    fallbackTitle: "Your Cart",
  });
}

/**
 * The cart itself is cookie-authenticated and fetched client-side, so this
 * server component exists only to read the merchant's checkout settings and
 * hand the one flag the view needs down to it — the same split
 * `/wishlist` uses.
 */
export default async function CartPage() {
  const settings = await getStoreSettings();

  return <CartView showCouponBox={settings.checkoutConfig.showCouponBox} />;
}
